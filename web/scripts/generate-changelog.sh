#!/bin/bash

CHANGELOG_PATH="../../CHANGELOG.md"
OUTPUT_PATH="../src/data/changelog.json"

# Read first version from CHANGELOG
version=""
changes=()
in_first_version=false

while IFS= read -r line; do
  if [[ $line == "## "* ]]; then
    if [ -z "$version" ]; then
      version="${line#\#\# }"
      in_first_version=true
    else
      break
    fi
  elif [[ $line == "- "* ]] && [ "$in_first_version" = true ]; then
    # Escape double quotes for JSON
    change="${line#- }"
    change="${change//\"/\\\"}"
    changes+=("$change")
  fi
done < "$CHANGELOG_PATH"

# Create output directory
mkdir -p "$(dirname "$OUTPUT_PATH")"

# Generate JSON
echo "{" > "$OUTPUT_PATH"
echo "  \"version\": \"$version\"," >> "$OUTPUT_PATH"
echo "  \"changes\": [" >> "$OUTPUT_PATH"

for i in "${!changes[@]}"; do
  if [ $i -eq $((${#changes[@]} - 1)) ]; then
    echo "    \"${changes[$i]}\"" >> "$OUTPUT_PATH"
  else
    echo "    \"${changes[$i]}\"," >> "$OUTPUT_PATH"
  fi
done

echo "  ]" >> "$OUTPUT_PATH"
echo "}" >> "$OUTPUT_PATH"

echo "✓ Generated changelog.json for v$version"
