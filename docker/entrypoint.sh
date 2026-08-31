#!/usr/bin/env bash
set -euo pipefail

# Installs happen inside the container because node_modules live in named
# volumes (the host copies are macOS/arm builds and contain host symlinks).
# A lockfile hash stamp keeps repeated starts cheap: only the one-shot `deps`
# service normally installs, the long running services find the stamp and skip.
install_pkg() {
  local dir="/srv/$1"
  local lock="$dir/package-lock.json"
  local stamp="$dir/node_modules/.lockhash"
  local hash

  if [ ! -f "$dir/package.json" ]; then
    echo "[deps] $1: no package.json, skipping"
    return
  fi

  if [ -f "$lock" ]; then
    hash="$(md5sum "$lock" | cut -d' ' -f1)"
  else
    hash="$(md5sum "$dir/package.json" | cut -d' ' -f1)"
  fi

  if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$hash" ]; then
    echo "[deps] $1: up to date"
    return
  fi

  echo "[deps] $1: installing..."
  ( cd "$dir" && npm install )
  mkdir -p "$dir/node_modules"
  echo "$hash" > "$stamp"
  echo "[deps] $1: done"
}

for target in ${INSTALL_TARGETS:-}; do
  install_pkg "$target"
done

exec "$@"
