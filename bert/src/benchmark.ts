import { AutoTokenizer, pipeline, env} from '@xenova/transformers';
import fetch, { Headers, Request, Response } from 'node-fetch';

import * as fs from 'fs';
import * as readline from 'readline';
import csvsync from 'csvsync';

import { languageMap, iso639_mapping } from './mapping.js';
import commandLineArgs from 'command-line-args';
 
const optionDefinitions = [
  {name: 'benchmark', type: String, defaultValue: 'wili'},
  {name: 'output', type: String, defaultValue: ''},
  {name: 'errors', type: String, defaultValue: ''},
];

const options = commandLineArgs(optionDefinitions);

// @ts-ignore
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
  // @ts-ignore
  globalThis.Headers = Headers;
  // @ts-ignore
  globalThis.Request = Request;
  // @ts-ignore
  globalThis.Response = Response;
}

let classifier: any = null;
let tokenizer: any = null;

// unique 2-letter codes supported by mapping
let supportedLanguages : string[] = [...new Set(Object.values(languageMap))] as string[];

// Helper: classify text with truncation-safe encoding
async function getLanguage(text: string): Promise<string> {
  const result: any = await classifier(text, {
    top_k: 1,
    return_all_scores: false,
    truncation: true,
    max_length: 510,    // leave room for special tokens (<s>, </s>)
    padding: false,
  });

  if (!result || !result[0]) return '';
  const pred = result[0];
  return languageMap[pred.label] || pred.label; // map label to 2-letter when possible
}

type LanguageSample = { text: string; label: string; labels?: string[]; id?: string; };

async function getLabels(source : string) {
  let labels: Record<string, string> = {};
  const fileStream = fs.createReadStream(source, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });
  for await (const line of rl) {
    let [label, code] = line.trim().split(',');
    if (!label || !code) continue;
    labels[label.trim()] = code.trim();
  }
  return labels;
}

// Readers
async function* readWiLI(baseFolder: string): AsyncGenerator<LanguageSample> {
  const labels = await getLabels(`${baseFolder}/labels.csv`);
  for (let source of [`${baseFolder}/WiLI-2018-fixed-dataset/test.csv`, `${baseFolder}/WiLI-2018-fixed-dataset/train.csv`]) {
    const rl = readline.createInterface({ input: fs.createReadStream(source, 'utf-8') });
    for await (const line of rl) {
      let [text, label] = line.trim().split('",');
      if (!text || !label) continue;
      text = text.trim().replace(/^"/, '');
      label = label.trim();
      if (!labels[label]) continue;
      yield { text, label: labels[label] };
    }
  }
}

async function* readFlores(FOLDER: string): AsyncGenerator<LanguageSample> {
  let files = fs.readdirSync(`${FOLDER}/dev`, {withFileTypes: true}).filter((file) => file.name.endsWith('.csv')).map((file) => `${FOLDER}/dev/${file.name}`);

  for (const file of files) {
    let label = file.replace('.parquet.csv', '').split('/').pop()?.split('_')[0] || '';

    let code = iso639_mapping[label] || label;

    if (code.length > 2)
      continue;

    if (!supportedLanguages.includes(code)) {
      // console.warn(`Unsupported language detected: ${code}`);
      continue;
    }

    if (['tt'].includes(code)) { // issue
      continue;
    }

    for(let source of [file, file.replace('/dev/', '/devtest/')]) {
      // console.log(source);
      if (!fs.existsSync(source)) {
        console.warn(`File not found: ${source}`);
        continue;
      }

      const fileStream = fs.createReadStream(source, 'utf-8');
      const rl = readline.createInterface({ input: fileStream });

      for await (const line of rl) {
        if (line.startsWith('id,iso_639_3')) {
          // Skip header line
          continue;
        } 

        //line.split(','); 
        let [id,iso_639_3,iso_15924,glottocode,text] = csvsync.parse(line, {columns: true, skip_empty_lines: true})[0];
        if (typeof(text) == "undefined" || !text || text.length === 0) continue;
        // console.log(text);

         yield {
          text,
          label: code,
          // id: source.includes('devtest') ? `devtest-${id}-${label}` : `dev-${id}-${label}`
          id: ''
        };
      }
    }
  }

}

async function* readTatoeba(baseFolder: string): AsyncGenerator<LanguageSample> {
  const rl = readline.createInterface({ input: fs.createReadStream(`${baseFolder}/sentences.csv`, 'utf-8') });
  for await (const line of rl) {
    const [id, label, sentence] = line.trim().split('\t');
    const code = iso639_mapping[label] || label;
    if (!supportedLanguages.includes(code)) continue;

    yield { text: sentence, label: code, id };
  }
}

async function* readOpenSubtitles(baseFolder: string, limit: number = 10_000): AsyncGenerator<LanguageSample> {
  const files = fs.readdirSync(baseFolder).map((f) => `${baseFolder}/${f}`);
  for (const file of files) {
    const code = file.replace('.txt', '').split('/').pop() || '';
    if (!supportedLanguages.includes(code)) continue;
    let count = 0, total = 0, text = '';
    const rl = readline.createInterface({ input: fs.createReadStream(file, 'utf-8') });
    for await (const line of rl) {
      count++; 
      text += ' ' + line;

      if (count % 10 !== 0) continue; // batch lines

      yield { text: text.trim(), label: code };

      text = ''; 
      total++;

      if (total >= limit) break;
    }
  }
}

// Metrics processing
async function processDataset(samples: AsyncGenerator<LanguageSample>, errorFs: fs.WriteStream | null) {
  let tp: any = {}, fn: any = {}, fp: any = {}, tn: any = {}, sampleCounts: any = {};
  supportedLanguages.forEach((lang) => { tp[lang]=0; fn[lang]=0; fp[lang]=0; tn[lang]=0; sampleCounts[lang]=0; });

  for await (const sample of samples) {
    const code = sample.label;
    if (!supportedLanguages.includes(code)) continue;
    sampleCounts[code]++;

    let detectedLanguage = '';
    try {
      detectedLanguage = await getLanguage(sample.text);
    }
    catch(error) {
      console.error(`Error detecting language for sample ${sample.id || ''}:`, error);
      continue;
    }

    if (detectedLanguage !== code && errorFs) {
      errorFs.write(`${sample.id || ''},${code},"${sample.text.replace(/"/g, '\'')}"\n`);
      // console.log(`${sample.id || ''},${code},"${sample.text.replace(/"/g, '\'')}"`);
    }

    supportedLanguages.forEach((language) => {
      if (detectedLanguage === language && code === language) tp[language]++;
      else if (detectedLanguage === language && code !== language) fp[language]++;
      else if (detectedLanguage !== language && code === language) fn[language]++;
      else tn[language]++;
    });
  }

  return { tp, fn, fp, tn, sampleCounts };
}

function computeAndPrintMetrics(
  tp: any, fn: any, fp: any, tn: any, sampleCounts: any, resultFs: fs.WriteStream
) {
  const foundLanguages = Object.keys(sampleCounts).filter((l) => sampleCounts[l] > 0).sort();
  let stats: any = {};
  resultFs.write(`language,precision,recall,accuracy,f1-score,specificity,samples\n`);
  console.log(`language,precision,recall,accuracy,f1-score,specificity,samples`);

  for (const language of foundLanguages) {
    if (tp[language] + fn[language] === 0) { console.log(`Skip ${language} with 0 samples`); continue; }
    const precision = tp[language] / (tp[language] + fp[language]) || 0;
    const recall = tp[language] / (tp[language] + fn[language]) || 0;
    const accuracy = (tp[language] + tn[language]) / (tp[language] + fp[language] + tn[language] + fn[language]) || 0;
    const specificity = tn[language] / (fp[language] + tn[language]) || 0;
    const f1 = 2 * precision * recall / (precision + recall) || 0;
    stats[language] = { precision, recall, accuracy, f1, specificity };
    const details = `${language},${Math.round(precision * 10000) / 100},${Math.round(recall * 10000) / 100},${Math.round(accuracy * 10000) / 100},${Math.round(f1 * 10000) / 100},${Math.round(specificity * 10000) / 100},${sampleCounts[language]}`;
    console.log(details);
    resultFs.write(`${details}\n`);
  }

  // Micro
  let totalSamples = Object.values(sampleCounts).map(Number).reduce((a, b) => a + b, 0);
  let totalTp = 0, totalFp = 0, totalTn = 0, totalFn = 0;
  supportedLanguages.forEach((l) => { totalTp += tp[l]; totalFp += fp[l]; totalTn += tn[l]; totalFn += fn[l]; });
  const precision = totalTp / (totalTp + totalFp);
  const recall = totalTp / (totalTp + totalFn);
  const accuracy = (totalTp + totalTn) / (totalTp + totalFp + totalTn + totalFn);
  const specificity = totalTn / (totalFp + totalTn);
  const f1 = 2 * precision * recall / (precision + recall);
  let details = `Micro,${Math.round(precision * 10000) / 100},${Math.round(recall * 10000) / 100},${Math.round(accuracy * 10000) / 100},${Math.round(f1 * 10000) / 100},${Math.round(specificity * 10000) / 100},${totalSamples}`;
  console.log(details);
  resultFs.write(`${details}\n`);

  // Macro
  const langs = Object.keys(stats);
  const n = langs.length || 1;
  const precisionMacro = langs.reduce((s, l) => s + stats[l].precision, 0) / n;
  const recallMacro = langs.reduce((s, l) => s + stats[l].recall, 0) / n;
  const accuracyMacro = langs.reduce((s, l) => s + stats[l].accuracy, 0) / n;
  const specificityMacro = langs.reduce((s, l) => s + stats[l].specificity, 0) / n;
  const f1Macro = langs.reduce((s, l) => s + stats[l].f1, 0) / n;
  details = `Macro,${Math.round(precisionMacro * 10000) / 100},${Math.round(recallMacro * 10000) / 100},${Math.round(accuracyMacro * 10000) / 100},${Math.round(f1Macro * 10000) / 100},${Math.round(specificityMacro * 10000) / 100},${totalSamples}`;
  console.log(details);
  resultFs.write(`${details}\n`);
}


(async () => {
  console.log(`\n\nBenchmarking model: Bert on ${options.benchmark} dataset\n`);

  env.localModelPath = "models";
  env.allowRemoteModels = false;
  env.cacheDir = ".cache";
  
  classifier = await pipeline('text-classification', 'xlm-v-base-language-id', { quantized: false });
  tokenizer = await AutoTokenizer.from_pretrained('xlm-v-base-language-id');

  // Select dataset
  let samples: AsyncGenerator<LanguageSample>;
  if (options.benchmark === 'wili') {
    samples = readWiLI('../benchmarks/WiLI-2018-corrected');
  } else if (options.benchmark === 'flores') {
    samples = readFlores('../benchmarks/flores_plus');
  } else if (options.benchmark === 'tatoeba') {
    samples = readTatoeba('../benchmarks/tatoeba');
  } else if (options.benchmark === 'opensubtitles') {
    samples = readOpenSubtitles('../benchmarks/opensubtitles', 10_000);
  } else {
    console.error(`Unknown benchmark: ${options.benchmark}`);
    process.exit(1);
  }
  
  const errorFs = options.errors ? fs.createWriteStream(options.errors, {flags: 'w', encoding: 'utf-8'}) : null;
  const metrics = await processDataset(samples, errorFs);

  const resultFs = fs.createWriteStream(options.output, { flags: 'w' });
  computeAndPrintMetrics(metrics.tp, metrics.fn, metrics.fp, metrics.tn, metrics.sampleCounts, resultFs);

   if (errorFs) {
    errorFs.close();
  }
  resultFs.close(() => process.exit(0));
})()
.catch((err) => {
  console.error('Unhandled error:', err);
});