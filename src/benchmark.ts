import LanguageDetector from 'language-detector-web';
const FastText = require('fasttext.js');

import * as fs from 'fs';
import * as readline from 'readline';
var csvsync = require('csvsync');

import iso639_mapping from './mapping';

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  {name: 'benchmark', type: String, defaultValue: 'wili'},
  {name: 'model', type: String, defaultValue: 'ldw'},
  {name: 'output', type: String, defaultValue: ''},
  {name: 'errors', type: String, defaultValue: ''},
  {name: 'multiple', type: Boolean, defaultValue: false},
  {name: 'threshold', type: Number, defaultValue: 0.9},
];

const options = commandLineArgs(optionDefinitions);

let detector : any = null;
let fastText : any = null;
let glotlid : any = null;

function supportedLanguagesFromModel(model: string) : string[] {
  if (model === 'ldw') {
    if (detector == null)
      detector = new LanguageDetector()
    return detector.getSupportedLanguages();
  }
  else if (model === 'fasttext') {
    return "af als am an ar arz as ast av az azb ba bar bcl be bg bh bn bo bpy br bs bxr ca cbk ce ceb ckb co cs cv cy da de diq dsb dty dv el eml en eo es et eu fa fi fr frr fy ga gd gl gn gom gu gv he hi hif hr hsb ht hu hy ia id ie ilo io is it ja jbo jv ka kk km kn ko krc ku kv kw ky la lb lez li lmo lo lrc lt lv mai mg mhr min mk ml mn mr mrj ms mt mwl my myv mzn nah nap nds ne new nl nn no oc or os pa pam pfl pl pms pnb ps pt qu rm ro ru rue sa sah sc scn sco sd sh si sk sl so sq sr su sv sw ta te tg th tk tl tr tt tyv ug uk ur uz vec vep vi vls vo wa war wuu xal xmf yi yo yue zh".split(" ");
  }
  else if (model === "glotlid") {
    if (detector == null)
      detector = new LanguageDetector()
    return detector.getSupportedLanguages();
  }

  return [''];
}

async function getLanguage(model: string, text : string) : Promise<string> {
  if (model === 'ldw') {
    if (detector == null)
      detector = new LanguageDetector()

    let languages = detector.getLanguages(text);
    return languages.length > 0 ? languages[0] : '';
  }
  else if (model === 'fasttext') {
    if (fastText == null) {
      fastText = new FastText({
        loadModel: "models/lid.176.bin",
      });
      await fastText.load();
    }

    const detectedLanguages = await fastText.predict(text);
    return detectedLanguages.length > 0 
      ? detectedLanguages.reduce((max : any, prediction: any) => 
          parseFloat(prediction.score) > parseFloat(max.score) ? prediction : max
        ).label.toLowerCase()
      : '';
  }
  else if (model === 'glotlid') {
    if (glotlid == null) {
      glotlid = new FastText({
        loadModel: "models/glotlid.bin",
      });
      await glotlid.load();
    }

    const detectedLanguages = await glotlid.predict(text);
    let label = detectedLanguages.length > 0 
      ? detectedLanguages.reduce((max : any, prediction: any) => 
          parseFloat(prediction.score) > parseFloat(max.score) ? prediction : max
        ).label.toLowerCase().split("_")[0]
      : '';

    return iso639_mapping[label] || '';
  }

  return '';
}

function getLanguages(model: string, text : string) : string[] {
  if (model === 'ldw') {
    if (detector == null)
      detector = new LanguageDetector()

    let languages = detector.getLanguages(text, options.threshold) as string[];
    return languages.length > 0 ? languages : [];
  }
  

  return [];
}

async function getLabels(source : string) { // WiLI
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

interface LanguageSample {
  text: string;
  label: string;
  labels?: string[];
  id?: string;
}

async function* readWiLI(): AsyncGenerator<LanguageSample> {
  let FOLDER = 'benchmarks/WiLI-2018-corrected';
  let labels = await getLabels(`${FOLDER}/labels.csv`);

  for (let source of [`${FOLDER}/WiLI-2018-fixed-dataset/test.csv`, `${FOLDER}/WiLI-2018-fixed-dataset/train.csv`]) {
    const fileStream = fs.createReadStream(source, 'utf-8');
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      let [text, label] = line.trim().split('",');
      if (!text || !label) continue;

      text = text.trim().replace(/^"/, '');
      label = label.trim();

      if (!labels[label]) continue;

      yield {
        text,
        label: labels[label]
      };
    }
  }
}

async function* readFlores(): AsyncGenerator<LanguageSample> {
  let FOLDER = 'benchmarks/flores_plus';

  let supportedLanguages = supportedLanguagesFromModel(options.model);
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

         yield {
          text,
          label: code,
          // id: file.includes('devtest') ? `devtest-${id}-${label}` : `dev-${id}-${label}`
          id: ''
        };
      }
    }
  }
}

async function* readTatoeba(): AsyncGenerator<LanguageSample> {
  let FOLDER = 'benchmarks/tatoeba';
  
  const fileStream = fs.createReadStream(`${FOLDER}/sentences.csv`, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });

  // const outputFs = fs.createWriteStream(`${FOLDER}/errors-sentences.csv`, {flags: 'w'});

  for await (const line of rl) {
    let [id, label, sentence] = line.trim().split("\t");

    let code = iso639_mapping[label] || label;
    if (['new', 'xmf', 'wuu', 'tt'].includes(code)) {
      // issues
      continue;
    }

    yield {
      text: sentence,
      label: code,
      id
    };
  }
}

async function* readOpenSubtitles(limit : number = 10_000): AsyncGenerator<LanguageSample> {
  let FOLDER = 'benchmarks/opensubtitles';

  let supportedLanguages = supportedLanguagesFromModel(options.model);
  let files = fs.readdirSync(`${FOLDER}`).map((file) => `${FOLDER}/${file}`);

  for (const file of files) {
    let code = file.replace('.txt', '').split('/').pop() || '';
    if (!supportedLanguages.includes(code)) {
      console.warn(`Unsupported language detected: ${code}`);
      continue;
    }

    console.log("Processing file:", file);

    let count = 0;
    let total = 0;
    let text = '';

    const fileStream = fs.createReadStream(file, 'utf-8');
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      count++;
      text += ' ' + line;
  

      if (count % 10 !== 0) {
        continue;
      }

      yield {
        text: text.trim(),
        label: code
      };

      text = '';
      total++;

      if (total >= limit) {
        console.log(`Stopped reading ${total} sentences from ${file}`);
        break; // limit to 10,000 sentences per file
      }
    }
    console.log(`Finished reading ${total} sentences from ${file}`);
  }
}

async function* readMultilingual(): AsyncGenerator<LanguageSample> {
  let FOLDER = 'benchmarks/Web-multilingual';

  const fileStream = fs.createReadStream(`${FOLDER}/pages.csv`, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
      const [index,uuid, lang1,lang2] = line.split(',');

      if (!fs.existsSync(`${FOLDER}/pages/${uuid}.txt`)) {
        console.warn(`File not found: ${FOLDER}/pages/${uuid}.txt`);
        continue;
      }
      let text = fs.readFileSync(`${FOLDER}/pages/${uuid}.txt`, 'utf-8');
      
      yield {
        id: uuid,
        text: text,
        label: '',
        labels: [lang1,lang2]
      };
  }
}

async function processDataset(
  samples: AsyncGenerator<LanguageSample>,
  supportedLanguages: string[],
  errorFs: fs.WriteStream | null
) {
  let tp : any = {};
  let fn : any = {};
  let fp : any = {};
  let tn : any = {};
  let sampleCounts : any = {};

  supportedLanguages.map((lang) => {
    tp[lang] = 0;
    fn[lang] = 0;
    fp[lang] = 0;
    tn[lang] = 0;
    sampleCounts[lang] = 0;
  });

  for await (const sample of samples) {
    let code = sample.label;

    if (sample.labels && options.multiple) {
      const [lang1,lang2] = sample.labels;
      
      const detectedLanguages = getLanguages(options.model, sample.text);
      // console.log("Detected languages:", detectedLanguages);

      let all = [lang1, lang2].concat(detectedLanguages);
      all = Array.from(new Set(all));

      for(let language of supportedLanguages) {
        // metrics
        if (detectedLanguages.includes(language) && [lang1,lang2].includes(language)) {
          tp[language] = tp[language] + 1;
        }
        else if (detectedLanguages.includes(language) && ![lang1,lang2].includes(language)) {
          fp[language] = fp[language] + 1;
        }
        else if (!detectedLanguages.includes(language) && [lang1,lang2].includes(language)) {
          fn[language] = fn[language] + 1;
        }
        else {
          tn[language] = tn[language] + 1;  
        }
      }

      sampleCounts[lang1]++;
      sampleCounts[lang2]++;
      continue;
    }

    // const detectedLanguage = await getLanguage(options.model, sample.text);
     const detectedLanguages = await getLanguages(options.model, sample.text);
     const detectedLanguage = detectedLanguages[0];

    if (sample.labels && !options.multiple) {
      const [lang1,lang2] = sample.labels;

      if (detectedLanguage === lang1) {
        code = lang1;
      } else if (detectedLanguage === lang2) {
        code = lang2;
      }
    }
    
    if (!supportedLanguages.includes(code)) continue;

    sampleCounts[code]++;

    if (detectedLanguage !== code && errorFs) {
      errorFs.write(`${sample.id || ''},${code},"${sample.text.replace(/"/g, '\'')}"\n`);
    }

    if (options.multiple) {
      let all = [code].concat(detectedLanguages);
      all = Array.from(new Set(all));

      for(let language of supportedLanguages) {
        // metrics
        if (detectedLanguages.includes(language) && code == language) {
          tp[language] = tp[language] + 1;
        }
        else if (detectedLanguages.includes(language) && code != language) {
          fp[language] = fp[language] + 1;
        }
        else if (!detectedLanguages.includes(language) && code == language) {
          fn[language] = fn[language] + 1;
        }
        else {
          tn[language] = tn[language] + 1;  
        }
      }
    }

    for (let language of supportedLanguages) {
      if (detectedLanguage == language && code == language) {
        tp[language]++;
      }
      else if (detectedLanguage == language && code != language) {
        fp[language]++;
      }
      else if (detectedLanguage != language && code == language) {
        fn[language]++;
      }
      else {
        tn[language]++;
      }
    }
  }

  return { tp, fn, fp, tn, sampleCounts };
}

async function computeAndPrintMetrics(
  tp: any, fn: any, fp: any, tn: any, sampleCounts: any,
  supportedLanguages: string[],
  resultFs: fs.WriteStream
) {
  let foundLanguages = Object.keys(sampleCounts).filter(lang => sampleCounts[lang] > 0);
  let stats : any = {};

  resultFs.write(`language,precision,recall,accuracy,f1-score,specificity,samples\n`);
  console.log(`language,precision,recall,accuracy,f1-score,specificity,samples`);

  for (let language of foundLanguages.sort()) {
    if (tp[language] + fn[language] === 0) {
      console.log(`Skip ${language} with 0 samples`);
      continue;
    }

    let precision = tp[language] / (tp[language] + fp[language]) || 0;
    let recall = tp[language] / (tp[language] + fn[language]);
    let accuracy = (tp[language] + tn[language]) / (tp[language] + fp[language] + tn[language] + fn[language]);
    let specificity = tn[language] / (fp[language] + tn[language])
    let f1 = 2 * precision * recall / (precision + recall) || 0;

    stats[language] = { precision, recall, accuracy, f1, specificity };

    let details = `${language},${Math.round(precision * 100 * 100) / 100},${Math.round(recall * 100 * 100) / 100},${Math.round(accuracy * 100 * 100) / 100},${Math.round(f1 * 100 * 100) / 100},${Math.round(specificity * 100 * 100) / 100},${sampleCounts[language]}`;
    console.log(details);
    resultFs.write(`${details}\n`);
  }
  console.log("");

  // Micro-averaged metrics
  console.log('Micro-averaged metrics:');
  let totalSamples = Object.values(sampleCounts).filter((a: any) => isNaN(a) === false).map(Number).reduce((a, b) => a + b, 0);
  let totalTp = 0, totalFp = 0, totalTn = 0, totalFn = 0;

  supportedLanguages.map((language) => {
    totalTp += tp[language];
    totalFp += fp[language];
    totalTn += tn[language];
    totalFn += fn[language];
  });

  let precision = totalTp / (totalTp + totalFp);
  let recall = totalTp / (totalTp + totalFn);
  let accuracy = (totalTp + totalTn) / (totalTp + totalFp + totalTn + totalFn);
  let specificity = totalTn / (totalFp + totalTn);
  let f1 = 2 * precision * recall / (precision + recall);

  let details = `Micro,${Math.round(precision * 100 * 100) / 100},${Math.round(recall * 100 * 100) / 100},${Math.round(accuracy * 100 * 100) / 100},${Math.round(f1 * 100 * 100) / 100},${Math.round(specificity * 100 * 100) / 100},${totalSamples}`;
  resultFs.write(`${details}\n`);
  console.log(details);
  console.log();

  // Macro-averaged metrics
  console.log('Macro-averaged metrics:');
  let numLanguages = Object.keys(stats).length;

  let precisionMacro = Object.keys(stats).reduce((sum, lang) => sum + stats[lang].precision, 0) / numLanguages;
  let recallMacro = Object.keys(stats).reduce((sum, lang) => sum + stats[lang].recall, 0) / numLanguages;
  let accuracyMacro = Object.keys(stats).reduce((sum, lang) => sum + stats[lang].accuracy, 0) / numLanguages;
  let specificityMacro = Object.keys(stats).reduce((sum, lang) => sum + stats[lang].specificity, 0) / numLanguages;
  let f1Macro = Object.keys(stats).reduce((sum, lang) => sum + stats[lang].f1, 0) / numLanguages;

  details = `Macro,${Math.round(precisionMacro * 100 * 100) / 100},${Math.round(recallMacro * 100 * 100) / 100},${Math.round(accuracyMacro * 100 * 100) / 100},${Math.round(f1Macro * 100 * 100) / 100},${Math.round(specificityMacro * 100 * 100) / 100},${totalSamples}`;
  console.log(details);
  resultFs.write(`${details}\n`);
}

(async () => {
  console.log(`Benchmarking model: ${options.model} on ${options.benchmark} dataset\n`);
  
  let supportedLanguages = supportedLanguagesFromModel(options.model);
  let samples: AsyncGenerator<LanguageSample>;

  if (options.benchmark === 'wili') {
    samples = readWiLI();
  } else if (options.benchmark === 'flores') {
    samples = readFlores();
  } else if (options.benchmark === 'tatoeba') {
    samples = readTatoeba();
  } else if (options.benchmark === 'opensubtitles') {
    samples = readOpenSubtitles(10_000);
  }
  else if (options.benchmark === 'multilingual') {
    samples = readMultilingual();
  } else {
    console.error(`Unknown benchmark: ${options.benchmark}`);
    process.exit(1);
  }

  const resultFs = fs.createWriteStream(options.output, {flags: 'w'});
  const errorFs = options.errors ? fs.createWriteStream(options.errors, {flags: 'w'}) : null;

  const metrics = await processDataset(samples, supportedLanguages, errorFs);
  await computeAndPrintMetrics(
    metrics.tp, metrics.fn, metrics.fp, metrics.tn, metrics.sampleCounts,
    supportedLanguages,
    resultFs
  );

  if (errorFs) {
    errorFs.close();
  }
  resultFs.close(() => process.exit(0));
})();