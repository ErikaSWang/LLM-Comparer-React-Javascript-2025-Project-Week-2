#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Reconcile dependencies with the committed lockfile, then rebuild the static
# files served by the preview workflow. Never start a second server here.
npm ci --no-audit --no-fund
npm run build
