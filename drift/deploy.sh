#!/bin/bash
# Persistent deploy script for drift/
# Uses token from env or falls back to hardcoded

export VERCEL_TOKEN="${VERCEL_TOKEN:-IweWRv7aAsRbs8jpHUNADf8R}"

cd "$(dirname "$0")"

echo "🚀 Deploying drift to Vercel..."
vercel deploy --prod --token "$VERCEL_TOKEN" --yes

echo "✅ Done!"
