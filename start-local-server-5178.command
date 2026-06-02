#!/bin/zsh

set -e

cd "$(dirname "$0")"

PORT=5178
URL="http://127.0.0.1:${PORT}/"

echo "Starting OC Character Bible Workbench..."
echo "Folder: $(pwd)"
echo "URL: ${URL}"
echo

if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already running."
  echo "Opening ${URL}"
  open "${URL}"
  echo
  echo "You can close this window."
  read -r "?Press Enter to exit..."
  exit 0
fi

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]; then
  NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
else
  echo "Node.js was not found."
  echo "Install Node.js, then run this script again."
  echo
  read -r "?Press Enter to exit..."
  exit 1
fi

echo "Using Node: ${NODE_BIN}"
echo "Opening ${URL}"
open "${URL}"
echo
echo "Server is running. Keep this window open while using the app."
echo "Press Control-C to stop the server."
echo

PORT=${PORT} "${NODE_BIN}" server.js
