#!/usr/bin/env bash
# Creates the GitHub repo for the pr-fixer-agent demo and seeds the demo issues.
# Prereq: `gh auth login` done. Run from anywhere; operates on this repo.
set -euo pipefail

REPO_NAME="${1:-acme-tasks}"
cd "$(dirname "$0")/.."

if ! gh auth status >/dev/null 2>&1; then
  echo "gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

OWNER="$(gh api user --jq .login)"
echo "Creating ${OWNER}/${REPO_NAME} and pushing..."
gh repo create "${REPO_NAME}" --public --source . --push

echo "Seeding demo issues..."

gh issue create \
  --title "Creating a task with a short title fails with 400" \
  --label bug \
  --body "$(cat <<'EOF'
**What happens**

`POST /tasks` with a perfectly valid short title is rejected:

```
POST /tasks {"title": "Do"}
→ 400 {"error": "title must not be empty"}
```

**What should happen**

Per the README, any non-empty title (after trimming) up to 200 characters is
valid. `"Do"` and even `"X"` should return `201`.

**Notes**

The failing tests are in `tests/validation.test.ts` (`accepts a one-character
title`, `accepts a two-character title`). Whitespace-only titles must still be
rejected.
EOF
)"

gh issue create \
  --title "First page of /tasks skips the first tasks" \
  --label bug \
  --body "$(cat <<'EOF'
**What happens**

With 5 tasks in the store:

```
GET /tasks?page=1&limit=2
→ items: ["Task number 3", "Task number 4"]
```

Page 1 returns the *third* and *fourth* tasks. The first two tasks are
unreachable from any page.

**What should happen**

Pages are 1-based: page 1 should return tasks 1–2, page 2 tasks 3–4, and so on.

**Notes**

Failing tests in `tests/pagination.test.ts` (`returns the first tasks on page 1`,
`returns the next tasks on page 2`). `total` is reported correctly.
EOF
)"

gh issue create \
  --title "status=done filter also returns archived tasks" \
  --label bug \
  --body "$(cat <<'EOF'
**What happens**

`GET /tasks?status=done` returns tasks whose status is `archived` as well as
`done`.

**What should happen**

The `status` filter should return only tasks whose status exactly matches the
requested value — `done` means `done`, nothing else.

**Notes**

There is no covering test for this yet. A fix should come with a regression
test in `tests/` that fails on the current behavior.
EOF
)"

echo
echo "Done: https://github.com/${OWNER}/${REPO_NAME}"
echo "Issues: https://github.com/${OWNER}/${REPO_NAME}/issues"
echo
echo "Next: install the Vercel Connect managed GitHub app on ONLY this repo,"
echo "then tell the agent: fix issue #1 in ${OWNER}/${REPO_NAME}"
