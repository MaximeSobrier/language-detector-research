from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers.onnx import export
from transformers.onnx.features import FeaturesManager
from transformers.onnx import OnnxConfig
from pathlib import Path

MODEL_ID = "xlm-v-base-language-id"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)
model.eval()

# Output directory
onnx_dir = Path("xlm-v-base-language-id/onnx")
onnx_dir.mkdir(exist_ok=True)

# Correct ONNX config
model_type = model.config.model_type  # e.g., "xlm-roberta"
OnnxConfigClass = FeaturesManager.get_config(model_type, "sequence-classification")
onnx_config = OnnxConfigClass(model.config)  # instantiate it

# Export
export(
    preprocessor=tokenizer,
    model=model,
    config=onnx_config,
    opset=14,
    output=onnx_dir / "model.onnx",
)

print("✅ ONNX export completed successfully")
