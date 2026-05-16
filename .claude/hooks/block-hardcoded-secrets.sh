#!/usr/bin/env bash
# Block hardcoded credentials/tokens being written into non-dummy source files.
# DummyData.jsx is allowed (it is the deliberate MVP placeholder).
# Any other file that introduces plaintext passwords or API key patterns is blocked.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Allow the designated dummy-data file and test files
case "$FILE_PATH" in
  */DummyData.jsx|*/DummyData.tsx|*.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx) exit 0 ;;
esac

# Detect inline credential patterns
if echo "$NEW_CONTENT" | grep -qiE \
  "(password|passwd|secret|api_?key|auth_?token|access_?token)\s*[:=]\s*['\"][^'\"]{4,}['\"]"; then
  cat >&2 <<'EOF'
BLOCKED: Hardcoded credential or secret detected.

Secrets must not be stored in source files.
  - For development overrides, keep values in app/constants/DummyData.jsx only.
  - For production, use EAS Secrets + expo-constants (CLAUDE.md § Security).

Remove the hardcoded value and use a config/environment approach instead.
EOF
  exit 2
fi

exit 0
