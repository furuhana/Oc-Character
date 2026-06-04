const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT || 5177);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "characters.json");
const NAME_SAMPLES_FILE = path.join(DATA_DIR, "name-samples.json");
const ASSETS_DIR = path.join(ROOT, "assets");
const GENERATED_SOURCE_DIR = path.join(ASSETS_DIR, "generated-sources");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  response.end(body);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function handleDataApi(request, response) {
  if (request.method === "GET") {
    try {
      const json = await fs.readFile(DATA_FILE, "utf8");
      send(response, 200, json, "application/json; charset=utf-8");
    } catch (error) {
      if (error.code === "ENOENT") {
        send(response, 200, JSON.stringify({ settings: null, characters: [] }, null, 2), "application/json; charset=utf-8");
        return;
      }
      throw error;
    }
    return;
  }

  if (request.method === "PUT" || request.method === "POST") {
    const raw = await readBody(request);
    const parsed = JSON.parse(raw);
    const payload = {
      app: "OC Character Bible Workbench",
      savedAt: new Date().toISOString(),
      settings: parsed.settings || {},
      characters: Array.isArray(parsed.characters) ? parsed.characters : [],
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    send(response, 200, JSON.stringify({ ok: true, file: DATA_FILE }), "application/json; charset=utf-8");
    return;
  }

  send(response, 405, "Method Not Allowed");
}

async function handleNameSamplesApi(request, response) {
  if (request.method === "GET") {
    try {
      const json = await fs.readFile(NAME_SAMPLES_FILE, "utf8");
      send(response, 200, json, "application/json; charset=utf-8");
    } catch (error) {
      if (error.code === "ENOENT") {
        send(response, 200, JSON.stringify({ cultures: {} }, null, 2), "application/json; charset=utf-8");
        return;
      }
      throw error;
    }
    return;
  }

  if (request.method === "PUT" || request.method === "POST") {
    const raw = await readBody(request);
    const parsed = JSON.parse(raw || "{}");
    const payload = {
      app: "OC Character Bible Workbench",
      savedAt: new Date().toISOString(),
      cultures: parsed.cultures && typeof parsed.cultures === "object" ? parsed.cultures : {},
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(NAME_SAMPLES_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    send(response, 200, JSON.stringify({ ok: true, file: NAME_SAMPLES_FILE }), "application/json; charset=utf-8");
    return;
  }

  send(response, 405, "Method Not Allowed");
}

function isLocalAssetPath(value) {
  return typeof value === "string" && value.startsWith("./assets/") && !value.startsWith("./assets/character-placeholder");
}

function resolveInsideAssets(value) {
  if (!isLocalAssetPath(value)) return null;
  const normalized = value.replace(/^\.\//, "").replaceAll("\\", "/");
  const absolute = path.resolve(ROOT, normalized);
  return absolute.startsWith(ASSETS_DIR) ? absolute : null;
}

async function readDataFile() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { app: "OC Character Bible Workbench", settings: {}, characters: [] };
    throw error;
  }
}

async function deleteFileIfExists(absolutePath, deletedFiles) {
  if (!absolutePath || !absolutePath.startsWith(ASSETS_DIR)) return;
  try {
    await fs.unlink(absolutePath);
    deletedFiles.push(path.relative(ROOT, absolutePath).replace(/\\/g, "/"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function collectGeneratedFilesByPrefix(character) {
  const prefix = character.id?.slice(0, 8);
  if (!prefix) return [];
  const candidates = [];
  for (const directory of [ASSETS_DIR, GENERATED_SOURCE_DIR, path.join(ASSETS_DIR, "characters")]) {
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (entry.name.startsWith(`generated-fullbody-${prefix}`) && entry.name.endsWith(".png")) {
          candidates.push(path.join(directory, entry.name));
        }
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return candidates;
}

async function handleDeleteCharacterApi(request, response) {
  if (request.method !== "POST" && request.method !== "DELETE") {
    send(response, 405, "Method Not Allowed");
    return;
  }

  const raw = await readBody(request);
  const parsed = raw ? JSON.parse(raw) : {};
  const id = parsed.id;
  if (!id) {
    send(response, 400, JSON.stringify({ ok: false, error: "Missing character id" }), "application/json; charset=utf-8");
    return;
  }

  const data = await readDataFile();
  const character = data.characters.find((item) => item.id === id);
  if (!character) {
    send(response, 404, JSON.stringify({ ok: false, error: "Character not found" }), "application/json; charset=utf-8");
    return;
  }

  const assetPaths = new Set();
  for (const value of Object.values(character.assets || {})) {
    const absolute = resolveInsideAssets(value);
    if (absolute) assetPaths.add(absolute);
  }
  for (const absolute of await collectGeneratedFilesByPrefix(character)) assetPaths.add(absolute);

  const deletedFiles = [];
  for (const absolute of assetPaths) await deleteFileIfExists(absolute, deletedFiles);

  data.characters = data.characters.filter((item) => item.id !== id);
  data.savedAt = new Date().toISOString();
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  send(response, 200, JSON.stringify({ ok: true, deletedCharacter: id, deletedFiles }), "application/json; charset=utf-8");
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${PORT}`);
  let filePath = decodeURIComponent(url.pathname);
  if (filePath === "/") filePath = "/index.html";
  const absolute = path.resolve(ROOT, `.${filePath}`);
  if (!absolute.startsWith(ROOT)) {
    send(response, 403, "Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(absolute);
    send(response, 200, data, contentTypes[path.extname(absolute).toLowerCase()] || "application/octet-stream");
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      send(response, 404, "Not Found");
      return;
    }
    throw error;
  }
}

const server = http.createServer((request, response) => {
  (async () => {
    if (request.url.startsWith("/api/data")) await handleDataApi(request, response);
    else if (request.url.startsWith("/api/name-samples")) await handleNameSamplesApi(request, response);
    else if (request.url.startsWith("/api/characters/delete")) await handleDeleteCharacterApi(request, response);
    else await serveStatic(request, response);
  })().catch((error) => {
    console.error(error);
    send(response, 500, `Server Error: ${error.message}`);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`OC Character Bible Workbench running at http://127.0.0.1:${PORT}/`);
  console.log(`Data file: ${DATA_FILE}`);
});
