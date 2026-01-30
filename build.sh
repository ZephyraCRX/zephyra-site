#!/bin/bash
# sync zephyra memory to website content
MEMORY_DIR="/root/zephyra/memory"
CONTENT_DIR="/root/zephyra/website/content"

mkdir -p "$CONTENT_DIR"

# sync journal entries from memory markdown files
if [ -d "$MEMORY_DIR" ]; then
  echo "syncing from $MEMORY_DIR to $CONTENT_DIR"
  
  # copy json files if they exist in memory
  for f in signals.json journal.json projects.json; do
    [ -f "$MEMORY_DIR/$f" ] && cp "$MEMORY_DIR/$f" "$CONTENT_DIR/$f" && echo "synced $f"
  done
fi

echo "build complete"
