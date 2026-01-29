npm install || exit 1
npm run build || exit 1

mkdir benchmarks
huggingface-cli download MAximeSobrier/WiLI-2018-corrected --local-dir ./benchmarks/WiLI-2018-corrected --repo-type dataset
huggingface-cli download openlanguagedata/flores_plus --local-dir ./benchmarks/flores_plus --repo-type dataset
huggingface-cli download MAximeSobrier/Web-multilingual --local-dir ./benchmarks/Web-multilingual --repo-type dataset

mkdir benchmarks/tatoeba
curl https://downloads.tatoeba.org/exports/sentences.tar.bz2 | tar xvj -C ./benchmarks/tatoeba

bash opensubtitle-downloads.sh


# models
curl https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin -o models/fasttext-lid.176.bin
curl https://huggingface.co/cis-lmu/glotlid/resolve/main/model_v3.bin?download=true -o models/glotlid.bin

# bert
cd bert
mkdir models
huggingface-cli download juliensimon/xlm-v-base-language-id --local-dir ./models/xlm-v-base-language-id

python3.9 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install torch==2.0.1 transformers==4.41.2 onnx==1.14.1  onnxruntime==1.16.3
pip uninstall -y numpy
pip install "numpy<2"



npm install || exit 1
npm run build || exit 1


# cld3
cd ../cld3
pip installl gcld3