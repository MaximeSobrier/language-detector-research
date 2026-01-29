#!/bin/bash

# Create directory if it doesn't exist
mkdir -p benchmarks/opensubtitles

# Array of language codes
CODES=("af" "am" "ar" "as" "az" "be" "bg" "bn" "br" "bs" "ca" "cs" "cy" "da" "de" "el" i"en" "eo" "es" "et" "eu" "fa" "fi" "fr" "fy" "ga" "gd" "gl" "gn" "gu" "he" "hi" "hr" "ht" "hu" "hy" "id" "ig" "is" "it" "ja" "jv" "ka" "kk" "km" "kn" "ko" "ku" "ky" "lg" "li" "ln" "lo" "lt" "lv" "mg" "mk" "ml" "mn" "mr" "ms" "my" "ne" "nl" "no" "ns" "om" "or" "pa" "pl" "ps" "pt" "qu" "rm" "ro" "ru" "sa" "sd" "si" "sk" "sl" "so" "sq" "sr" "su" "sv" "sw" "ta" "te" "th" "tl" "tn" "tr" "ug" "uk" "ur" "uz" "vi" "wo" "xh" "yi" "yo" "zu" "zh")

for CODE in "${CODES[@]}"; do
    # Check if the final .txt file already exists
    if [[ -f "benchmarks/opensubtitles/$CODE.txt" ]]; then
        echo "File benchmarks/opensubtitles/$CODE.txt already exists, skipping..."
        continue
    fi
    
    echo "Downloading $CODE.txt.gz..."
    
    # Download with curl, continue on failure
    if curl -f "https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/mono/$CODE.txt.gz" -o "benchmarks/opensubtitles/$CODE.txt.gz"; then
        echo "Successfully downloaded $CODE.txt.gz"
        
        # Gunzip the file
        if gunzip "benchmarks/opensubtitles/$CODE.txt.gz"; then
            echo "Successfully extracted $CODE.txt"
        else
            echo "Failed to extract $CODE.txt.gz" >&2
        fi
    else
        echo "Failed to download $CODE.txt.gz" >&2
	if curl -f "https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2016/mono/$CODE.txt.gz" -o "benchmarks/opensubtitles/$CODE.txt.gz"; then
	  echo "Successfully downloaded $CODE.txt.gz"
	  gunzip "benchmarks/opensubtitles/$CODE.txt.gz"
	else
	  if curl -f "https://object.pouta.csc.fi/OPUS-MultiHPLT/v2/mono/$CODE.txt.gz" -o "benchmarks/opensubtitles/$CODE.txt.gz"; then
            echo "Successfully downloaded $CODE.txt.gz"
            gunzip "benchmarks/opensubtitles/$CODE.txt.gz"
	  fi
	fi
    fi
done

echo "Download process completed."
