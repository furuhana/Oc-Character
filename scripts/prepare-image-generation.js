const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "characters.json");
const assetsDir = path.join(root, "assets");
const tmpDir = path.join(root, "tmp");
const referenceOut = path.join(assetsDir, "current-style-reference.png");
const requestJsonOut = path.join(tmpDir, "image-generation-request.json");
const requestTextOut = path.join(tmpDir, "image-generation-request.txt");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function pickCharacter(data, requestedId) {
  if (requestedId) {
    const found = data.characters.find((character) => character.id === requestedId);
    if (!found) throw new Error(`Character not found: ${requestedId}`);
    return found;
  }

  const marked = data.characters.find((character) => character.activeMarks?.images);
  return marked || data.characters[0];
}

function decodeStyleReference(data) {
  const image = data.settings?.styleReference?.image || "";
  if (!image.startsWith("data:image/")) {
    throw new Error("No uploaded style reference found at settings.styleReference.image.");
  }

  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("Style reference is not a valid base64 data URL.");

  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(referenceOut, Buffer.from(match[2], "base64"));
  return {
    mime: match[1],
    fileName: data.settings?.styleReference?.fileName || "uploaded-reference",
    path: referenceOut,
  };
}

function getFinalPrompt(character) {
  const en = character.metaDesign?.characterImagePrompt?.trim() || "";
  const cn = character.metaDesign?.characterImagePromptCn?.trim() || "";
  if (!en && !cn) {
    throw new Error("Final prompt is empty. Fill metaDesign.characterImagePrompt before image generation.");
  }
  return { en, cn, primary: en || cn };
}

function inferChromaKey(prompt) {
  const rawText = `${prompt.en}\n${prompt.cn}`.toLowerCase();
  const text = rawText
    .split(/[\n.!?。！？]/)
    .filter((sentence) => {
      const hasNegation = /avoid|no |not |without|不要|避免|无/.test(sentence);
      const mentionsEffect = /glow|light|aura|transparent|translucent|semi-transparent|发光|光效|光阵|光环|透明|半透明|漫反射/.test(sentence);
      return !(hasNegation && mentionsEffect);
    })
    .join("\n");
  const hasAny = (patterns) => patterns.some((pattern) => text.includes(pattern));
  const greenOrCyan = hasAny([
    "green",
    "mint",
    "teal",
    "cyan",
    "emerald",
    "healing",
    "treatment",
    "治疗",
    "治愈",
    "薄荷",
    "绿色",
    "青色",
    "青绿",
    "碧色",
    "翠绿",
  ]);
  const magentaOrPink = hasAny(["magenta", "pink", "rose", "violet", "fuchsia", "洋红", "粉色", "玫红", "紫红"]);

  if (greenOrCyan) {
    return {
      color: "#ff00ff",
      name: "magenta",
      reason: "Prompt includes green/cyan/healing or translucent light effects; magenta keeps those effects away from the removable key color.",
    };
  }

  return {
    color: "#00ff00",
    name: "green",
    reason: magentaOrPink
      ? "Prompt includes magenta/pink/violet elements, so green is the safer contrasting key color."
      : "No obvious green/cyan translucent effect conflict was detected, so green is the default key color.",
  };
}

function main() {
  const requestedId = process.argv[2];
  const data = readData();
  const markedForImages = data.characters.filter((character) => character.activeMarks?.images);
  const character = pickCharacter(data, requestedId);
  const reference = decodeStyleReference(data);
  const prompt = getFinalPrompt(character);
  const chromaKey = inferChromaKey(prompt);

  fs.mkdirSync(tmpDir, { recursive: true });

  const request = {
    characterId: character.id,
    characterName: character.coreIdentity?.name || "unnamed",
    selectionWarning:
      !requestedId && markedForImages.length > 1
        ? `Multiple characters have activeMarks.images=true (${markedForImages.length}). The first marked character was selected. Pass a characterId to generate a specific character.`
        : "",
    reference,
    prompt,
    sourceRules: {
      readOnly: [
        "metaDesign.characterImagePrompt",
        "metaDesign.characterImagePromptCn",
        "settings.styleReference.image",
      ],
      forbidden: [
        "GENERATION_RULES.md as prompt material",
        "profile attributes appended directly to image prompt",
        "generation notes appended directly to image prompt",
        "old hard-coded style-reference-muscle.png",
      ],
    },
    outputSuggestion: {
      sourcePng: path.join(assetsDir, `generated-fullbody-${character.id.slice(0, 8)}-source.png`),
      transparentPng: path.join(assetsDir, `generated-fullbody-${character.id.slice(0, 8)}.png`),
    },
    chromaKey,
  };

  fs.writeFileSync(requestJsonOut, JSON.stringify(request, null, 2));
  fs.writeFileSync(
    requestTextOut,
    [
      "Use imagegen in an isolated/projectless thread.",
      "Generate exactly one full-body character illustration.",
      `Style reference: ${reference.path}`,
      "Before calling imagegen, load or attach the style reference as an actual image input; do not rely on this file path as text-only prompt content.",
      "The reference is only for drawing style, body proportion, linework, and coloring method.",
      "Do not copy the reference character identity, face, clothing, pose, props, colors, or background.",
      "",
      "Use ONLY this final prompt as the image subject:",
      prompt.primary,
      "",
      "Chroma-key choice:",
      `Use flat solid ${chromaKey.color} (${chromaKey.name}) because: ${chromaKey.reason}`,
      "If the character has translucent, diffuse, glowing, or semi-transparent elements, keep those effects restrained and avoid using any color close to the chroma key on the character.",
      "Prefer subtle opaque or lightly luminous design elements over complex bright glows whenever the character concept allows it.",
      "",
      "Hard bans: no UI, no infographic, no chart, no diagram, no character sheet, no labels, no text, no scenery, no multiple characters.",
      `Background must be flat solid ${chromaKey.color} chroma key. Do not use ${chromaKey.color} or a visually similar color on the character.`,
    ].join("\n")
  );

  console.log(`Character: ${request.characterName} (${request.characterId})`);
  if (request.selectionWarning) console.warn(`Warning: ${request.selectionWarning}`);
  console.log(`Reference: ${reference.path}`);
  console.log(`Chroma key: ${chromaKey.color} (${chromaKey.reason})`);
  console.log(`Request JSON: ${requestJsonOut}`);
  console.log(`Request text: ${requestTextOut}`);
}

main();
