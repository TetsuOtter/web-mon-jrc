#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-test}"

case "$MODE" in
  test)
    HOST_SCRIPT="test:host"
    ;;
  update)
    HOST_SCRIPT="test:update:host"
    ;;
  ui)
    HOST_SCRIPT="test:ui:host"
    ;;
  headed)
    HOST_SCRIPT="test:headed:host"
    ;;
  *)
    echo "Unknown mode: $MODE" >&2
    echo "Usage: bash ./run-e2e.sh [test|update|ui|headed]" >&2
    exit 1
    ;;
esac

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCKER_IMAGE="${E2E_DOCKER_IMAGE:-mcr.microsoft.com/playwright:v1.58.2-jammy}"

run_host() {
  cd "$ROOT_DIR"
  yarn workspace @web-mon-jrc/e2e "$HOST_SCRIPT"
}

if [[ "${E2E_IN_DOCKER:-}" == "1" || "${GITHUB_ACTIONS:-}" == "true" ]]; then
  run_host
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for local E2E runs. Install Docker or run with GITHUB_ACTIONS=true in a clean CI host." >&2
  exit 1
fi

docker run --rm -t \
  -e CI="${CI:-}" \
  -e GITHUB_ACTIONS="${GITHUB_ACTIONS:-}" \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e E2E_IN_DOCKER=1 \
  -v "$ROOT_DIR:/work" \
  -w /work \
  "$DOCKER_IMAGE" \
  bash -lc "corepack enable && yarn install --immutable && yarn workspace @web-mon-jrc/e2e $HOST_SCRIPT"
