const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "characters.json");

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

  const relativeImagePath = `./${path.relative(root, absoluteImagePath).replace(/\\/g, "/")}`;
  character.assets = character.assets || {};
  character.assets.fullBody = relativeImagePath;
  character.assets.thumbnail = relativeImagePath;
  character.activeMarks = { ...(character.activeMarks || {}), images: true };
  character.agentMarks = Array.from(new Set([...(character.agentMarks || []), "[GENERATE_IMAGES]"]));
  character.updatedAt = new Date().toISOString();
  data.savedAt = new Date().toISOString();

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Updated ${characterId}: ${relativeImagePath}`);
}

main();
