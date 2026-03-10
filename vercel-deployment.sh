#!/bin/bash

# Build only for main and dev

echo "Checking build eligibility for branch: $VERCEL_GIT_COMMIT_REF"
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" && "$VERCEL_GIT_COMMIT_REF" != "dev" ]]; then
  echo "🛑 - Branch not tracked. Skipping."
  exit 0
fi

echo "✅ - Branch is tracked and code changed. Proceeding with build..."
exit 1
