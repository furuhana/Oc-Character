const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "characters.json");
const characterAssetsDir = path.join(root, "assets", "characters");
const generatedSourceDir = path.join(root, "assets", "generated-sources");

function deleteGeneratedSource(characterId) {
  const sourcePath = path.join(generatedSourceDir, `generated-fullbody-${characterId.slice(0, 8)}-source.png`);
  if (!fs.existsSync(sourcePath)) return null;
  fs.unlinkSync(sourcePath);
  return `./${path.relative(root, sourcePath).replace(/\\/g, "/")}`;
}

function main() {
  const [characterId, imagePathArg] = process.argv.slice(2);
  if (!characterId || !imagePathArg) {
    throw new Error("Usage: node scripts/apply-generated-image.js <characterId> <transparentPngPath>");
  }

  const absoluteImagePath = path.resolve(imagePathArg);
  if (!fs.existsSync(absoluteImagePath)) {
    throw new Error(`Image not found: ${absoluteImagePath}`);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const character = data.characters.find((item) => item.id === characterId);
  if (!character) throw new Error(`Character not found: ${characterId}`);

  fs.mkdirSync(characterAssetsDir, { recursive: true });
  const finalImagePath = path.join(characterAssetsDir, `generated-fullbody-${character.id.slice(0, 8)}.png`);
  if (path.resolve(finalImagePath) !== absoluteImagePath) {
    fs.copyFileSync(absoluteImagePath, finalImagePath);
  }

  const relativeImagePath = `./${path.relative(root, finalImagePath).replace(/\\/g, "/")}`;
  character.assets = character.assets || {};
  character.assets.fullBody = relativeImagePath;
  character.assets.thumbnail = relativeImagePath;
  character.activeMarks = { ...(character.activeMarks || {}), images: true };
  character.agentMarks = (character.agentMarks || []).filter((mark) => typeof mark === "object" && mark);
  character.agentMarks.push({
    id: crypto.randomUUID(),
    mark: "[GENERATE_IMAGES]",
    createdAt: new Date().toISOString(),
  });
  character.updatedAt = new Date().toISOString();
  data.savedAt = new Date().toISOString();

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Updated ${characterId}: ${relativeImagePath}`);
  const deletedSource = deleteGeneratedSource(character.id);
  if (deletedSource) console.log(`Deleted temporary source: ${deletedSource}`);
}

main();
