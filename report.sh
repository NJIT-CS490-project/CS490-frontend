#!/bin/bash

PROJECT_ROOT="$1"
CURRENT_DIR="$(pwd)"

cd "$PROJECT_ROOT"

LOG=''
for file in $(git ls-files); do
  filename=$(basename "$file")
  extension="${filename##*.}"
  case "$extension" in
    "js" | "php" | "css" | "html" | "json" | "sql" | "txt")
      echo -e "$file"
      echo -e "==============================================================="
      echo ""
      echo "\`\`\`"
      echo -e "$(cat $file)"
      echo "\`\`\`"
      echo -e "\n"
      ;;
  esac
done

echo $LOG
