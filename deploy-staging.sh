#!/usr/bin/env bash
#
# Deploy the local project to staging (https://beta.gruff.tm-studio.co.uk/)
#
# Does what docs/STAGING.md "Deploying changes to staging" describes:
#   1. checks git: warns about uncommitted or unpushed changes
#   2. builds the React front end (in the node container)
#   3. rsyncs the project files + build, then the theme and plugins
#   4. recreates the containers if the Docker / PHP / database config changed
#   5. runs the checks from "Checklist after a deploy"
#
# Usage:  ./deploy-staging.sh [options]
#   -n, --dry-run       show what rsync would change, change nothing on the server
#   -y, --yes           don't ask: continue past git warnings, recreate containers if needed
#       --no-build      deploy the existing frontend/build as it is
#       --no-plugins    don't sync wp-content/plugins
#   -h, --help
#
# Needs: Homebrew rsync (brew install rsync), Docker, the SSH alias DigitalOceanTMServer
# and the sudo rule for rsync on the server (see docs/STAGING.md).
#
# Keep this script compatible with macOS's bash 3.2.

set -euo pipefail

# ----------------------------------------------------------------------------
# Settings
# ----------------------------------------------------------------------------
SERVER="DigitalOceanTMServer"
REMOTE_DIR="/data/webs/gruff"
SITE_URL="https://beta.gruff.tm-studio.co.uk"
API_URL="/api/wp-json/"

# Files that need "docker compose up -d" on the server when they change
CONFIG_FILES="docker-compose.yml docker-compose.remote.yml uploads.ini mysql-lowmem.cnf"

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
if [ -t 1 ]; then
  BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BLUE=$'\033[34m'; RESET=$'\033[0m'
else
  BOLD=""; RED=""; GREEN=""; YELLOW=""; BLUE=""; RESET=""
fi

step()  { printf '\n%s==> %s%s\n' "$BOLD$BLUE" "$*" "$RESET"; }
ok()    { printf '%s  ✓ %s%s\n' "$GREEN" "$*" "$RESET"; }
warn()  { printf '%s  ! %s%s\n' "$YELLOW" "$*" "$RESET"; }
fail()  { printf '%s  ✗ %s%s\n' "$RED" "$*" "$RESET" >&2; exit 1; }

confirm() {
  # confirm "Question?" -> returns 0 for yes. With --yes always yes.
  if [ "$ASSUME_YES" = 1 ]; then return 0; fi
  if [ ! -t 0 ]; then return 1; fi
  local answer
  printf '%s  ? %s [y/N] %s' "$YELLOW" "$1" "$RESET"
  read -r answer
  case "$answer" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

usage() { sed -n '2,24p' "$0" | sed 's/^# \{0,1\}//'; }

# ----------------------------------------------------------------------------
# Options
# ----------------------------------------------------------------------------
DRY_RUN=0
ASSUME_YES=0
BUILD=1
PLUGINS=1

while [ $# -gt 0 ]; do
  case "$1" in
    -n|--dry-run)  DRY_RUN=1 ;;
    -y|--yes)      ASSUME_YES=1 ;;
    --no-build)    BUILD=0 ;;
    --no-plugins)  PLUGINS=0 ;;
    -h|--help)     usage; exit 0 ;;
    *)             usage; fail "Unknown option: $1" ;;
  esac
  shift
done

# Always run from the project root (where this script lives)
cd "$(cd "$(dirname "$0")" && pwd)"

printf '%sDeploy to staging%s  %s\n' "$BOLD" "$RESET" "$SITE_URL"
[ "$DRY_RUN" = 1 ] && warn "Dry run: nothing will be changed on the server"

# ----------------------------------------------------------------------------
# 1. Requirements
# ----------------------------------------------------------------------------
step "Checking requirements"

# Homebrew rsync (macOS's openrsync has no --chown)
RSYNC="rsync"
if command -v brew >/dev/null 2>&1 && [ -x "$(brew --prefix)/bin/rsync" ]; then
  RSYNC="$(brew --prefix)/bin/rsync"
fi
if ! "$RSYNC" --version 2>/dev/null | head -1 | grep -q 'rsync  *version 3'; then
  fail "Needs rsync 3 (macOS's openrsync has no --chown): brew install rsync"
fi
ok "rsync: $("$RSYNC" --version | head -1)"

command -v docker >/dev/null 2>&1 || fail "Docker isn't installed"
docker info >/dev/null 2>&1 || fail "Docker isn't running"
ok "Docker is running"

ssh -o BatchMode=yes -o ConnectTimeout=10 "$SERVER" true 2>/dev/null || fail "Can't connect to $SERVER over SSH"
ok "SSH: $SERVER"

[ -f .env ] || fail ".env is missing: this doesn't look like the local project folder"

# ----------------------------------------------------------------------------
# 2. Git
# ----------------------------------------------------------------------------
step "Checking git"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a git repository"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT="$(git rev-parse --short HEAD)"
SUBJECT="$(git log -1 --format=%s)"
ok "Branch $BRANCH at $COMMIT: $SUBJECT"

GIT_WARNINGS=0

CHANGES="$(git status --porcelain)"
if [ -n "$CHANGES" ]; then
  GIT_WARNINGS=1
  warn "There are changes that aren't committed. Staging will get them, but the repository won't have them:"
  printf '%s\n' "$CHANGES" | sed 's/^/      /'
fi

# Unpushed commits (only if the branch tracks a remote branch)
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  git fetch --quiet 2>/dev/null || warn "Couldn't fetch from the remote to compare"
  AHEAD="$(git rev-list --count '@{u}..HEAD')"
  BEHIND="$(git rev-list --count 'HEAD..@{u}')"
  if [ "$AHEAD" -gt 0 ]; then
    GIT_WARNINGS=1
    warn "$AHEAD commit(s) not pushed to $(git rev-parse --abbrev-ref '@{u}')"
  fi
  if [ "$BEHIND" -gt 0 ]; then
    GIT_WARNINGS=1
    warn "$BEHIND commit(s) on $(git rev-parse --abbrev-ref '@{u}') that you haven't pulled"
  fi
else
  GIT_WARNINGS=1
  warn "Branch $BRANCH isn't on GitHub yet (no upstream branch)"
fi

if [ "$GIT_WARNINGS" = 1 ]; then
  confirm "Deploy anyway?" || fail "Stopped. Commit and push first, or run again with --yes"
else
  ok "Everything is committed and pushed"
fi

# ----------------------------------------------------------------------------
# 3. Build the front end
# ----------------------------------------------------------------------------
if [ "$BUILD" = 1 ]; then
  step "Building the React front end"
  docker compose run --rm -e REACT_APP_API_URL="$API_URL" node npm run build
else
  step "Using the existing build (--no-build)"
fi

[ -f frontend/build/index.html ] || fail "frontend/build/index.html is missing: the build failed or hasn't run"
[ -f frontend/build/.htaccess ]  || fail "frontend/build/.htaccess is missing: check frontend/public/.htaccess and rebuild"
ok "frontend/build is ready (index.html, .htaccess)"

# ----------------------------------------------------------------------------
# 4. What changed since the last deploy (for the config check)
# ----------------------------------------------------------------------------
PREVIOUS_COMMIT="$(ssh "$SERVER" "sed -n 's/^commit=//p' '$REMOTE_DIR/.deploy-info' 2>/dev/null" || true)"

CHANGED_CONFIG=""
NGINX_CHANGED=0
if [ -n "$PREVIOUS_COMMIT" ] && git cat-file -e "$PREVIOUS_COMMIT^{commit}" 2>/dev/null; then
  CHANGED_FILES="$(git diff --name-only "$PREVIOUS_COMMIT" -- . ; git ls-files --others --exclude-standard)"
  for f in $CONFIG_FILES; do
    if printf '%s\n' "$CHANGED_FILES" | grep -qx "$f"; then CHANGED_CONFIG="$CHANGED_CONFIG $f"; fi
  done
  if printf '%s\n' "$CHANGED_FILES" | grep -qx "nginx.conf.staging"; then NGINX_CHANGED=1; fi
  ok "Last deploy: $PREVIOUS_COMMIT"
else
  warn "Couldn't tell what was deployed last, so config changes can't be checked"
fi

# Record what is being deployed (not served: the web root is frontend/build)
{
  echo "commit=$(git rev-parse HEAD)"
  echo "branch=$BRANCH"
  echo "uncommitted_changes=$([ -n "$CHANGES" ] && echo yes || echo no)"
  echo "date=$(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "by=$(git config user.name 2>/dev/null || whoami)"
} > .deploy-info

# ----------------------------------------------------------------------------
# 5. Sync
# ----------------------------------------------------------------------------
trap 'rm -f .deploy-info' EXIT

run_rsync() {
  # bash 3.2-safe: pass the options as separate arguments
  "$RSYNC" -az --delete --rsync-path="sudo rsync" --chown=www-data:www-data \
    $( [ "$DRY_RUN" = 1 ] && echo "--dry-run --itemize-changes" || echo "--human-readable --stats" ) \
    "$@"
}

step "Syncing project files and the front-end build"
run_rsync \
  --exclude='wordpress' --exclude='.git' --exclude='node_modules' --exclude='.sass-cache' \
  --exclude='docs' --exclude='backups' --exclude='.env' --exclude='.htpasswd-pma' \
  --exclude='certs' --exclude='logs' --exclude='*.sql' --exclude='*.gz' --exclude='*.zip' \
  --exclude='*.patch' --exclude='.DS_Store' \
  ./ "$SERVER:$REMOTE_DIR/"
ok "Project files"

step "Syncing the theme"
run_rsync --exclude='node_modules' --exclude='.git' --exclude='.DS_Store' \
  ./wordpress/wp-content/themes/ "$SERVER:$REMOTE_DIR/wordpress/wp-content/themes/"
ok "Themes"

if [ "$PLUGINS" = 1 ]; then
  step "Syncing plugins"
  run_rsync --exclude='node_modules' --exclude='.git' --exclude='.DS_Store' \
    ./wordpress/wp-content/plugins/ "$SERVER:$REMOTE_DIR/wordpress/wp-content/plugins/"
  ok "Plugins"
else
  warn "Plugins skipped (--no-plugins)"
fi



if [ "$DRY_RUN" = 1 ]; then
  step "Dry run finished: nothing was changed"
  exit 0
fi

# ----------------------------------------------------------------------------
# 6. Config changes
# ----------------------------------------------------------------------------
if [ -n "$CHANGED_CONFIG" ]; then
  step "Config changed since the last deploy:$CHANGED_CONFIG"
  if confirm "Recreate the containers on the server (docker compose up -d)?"; then
    ssh "$SERVER" "cd '$REMOTE_DIR' && docker compose up -d"
    ok "Containers recreated"
  else
    warn "Run it yourself: ssh $SERVER, then: cd $REMOTE_DIR && docker compose up -d"
  fi
fi

if [ "$NGINX_CHANGED" = 1 ]; then
  step "nginx.conf.staging changed since the last deploy"
  warn "Not applied automatically (needs sudo, and copying it removes certbot's SSL lines)."
  warn "See docs/STAGING.md, \"Config changes\"."
fi

# ----------------------------------------------------------------------------
# 7. Checks (docs/STAGING.md "Checklist after a deploy")
# ----------------------------------------------------------------------------
step "Checking $SITE_URL"

FAILED=0
check_status() {
  # check_status <path> <expected status> <label>
  local status
  status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$SITE_URL$1" || echo 000)"
  if [ "$status" = "$2" ]; then ok "$3 ($1 → $status)"; else warn "$3 ($1 → $status, expected $2)"; FAILED=1; fi
}

check_status "/"          200 "Home page loads"
check_status "/practice"  200 "React route reloads"
check_status "/people"    200 "React route reloads"
check_status "/api/logs/" 404 "Logs aren't public"

if curl -s --max-time 20 "$SITE_URL/api/wp-json/gruff-api/menu" | head -c 1 | grep -q '[[{]'; then
  ok "API returns JSON (/api/wp-json/gruff-api/menu)"
else
  warn "API doesn't return JSON (/api/wp-json/gruff-api/menu)"; FAILED=1
fi

if curl -sI --max-time 20 "$SITE_URL/" | grep -qi '^x-robots-tag:.*noindex'; then
  ok "Search engines kept out (X-Robots-Tag: noindex)"
else
  warn "No X-Robots-Tag: noindex header"; FAILED=1
fi

printf '\n'
if [ "$FAILED" = 1 ]; then
  warn "Deployed $COMMIT, but some checks failed: see Troubleshooting in docs/STAGING.md"
  exit 1
fi
printf '%s%sDeployed %s to %s%s\n' "$BOLD" "$GREEN" "$COMMIT" "$SITE_URL" "$RESET"
printf '  Still to check by hand: images load, and the CMS login works.\n'
