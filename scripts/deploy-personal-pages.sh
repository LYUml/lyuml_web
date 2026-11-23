#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_URL=https://lyuml.github.io BASE_PATH=/ npm run build
touch dist/.nojekyll
pages_git="$(pwd)/.git/personal-pages.git"
if [ ! -d "$pages_git" ]; then
  git init --bare --initial-branch=main "$pages_git"
fi
git --git-dir="$pages_git" --work-tree="$(pwd)/dist" add --all
if ! git --git-dir="$pages_git" --work-tree="$(pwd)/dist" diff --cached --quiet; then
  git --git-dir="$pages_git" --work-tree="$(pwd)/dist" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" commit -m "$(date +%F) Publish personal website"
fi
git --git-dir="$pages_git" --work-tree="$(pwd)/dist" -c credential.helper='!gh auth git-credential' push https://github.com/LYUml/LYUml.github.io.git HEAD:refs/heads/main
