import * as fs from 'fs';
import * as readline from 'readline';

// Generate random lists of languages to genrerate confidence internals
const B = 2_000;


(async () => {

  // Bert
  let languages = await loadResults('results/ldw-wili-bert-20k.csv');
  let outputFs = fs.createWriteStream(`results/languages-bert-wili.txt`, {flags: 'w'});

  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();


  languages = await loadResults('results/ldw-flores-bert-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-bert-flores.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-tatoeba-bert-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-bert-tatoeba.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();


  languages = await loadResults('results/ldw-opensubtitles-bert-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-bert-opensubtitles.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  // CLD3
  languages = await loadResults('results/ldw-wili-cld3-10k.csv');
  outputFs = fs.createWriteStream(`results/languages-cld3-wili.txt`, {flags: 'w'});

  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-flores-cld3-10k.csv');
  outputFs = fs.createWriteStream(`results/languages-cld3-flores.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-tatoeba-cld3-10k.csv');
  outputFs = fs.createWriteStream(`results/languages-cld3-tatoeba.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-opensubtitles-cld3-10k.csv');
  outputFs = fs.createWriteStream(`results/languages-cld3-opensubtitles.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  // fastText
  languages = await loadResults('results/ldw-wili-fasttext-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-fasttext-wili.txt`, {flags: 'w'});

  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-flores-fasttext-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-fasttext-flores.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-tatoeba-fasttext-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-fasttext-tatoeba.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

  languages = await loadResults('results/ldw-opensubtitles-fasttext-20k.csv');
  outputFs = fs.createWriteStream(`results/languages-fasttext-opensubtitles.txt`, {flags: 'w'});
  for(let i = 0; i < B; i++) {
    for(let j = 0; j < languages.length; j++) {
      let randomIndex = Math.floor(Math.random() * languages.length);
      outputFs.write(`${languages[randomIndex]},`);
    }
    outputFs.write(`\n`);
  }

  outputFs.close();

})();




function loadResults(filename: string) : Promise<string[]> {
  let results : string[] = [];
  const fileStream = fs.createReadStream(filename, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });

  return new Promise((resolve) => {
    rl.on('line', (line: string) => {
      const [language, precision, recall, accuracy, f1, specificity, samples] = line.split(',');
      if (['language', 'micro', 'macro'].includes(language.toLocaleLowerCase()))
        return;

      results.push(language);
    });

    rl.on('close', () => {
      resolve(results);
    });
  });
}