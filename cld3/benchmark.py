import os
import csv
import gcld3
import time
import argparse
from typing import Generator, Tuple, Dict, List
import glob

SUPPORTED_LANGUAGES = ['af', 'am', 'ar', 'bg', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fil', 'fr', 'fy', 'ga', 'gd', 'gl', 'gu', 'ha', 'haw', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'iw', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'ny', 'pa', 'pl', 'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh', 'zu']


ISO639_MAPPING = {
    'eng': 'en', 'fra': 'fr', 'deu': 'de', 'spa': 'es', 'por': 'pt',
    'ita': 'it', 'nld': 'nl', 'rus': 'ru', 'jpn': 'ja', 'kor': 'ko',
    'ara': 'ar', 'hin': 'hi', 'ben': 'bn', 'pan': 'pa', 'jav': 'jv',
    'vie': 'vi', 'tur': 'tr', 'pol': 'pl', 'ukr': 'uk', 'ron': 'ro',
    'ces': 'cs', 'ell': 'el', 'hun': 'hu', 'swe': 'sv', 'fin': 'fi',
    'dan': 'da', 'nor': 'no', 'cat': 'ca', 'slk': 'sk', 'hrv': 'hr',
    'srp': 'sr', 'bul': 'bg', 'mkd': 'mk', 'tha': 'th', 'urd': 'ur',
    'fas': 'fa', 'heb': 'he', 'ind': 'id', 'mal': 'ml', 'tel': 'te',
    'kan': 'kn', 'tam': 'ta', 'guj': 'gu', 'mar': 'mr', 'pan': 'pa',
    'afr': 'af', 'eus': 'eu', 'epo': 'eo', 'glg': 'gl', 'kat': 'ka',
    'kaz': 'kk', 'khm': 'km', 'lao': 'lo', 'lit': 'lt', 'lav': 'lv',
}

def get_labels(source: str) -> Dict[str, str]:
    """Load language labels from CSV file."""
    labels = {}
    with open(source, encoding='utf-8') as infile:
        for line in infile:
            parts = line.strip().split(',')
            if len(parts) != 2:
                continue
            label, code = parts
            labels[label.strip()] = code.strip()
    return labels

def read_wili(base_folder: str) -> Generator[Tuple[str, str, str], None, None]:
    """Read WiLI-2018 dataset."""
    labels = get_labels(f"{base_folder}/labels.csv")
    
    for source in [f"{base_folder}/WiLI-2018-fixed-dataset/test.csv", 
                   f"{base_folder}/WiLI-2018-fixed-dataset/train.csv"]:
        if not os.path.exists(source):
            continue
            
        with open(source, encoding='utf-8') as infile:
            for line in infile:
                parts = line.strip().split('",')
                if len(parts) != 2:
                    continue
                text, label = parts
                text = text.strip().lstrip('"')
                label = label.strip()
                
                if label not in labels:
                    continue
                
                code = labels[label]
                yield text, code, ''

def read_flores(base_folder: str) -> Generator[Tuple[str, str, str], None, None]:
    """Read Flores+ dataset."""
    for subfolder in ['dev', 'devtest']:
        folder = f"{base_folder}/{subfolder}"
        if not os.path.exists(folder):
            continue
        
        # Find all .parquet.csv files
        for file in glob.glob(f"{folder}/*.parquet.csv"):
            # Extract language code from filename
            filename = os.path.basename(file)
            lang_code_3 = filename.split('_')[0]
            
            # Convert to 2-letter code
            code = ISO639_MAPPING.get(lang_code_3, lang_code_3)
            
            if code not in SUPPORTED_LANGUAGES:
                continue
            
            with open(file, encoding='utf-8') as infile:
                # Skip header
                next(infile)
                for line in infile:
                    parts = line.strip().split(',')
                    if len(parts) < 5:
                        continue
                    
                    text = parts[4]  # 5th column is text
                    id = parts[0]  # 1st column is ID
                    if not text:
                        continue
                    
                    # sample_id = f"{subfolder}-{id}-{lang_code_3}"
                    sample_id = ""
                    yield text, code, sample_id

def read_tatoeba(base_folder: str) -> Generator[Tuple[str, str, str], None, None]:
    """Read Tatoeba dataset."""
    sentences_file = f"{base_folder}/sentences.csv"
    
    if not os.path.exists(sentences_file):
        return
    
    with open(sentences_file, encoding='utf-8') as infile:
        for line in infile:
            parts = line.strip().split('\t')
            if len(parts) < 3:
                continue
            
            sentence_id, lang_code_3, sentence = parts[0], parts[1], parts[2]
            code = ISO639_MAPPING.get(lang_code_3, lang_code_3)
            
            if code not in SUPPORTED_LANGUAGES:
                continue
            
            yield sentence, code, sentence_id

def read_opensubtitles(base_folder: str, limit: int = 10000) -> Generator[Tuple[str, str, str], None, None]:
    """Read OpenSubtitles dataset."""
    if not os.path.exists(base_folder):
        return
    
    for file in glob.glob(f"{base_folder}/*.txt"):
        total_samples = 0
        code = os.path.basename(file).replace('.txt', '')
        
        if code not in SUPPORTED_LANGUAGES:
            continue
        
        count = 0
        text = ''
        
        with open(file, encoding='utf-8') as infile:
            for line in infile:
                count += 1
                text += ' ' + line.strip()
                
                if count % 10 == 0 and count > 0:  # Batch lines
                    yield text.strip(), code, ""
                    text = ''
                    total_samples += 1
                    
                    if total_samples >= limit:
                        break

def process_dataset(detector: gcld3.NNetLanguageIdentifier, samples: Generator[Tuple[str, str, str], None, None]) -> Tuple[Dict, Dict, float, float, List[List]]:
    """Process dataset and compute metrics."""
    tp = {lang: 0 for lang in SUPPORTED_LANGUAGES}
    fn = {lang: 0 for lang in SUPPORTED_LANGUAGES}
    fp = {lang: 0 for lang in SUPPORTED_LANGUAGES}
    tn = {lang: 0 for lang in SUPPORTED_LANGUAGES}
    sample_counts = {lang: 0 for lang in SUPPORTED_LANGUAGES}
    
    elapsed_ms = 0
    elapsed_ct = 0
    
    errors: List[List] = []
    
    for text, code, sample_id in samples:
        if code not in SUPPORTED_LANGUAGES:
            continue
        
        sample_counts[code] += 1
        
        # Measure detection time
        start = time.time()
        prediction = detector.FindLanguage(text)
        detection_time = (time.time() - start) * 1000
        
        if elapsed_ct < 10000:
            elapsed_ms += detection_time
            elapsed_ct += 1
        
        detected_language = prediction.language if prediction is not None else 'un'
        probability = prediction.probability if prediction is not None else 0.0
        
        # Update metrics for all languages
        for language in SUPPORTED_LANGUAGES:
            if detected_language == language and code == language:
                tp[language] += 1
            elif detected_language == language and code != language:
                fp[language] += 1
            elif detected_language != language and code == language:
                fn[language] += 1
            else:
                tn[language] += 1
        
        # Track errors - only when detection is wrong
        if detected_language != code:
            errors.append([
                sample_id,
                code,
                text.replace('"', "'")
            ])
    
    avg_time = elapsed_ms / elapsed_ct if elapsed_ct > 0 else 0
    return (tp, fn, fp, tn, sample_counts, errors, avg_time)

def compute_and_print_metrics(tp: Dict, fn: Dict, fp: Dict, tn: Dict, sample_counts: Dict, output_file: str, avg_time: float, constructor_time: float):
    """Compute and print evaluation metrics."""
    found_languages = sorted([lang for lang in SUPPORTED_LANGUAGES if sample_counts[lang] > 0])
    stats = {}
    
    with open(output_file, 'w', encoding='utf-8', newline='') as result_file:
        result_writer = csv.writer(result_file)
        result_writer.writerow(['language', 'precision', 'recall', 'accuracy', 'f1-score', 'specificity', 'samples'])
        
        print('language,precision,recall,accuracy,f1-score,specificity,samples')
        
        for language in found_languages:
            if tp[language] + fn[language] == 0:
                print(f"Skip {language} with 0 samples")
                continue
            
            precision = tp[language] / (tp[language] + fp[language]) if (tp[language] + fp[language]) > 0 else 0
            recall = tp[language] / (tp[language] + fn[language]) if (tp[language] + fn[language]) > 0 else 0
            accuracy = (tp[language] + tn[language]) / (tp[language] + fp[language] + tn[language] + fn[language]) if (tp[language] + fp[language] + tn[language] + fn[language]) > 0 else 0
            specificity = tn[language] / (fp[language] + tn[language]) if (fp[language] + tn[language]) > 0 else 0
            f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
            
            stats[language] = {'precision': precision, 'recall': recall, 'accuracy': accuracy, 'f1': f1, 'specificity': specificity}
            
            details = f"{language},{round(precision * 10000) / 100},{round(recall * 10000) / 100},{round(accuracy * 10000) / 100},{round(f1 * 10000) / 100},{round(specificity * 10000) / 100},{sample_counts[language]}"
            print(details)
            result_writer.writerow([language, round(precision * 10000) / 100, round(recall * 10000) / 100, round(accuracy * 10000) / 100, round(f1 * 10000) / 100, round(specificity * 10000) / 100, sample_counts[language]])
        
        # Micro-averaged metrics
        total_samples = sum(sample_counts.values())
        total_tp = sum(tp.values())
        total_fp = sum(fp.values())
        total_tn = sum(tn.values())
        total_fn = sum(fn.values())
        
        micro_precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
        micro_recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
        micro_accuracy = (total_tp + total_tn) / (total_tp + total_fp + total_tn + total_fn) if (total_tp + total_fp + total_tn + total_fn) > 0 else 0
        micro_specificity = total_tn / (total_fp + total_tn) if (total_fp + total_tn) > 0 else 0
        micro_f1 = 2 * micro_precision * micro_recall / (micro_precision + micro_recall) if (micro_precision + micro_recall) > 0 else 0
        
        details = f"Micro,{round(micro_precision * 10000) / 100},{round(micro_recall * 10000) / 100},{round(micro_accuracy * 10000) / 100},{round(micro_f1 * 10000) / 100},{round(micro_specificity * 10000) / 100},{total_samples}"
        print(details)
        result_writer.writerow(['Micro', round(micro_precision * 10000) / 100, round(micro_recall * 10000) / 100, round(micro_accuracy * 10000) / 100, round(micro_f1 * 10000) / 100, round(micro_specificity * 10000) / 100, total_samples])
        
        # Macro-averaged metrics
        num_langs = len(stats)
        if num_langs > 0:
            macro_precision = sum(s['precision'] for s in stats.values()) / num_langs
            macro_recall = sum(s['recall'] for s in stats.values()) / num_langs
            macro_accuracy = sum(s['accuracy'] for s in stats.values()) / num_langs
            macro_specificity = sum(s['specificity'] for s in stats.values()) / num_langs
            macro_f1 = sum(s['f1'] for s in stats.values()) / num_langs
            
            details = f"Macro,{round(macro_precision * 10000) / 100},{round(macro_recall * 10000) / 100},{round(macro_accuracy * 10000) / 100},{round(macro_f1 * 10000) / 100},{round(macro_specificity * 10000) / 100},{total_samples}"
            print(details)
            result_writer.writerow(['Macro', round(macro_precision * 10000) / 100, round(macro_recall * 10000) / 100, round(macro_accuracy * 10000) / 100, round(macro_f1 * 10000) / 100, round(macro_specificity * 10000) / 100, total_samples])
    
    print(f"\nNNetLanguageIdentifier constructor: {constructor_time:.2f} ms")
    print(f"FindLanguage: {avg_time:.2f} ms")

def main():
    parser = argparse.ArgumentParser(description='Benchmark CLD3 language detection')
    parser.add_argument('--benchmark', type=str, default='wili', choices=['wili', 'flores', 'tatoeba', 'opensubtitles'], help='Dataset to benchmark')
    parser.add_argument('--output', type=str, default='', help='Output CSV file')
    parser.add_argument('--errors', type=str, default='', help='Errors CSV file')
    base_folder = "../benchmarks"
    
    args = parser.parse_args()
    
    # Measure constructor time
    start = time.time()
    detector = gcld3.NNetLanguageIdentifier(min_num_bytes=0, max_num_bytes=1000)
    constructor_time_ms = (time.time() - start) * 1000
    
    # Select dataset reader
    if args.benchmark == 'wili':
        base_path = f"{base_folder}/WiLI-2018-corrected"
        if not os.path.exists(base_path):
            print(f"Folder {base_path} does not exist.")
            return
        samples = read_wili(base_path)
        output_file = args.output or f"../results/cld3-wili.csv"
        error_file = args.errors or f"../results/cld3-wili-errors.csv"
    
    elif args.benchmark == 'flores':
        base_path = f"{base_folder}/flores_plus"
        if not os.path.exists(base_path):
            print(f"Folder {base_path} does not exist.")
            return
        samples = read_flores(base_path)
        output_file = args.output or f"../results/cld3-flores.csv"
        error_file = args.errors or f"../results/cld3-flores-errors.csv"
    
    elif args.benchmark == 'tatoeba':
        base_path = f"{base_folder}/tatoeba"
        if not os.path.exists(base_path):
            print(f"Folder {base_path} does not exist.")
            return
        samples = read_tatoeba(base_path)
        output_file = args.output or f"../results/cld3-tatoeba.csv"
        error_file = args.errors or f"../results/cld3-tatoeba-errors.csv"
    
    elif args.benchmark == 'opensubtitles':
        base_path = f"{base_folder}/opensubtitles"
        if not os.path.exists(base_path):
            print(f"Folder {base_path} does not exist.")
            return
        samples = read_opensubtitles(base_path, 10000)
        output_file = args.output or f"../results/cld3-opensubtitles.csv"
        error_file = args.errors or f"../results/cld3-opensubtitles-errors.csv"
    
    else:
        print(f"Unknown benchmark: {args.benchmark}")
        return
    
    # Process dataset
    tp, fn, fp, tn, sample_counts, errors, avg_time = process_dataset(detector, samples)
    
    # Write errors
    os.makedirs(os.path.dirname(error_file) or '.', exist_ok=True)
    with open(error_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        # writer.writerow(['id', 'expected_language', 'text'])
        for error in errors:
            writer.writerow(error)
    
    print(f"Wrote {len(errors)} errors to {error_file}")
    
    # Compute and print metrics
    os.makedirs(os.path.dirname(output_file) or '.', exist_ok=True)
    compute_and_print_metrics(tp, fn, fp, tn, sample_counts, output_file, avg_time, constructor_time_ms)

if __name__ == "__main__":
    main()