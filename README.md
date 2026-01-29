This repository contains all the scripts for benchmarking against language-web-detector, BERT, CLD3, fasTText, and GlotLID.


# Structure

``/bert``: run the benchmarks for BERT (node)

``/cld3``: run the benchmarks for CLD3 (python)

``/models``: all the datasets used for language-web-detector benchmarks

``/results``: current results I run. If you rerun the tests, these files will be overwritten.

``/src``: run the benchmarks for ldw, fastText, and GlotLID. Generate the summary tables.

``/summaries``: store the table summary used in the paper


# Prerequisites

In the same folder, clone this repository and languade-detector:

```
git clone https://github.com/MaximeSobrier/language-detector-research.git
git clone https://github.com/MaximeSobrier/language-detector.git
```


You must use Node 16 for fastText and GlotLID.

Python 3.12 was used for CLD3.

You need the HuggingFace CLI to download the public datasets.


# Setup

Run ``setup.sh`` to download the public benchmarks (WiLI-2018-, FLORES+, Tatoeba, OpenSubtitles) and compile the code.

# Tests

Run ``tests.sh`` to run the benchmarks and generate the results in /results.

Then run ``node dist/summary.js`` to generate the summary tables.