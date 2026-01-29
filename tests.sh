# Table 2 + 8
for SIZE in 1k 2k 5k 10k 20k; do
  cp models/ldw-cc-${SIZE}.json ../language-detector/dist/languages.json
  
  node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-${SIZE}.csv
  node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-${SIZE}.csv
  node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=ldw --benchmark=tatoeba --output=results/ldw-tatoeba-${SIZE}.csv
  node dist/benchmark.js --model=ldw --benchmark=opensubtitles --output=results/ldw-opensubtitles-${SIZE}.csv

  node dist/benchmark.js --model=ldw --benchmark=multilingual --multiple --output=results/ldw-multilingual-${SIZE}.csv
done


# Table 4
cp models/ldw-bert-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-bert-20k.csv --errors=results/ldw-wili-bert-20k-errors.csv

cp models/ldw-cld3-10k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-cld3-10k.csv --errors=results/ldw-wili-cld3-10k-errors.csv

cp models/ldw-fasttext-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-fasttext-20k.csv --errors=results/ldw-wili-fasttext-20k-errors.csv
node dist/benchmark.js --model=fasttext --benchmark=wili --output=results/fasttext-wili.csv --errors=results/fasttext-wili-errors.csv
node dist/benchmark.js --model=glotlid --benchmark=wili --output=results/glotlid-wili.csv --errors=results/glotlid-wili-errors.csv


# Table 5
cp models/ldw-bert-20k.json ../language-detector/dist/languages.json
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=ldw --benchmark=tatoeba --output=results/ldw-tatoeba-bert-20k.csv --errors=results/ldw-tatoeba-bert-20k-errors.csv

cp models/ldw-cld3-10k.json ../language-detector/dist/languages.json
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=ldw --benchmark=tatoeba --output=results/ldw-tatoeba-cld3-10k.csv --errors=results/ldw-tatoeba-cld3-10k-errors.csv

cp models/ldw-fasttext-20k.json ../language-detector/dist/languages.json
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=ldw --benchmark=tatoeba --output=results/ldw-tatoeba-fasttext-20k.csv --errors=results/ldw-tatoeba-fasttext-20k-errors.csv
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=fasttext --benchmark=tatoeba --output=results/fasttext-tatoeba.csv --errors=results/fasttext-tatoeba-errors.csv
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --model=glotlid --benchmark=tatoeba --output=results/glotlid-tatoeba.csv --errors=results/glotlid-tatoeba-errors.csv


# Table 6
cp models/ldw-bert-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=opensubtitles --output=results/ldw-opensubtitles-bert-20k.csv --errors=results/ldw-opensubtitles-bert-20k-errors.csv

cp models/ldw-cld3-10k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=opensubtitles --output=results/ldw-opensubtitles-cld3-10k.csv --errors=results/ldw-opensubtitles-cld3-10k-errors.csv

cp models/ldw-fasttext-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=opensubtitles --output=results/ldw-opensubtitles-fasttext-20k.csv --errors=results/ldw-opensubtitles-fasttext-20k-errors.csv
node dist/benchmark.js --model=fasttext --benchmark=opensubtitles --output=results/fasttext-opensubtitles.csv --errors=results/fasttext-opensubtitles-errors.csv
node dist/benchmark.js --model=glotlid --benchmark=opensubtitles --output=results/glotlid-opensubtitles.csv --errors=results/glotlid-opensubtitles-errors.csv


# Table 7
cp models/ldw-bert-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-bert-20k.csv --errors=results/ldw-flores-bert-20k-errors.csv

cp models/ldw-cld3-10k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-cld3-10k.csv --errors=results/ldw-flores-cld3-10k-errors.csv

cp models/ldw-fasttext-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-fasttext-20k.csv --errors=results/ldw-flores-fasttext-20k-errors.csv
node dist/benchmark.js --model=fasttext --benchmark=flores --output=results/fasttext-flores.csv --errors=results/fasttext-flores-errors.csv
node dist/benchmark.js --model=glotlid --benchmark=flores --output=results/glotlid-flores.csv --errors=results/glotlid-flores-errors.csv

# Table 9
cp models/ldw-no-differential-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-no-differential-20k.csv
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-no-differential-20k.csv
node dist/benchmark.js --model=ldw --benchmark=multilingual --output=results/ldw-multilingual-no-differential-20k.csv

cp models/ldw-no-english.20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-no-english-20k.csv
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-no-english-20k.csv
node dist/benchmark.js --model=ldw --benchmark=multilingual --output=results/ldw-multilingual-no-english-20k.csv

cp models/ldw-20k.json ../language-detector/dist/languages.json
node dist/benchmark.js --model=ldw --benchmark=multilingual --output=results/ldw-multilingual-top-20k.csv
node dist/benchmark.js --model=ldw --benchmark=flores --output=results/ldw-flores-final-20k.csv
node dist/benchmark.js --model=ldw --benchmark=wili --output=results/ldw-wili-final-20k.csv

# Table 10
cp models/ldw-cc-20k.json ../language-detector/dist/languages.json
for THRESHOLD in 0.6 0.7 0.9; do
  node dist/benchmark.js --model=ldw --benchmark=multilingual --multiple --output=results/ldw-multilingual-cc-20k-threshold-${THRESHOLD}.csv --threshold=${THRESHOLD}
done

# # Bert
cd bert

node dist/benchmark.js --benchmark=wili --output=../results/bert-wili.csv --errors=../results/bert-wili-errors.csv
node dist/benchmark.js --benchmark=flores --output=../results/bert-flores.csv --errors=../results/bert-flores-errors.csv
node --stack_size=9600000 --max-old-space-size=4096000 dist/benchmark.js --benchmark=tatoeba --output=../results/bert-tatoeba.csv --errors=../results/bert-tatoeba-errors.csv
node dist/benchmark.js --benchmark=opensubtitles --output=../results/bert-opensubtitles.csv --errors=../results/bert-opensubtitles-errors.csv

# cld3
cd ../cld3
source .venv/bin/activate
python benchmark.py --benchmark=wili --output=../results/cld3-wili.csv --errors=../results/cld3-wili-errors.csv
python benchmark.py --benchmark=flores --output=../results/cld3-flores.csv --errors=../results/cld3-flores-errors.csv
python benchmark.py --benchmark=tatoeba --output=../results/cld3-tatoeba.csv --errors=../results/cld3-tatoeba-errors.csv
python benchmark.py --benchmark=opensubtitles --output=../results/cld3-opensubtitles.csv --errors=../results/cld3-opensubtitles-errors.csv