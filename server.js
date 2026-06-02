const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT || 5177);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "characters.json");

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
