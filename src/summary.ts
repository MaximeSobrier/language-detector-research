import * as fs from 'fs';
import * as readline from 'readline';
import { text } from 'stream/consumers';
var csvsync = require('csvsync');

// Table 2
(async () => {
  {
    console.log("Table 2");
    const outputFs = fs.createWriteStream('summaries/table-2.csv', { flags: 'w' });

    let ldwWili1k = await loadResults('results/ldw-wili-1k.csv');
    let ldwWili2k = await loadResults('results/ldw-wili-2k.csv');
    let ldwWili5k = await loadResults('results/ldw-wili-5k.csv');
    let ldwWili10k = await loadResults('results/ldw-wili-10k.csv');
    let ldwWili20k = await loadResults('results/ldw-wili-20k.csv');

    let ldwFlores1k = await loadResults('results/ldw-flores-1k.csv');
    let ldwFlores2k = await loadResults('results/ldw-flores-2k.csv');
    let ldwFlores5k = await loadResults('results/ldw-flores-5k.csv');
    let ldwFlores10k = await loadResults('results/ldw-flores-10k.csv');
    let ldwFlores20k = await loadResults('results/ldw-flores-20k.csv');

    let ldwTatoeba1k = await loadResults('results/ldw-tatoeba-1k.csv');
    let ldwTatoeba2k = await loadResults('results/ldw-tatoeba-2k.csv');
    let ldwTatoeba5k = await loadResults('results/ldw-tatoeba-5k.csv');
    let ldwTatoeba10k = await loadResults('results/ldw-tatoeba-10k.csv');
    let ldwTatoeba20k = await loadResults('results/ldw-tatoeba-20k.csv');

    let ldwOpensubtitles1k = await loadResults('results/ldw-opensubtitles-1k.csv');
    let ldwOpensubtitles2k = await loadResults('results/ldw-opensubtitles-2k.csv');
    let ldwOpensubtitles5k = await loadResults('results/ldw-opensubtitles-5k.csv');
    let ldwOpensubtitles10k = await loadResults('results/ldw-opensubtitles-10k.csv');
    let ldwOpensubtitles20k = await loadResults('results/ldw-opensubtitles-20k.csv');

    outputFs.write(`Table 2: Performances on the different ldw datasets\n\n`);
    outputFs.write(`Precision\n`);
    outputFs.write(`Dataset,type,ldw1k,ldw2k,ldw5k,ldw10k,ldw20k\n`);
    outputFs.write(`WiLI,Macro,${ldwWili1k['Macro'].precision},${ldwWili2k['Macro'].precision},${ldwWili5k['Macro'].precision},${ldwWili10k['Macro'].precision},${ldwWili20k['Macro'].precision}\n`);
    outputFs.write(`WiLI,Micro,${ldwWili1k['Micro'].precision},${ldwWili2k['Micro'].precision},${ldwWili5k['Micro'].precision},${ldwWili10k['Micro'].precision},${ldwWili20k['Micro'].precision}\n`);

    outputFs.write(`FLORES+,Macro,${ldwFlores1k['Macro'].precision},${ldwFlores2k['Macro'].precision},${ldwFlores5k['Macro'].precision},${ldwFlores10k['Macro'].precision},${ldwFlores20k['Macro'].precision}\n`);
    outputFs.write(`FLORES+,Micro,${ldwFlores1k['Micro'].precision},${ldwFlores2k['Micro'].precision},${ldwFlores5k['Micro'].precision},${ldwFlores10k['Micro'].precision},${ldwFlores20k['Micro'].precision}\n`);
  
    outputFs.write(`Tatoeba,Macro,${ldwTatoeba1k['Macro'].precision},${ldwTatoeba2k['Macro'].precision},${ldwTatoeba5k['Macro'].precision},${ldwTatoeba10k['Macro'].precision},${ldwTatoeba20k['Macro'].precision}\n`);
    outputFs.write(`Tatoeba,Micro,${ldwTatoeba1k['Micro'].precision},${ldwTatoeba2k['Micro'].precision},${ldwTatoeba5k['Micro'].precision},${ldwTatoeba10k['Micro'].precision},${ldwTatoeba20k['Micro'].precision}\n`);

    outputFs.write(`OpenSubtitles,Macro,${ldwOpensubtitles1k['Macro'].precision},${ldwOpensubtitles2k['Macro'].precision},${ldwOpensubtitles5k['Macro'].precision},${ldwOpensubtitles10k['Macro'].precision},${ldwOpensubtitles20k['Macro'].precision}\n`);
    outputFs.write(`OpenSubtitles,Micro,${ldwOpensubtitles1k['Micro'].precision},${ldwOpensubtitles2k['Micro'].precision},${ldwOpensubtitles5k['Micro'].precision},${ldwOpensubtitles10k['Micro'].precision},${ldwOpensubtitles20k['Micro'].precision}\n`);


    outputFs.write(`\nRecall\n`);
    outputFs.write(`Dataset,type,ldw1k,ldw2k,ldw5k,ldw10k,ldw20k\n`);
    outputFs.write(`WiLI,Macro,${ldwWili1k['Macro'].recall},${ldwWili2k['Macro'].recall},${ldwWili5k['Macro'].recall},${ldwWili10k['Macro'].recall},${ldwWili20k['Macro'].recall}\n`);
    outputFs.write(`WiLI,Micro,${ldwWili1k['Micro'].recall},${ldwWili2k['Micro'].recall},${ldwWili5k['Micro'].recall},${ldwWili10k['Micro'].recall},${ldwWili20k['Micro'].recall}\n`);

    outputFs.write(`FLORES+,Macro,${ldwFlores1k['Macro'].recall},${ldwFlores2k['Macro'].recall},${ldwFlores5k['Macro'].recall},${ldwFlores10k['Macro'].recall},${ldwFlores20k['Macro'].recall}\n`);
    outputFs.write(`FLORES+,Micro,${ldwFlores1k['Micro'].recall},${ldwFlores2k['Micro'].recall},${ldwFlores5k['Micro'].recall},${ldwFlores10k['Micro'].recall},${ldwFlores20k['Micro'].recall}\n`);

    outputFs.write(`Tatoeba,Macro,${ldwTatoeba1k['Macro'].recall},${ldwTatoeba2k['Macro'].recall},${ldwTatoeba5k['Macro'].recall},${ldwTatoeba10k['Macro'].recall},${ldwTatoeba20k['Macro'].recall}\n`);
    outputFs.write(`Tatoeba,Micro,${ldwTatoeba1k['Micro'].recall},${ldwTatoeba2k['Micro'].recall},${ldwTatoeba5k['Micro'].recall},${ldwTatoeba10k['Micro'].recall},${ldwTatoeba20k['Micro'].recall}\n`);

    outputFs.write(`OpenSubtitles,Macro,${ldwOpensubtitles1k['Macro'].recall},${ldwOpensubtitles2k['Macro'].recall},${ldwOpensubtitles5k['Macro'].recall},${ldwOpensubtitles10k['Macro'].recall},${ldwOpensubtitles20k['Macro'].recall}\n`);
    outputFs.write(`OpenSubtitles,Micro,${ldwOpensubtitles1k['Micro'].recall},${ldwOpensubtitles2k['Micro'].recall},${ldwOpensubtitles5k['Micro'].recall},${ldwOpensubtitles10k['Micro'].recall},${ldwOpensubtitles20k['Micro'].recall}\n`);


    outputFs.write(`\nAccuracy\n`);
    outputFs.write(`Dataset,type,ldw1k,ldw2k,ldw5k,ldw10k,ldw20k\n`);
    outputFs.write(`WiLI,Macro,${ldwWili1k['Macro'].accuracy},${ldwWili2k['Macro'].accuracy},${ldwWili5k['Macro'].accuracy},${ldwWili10k['Macro'].accuracy},${ldwWili20k['Macro'].accuracy}\n`);
    outputFs.write(`WiLI,Micro,${ldwWili1k['Micro'].accuracy},${ldwWili2k['Micro'].accuracy},${ldwWili5k['Micro'].accuracy},${ldwWili10k['Micro'].accuracy},${ldwWili20k['Micro'].accuracy}\n`);

    outputFs.write(`FLORES+,Macro,${ldwFlores1k['Macro'].accuracy},${ldwFlores2k['Macro'].accuracy},${ldwFlores5k['Macro'].accuracy},${ldwFlores10k['Macro'].accuracy},${ldwFlores20k['Macro'].accuracy}\n`);
    outputFs.write(`FLORES+,Micro,${ldwFlores1k['Micro'].accuracy},${ldwFlores2k['Micro'].accuracy},${ldwFlores5k['Micro'].accuracy},${ldwFlores10k['Micro'].accuracy},${ldwFlores20k['Micro'].accuracy}\n`);
    
    outputFs.write(`Tatoeba,Macro,${ldwTatoeba1k['Macro'].accuracy},${ldwTatoeba2k['Macro'].accuracy},${ldwTatoeba5k['Macro'].accuracy},${ldwTatoeba10k['Macro'].accuracy},${ldwTatoeba20k['Macro'].accuracy}\n`);
    outputFs.write(`Tatoeba,Micro,${ldwTatoeba1k['Micro'].accuracy},${ldwTatoeba2k['Micro'].accuracy},${ldwTatoeba5k['Micro'].accuracy},${ldwTatoeba10k['Micro'].accuracy},${ldwTatoeba20k['Micro'].accuracy}\n`);

    outputFs.write(`OpenSubtitles,Macro,${ldwOpensubtitles1k['Macro'].accuracy},${ldwOpensubtitles2k['Macro'].accuracy},${ldwOpensubtitles5k['Macro'].accuracy},${ldwOpensubtitles10k['Macro'].accuracy},${ldwOpensubtitles20k['Macro'].accuracy}\n`);
    outputFs.write(`OpenSubtitles,Micro,${ldwOpensubtitles1k['Micro'].accuracy},${ldwOpensubtitles2k['Micro'].accuracy},${ldwOpensubtitles5k['Micro'].accuracy},${ldwOpensubtitles10k['Micro'].accuracy},${ldwOpensubtitles20k['Micro'].accuracy}\n`);
    
    outputFs.write(`\nF1-Score\n`);
    outputFs.write(`Dataset,type,ldw1k,ldw2k,ldw5k,ldw10k,ldw20k\n`);
    outputFs.write(`WiLI,Macro,${ldwWili1k['Macro'].f1},${ldwWili2k['Macro'].f1},${ldwWili5k['Macro'].f1},${ldwWili10k['Macro'].f1},${ldwWili20k['Macro'].f1}\n`);
    outputFs.write(`WiLI,Micro,${ldwWili1k['Micro'].f1},${ldwWili2k['Micro'].f1},${ldwWili5k['Micro'].f1},${ldwWili10k['Micro'].f1},${ldwWili20k['Micro'].f1}\n`);

    outputFs.write(`FLORES+,Macro,${ldwFlores1k['Macro'].f1},${ldwFlores2k['Macro'].f1},${ldwFlores5k['Macro'].f1},${ldwFlores10k['Macro'].f1},${ldwFlores20k['Macro'].f1}\n`);
    outputFs.write(`FLORES+,Micro,${ldwFlores1k['Micro'].f1},${ldwFlores2k['Micro'].f1},${ldwFlores5k['Micro'].f1},${ldwFlores10k['Micro'].f1},${ldwFlores20k['Micro'].f1}\n`);

    outputFs.write(`Tatoeba,Macro,${ldwTatoeba1k['Macro'].f1},${ldwTatoeba2k['Macro'].f1},${ldwTatoeba5k['Macro'].f1},${ldwTatoeba10k['Macro'].f1},${ldwTatoeba20k['Macro'].f1}\n`);
    outputFs.write(`Tatoeba,Micro,${ldwTatoeba1k['Micro'].f1},${ldwTatoeba2k['Micro'].f1},${ldwTatoeba5k['Micro'].f1},${ldwTatoeba10k['Micro'].f1},${ldwTatoeba20k['Micro'].f1}\n`);

    outputFs.write(`OpenSubtitles,Macro,${ldwOpensubtitles1k['Macro'].f1},${ldwOpensubtitles2k['Macro'].f1},${ldwOpensubtitles5k['Macro'].f1},${ldwOpensubtitles10k['Macro'].f1},${ldwOpensubtitles20k['Macro'].f1}\n`);
    outputFs.write(`OpenSubtitles,Micro,${ldwOpensubtitles1k['Micro'].f1},${ldwOpensubtitles2k['Micro'].f1},${ldwOpensubtitles5k['Micro'].f1},${ldwOpensubtitles10k['Micro'].f1},${ldwOpensubtitles20k['Micro'].f1}\n`);

    outputFs.write(`\nSpecificity\n`);
    outputFs.write(`Dataset,type,ldw1k,ldw2k,ldw5k,ldw10k,ldw20k\n`);
    outputFs.write(`WiLI,Macro,${ldwWili1k['Macro'].specificity},${ldwWili2k['Macro'].specificity},${ldwWili5k['Macro'].specificity},${ldwWili10k['Macro'].specificity},${ldwWili20k['Macro'].specificity}\n`);
    outputFs.write(`WiLI,Micro,${ldwWili1k['Micro'].specificity},${ldwWili2k['Micro'].specificity},${ldwWili5k['Micro'].specificity},${ldwWili10k['Micro'].specificity},${ldwWili20k['Micro'].specificity}\n`);

    outputFs.write(`FLORES,Macro,${ldwFlores1k['Macro'].specificity},${ldwFlores2k['Macro'].specificity},${ldwFlores5k['Macro'].specificity},${ldwFlores10k['Macro'].specificity},${ldwFlores20k['Macro'].specificity}\n`);
    outputFs.write(`FLORES,Micro,${ldwFlores1k['Micro'].specificity},${ldwFlores2k['Micro'].specificity},${ldwFlores5k['Micro'].specificity},${ldwFlores10k['Micro'].specificity},${ldwFlores20k['Micro'].specificity}\n`);
    
    outputFs.write(`Tatoeba,Macro,${ldwTatoeba1k['Macro'].specificity},${ldwTatoeba2k['Macro'].specificity},${ldwTatoeba5k['Macro'].specificity},${ldwTatoeba10k['Macro'].specificity},${ldwTatoeba20k['Macro'].specificity}\n`);
    outputFs.write(`Tatoeba,Micro,${ldwTatoeba1k['Micro'].specificity},${ldwTatoeba2k['Micro'].specificity},${ldwTatoeba5k['Micro'].specificity},${ldwTatoeba10k['Micro'].specificity},${ldwTatoeba20k['Micro'].specificity}\n`);

    outputFs.write(`OpenSubtitles,Macro,${ldwOpensubtitles1k['Macro'].specificity},${ldwOpensubtitles2k['Macro'].specificity},${ldwOpensubtitles5k['Macro'].specificity},${ldwOpensubtitles10k['Macro'].specificity},${ldwOpensubtitles20k['Macro'].specificity}\n`);
    outputFs.write(`OpenSubtitles,Micro,${ldwOpensubtitles1k['Micro'].specificity},${ldwOpensubtitles2k['Micro'].specificity},${ldwOpensubtitles5k['Micro'].specificity},${ldwOpensubtitles10k['Micro'].specificity},${ldwOpensubtitles20k['Micro'].specificity}\n`); 


    outputFs.close();
  }

  {
    // Compare all libraries
    let bertWili = await loadResults('results/bert-wili.csv');
    let ldwBertWili = await loadResults('results/ldw-wili-bert-20k.csv');

    let cld3Wili = await loadResults('results/cld3-wili.csv');
    let ldwCld3Wili = await loadResults('results/ldw-wili-cld3-10k.csv');

    let fasttextWili = await loadResults('results/fasttext-wili.csv');
    let glotlidWili = await loadResults('results/glotlid-wili.csv');
    let ldwFasttextWili = await loadResults('results/ldw-wili-fasttext-20k.csv');

    
    let bertFlores = await loadResults('results/bert-flores.csv');
    let ldwBertFlores = await loadResults('results/ldw-flores-bert-20k.csv');

    let cld3Flores = await loadResults('results/cld3-flores.csv');
    let ldwCld3Flores = await loadResults('results/ldw-flores-cld3-10k.csv');

    let fasttextFlores = await loadResults('results/fasttext-flores.csv');
    let glotlidFlores = await loadResults('results/glotlid-flores.csv');
    let ldwFasttextFlores = await loadResults('results/ldw-flores-fasttext-20k.csv');

    let bertTatoeba = await loadResults('results/bert-tatoeba.csv');
    let ldwBertTatoeba = await loadResults('results/ldw-tatoeba-bert-20k.csv');

    let cld3Tatoeba = await loadResults('results/cld3-tatoeba.csv');
    let ldwCld3Tatoeba = await loadResults('results/ldw-tatoeba-cld3-10k.csv');

    let fasttextTatoeba = await loadResults('results/fasttext-tatoeba.csv');
    let glotlidTatoeba = await loadResults('results/glotlid-tatoeba.csv');
    let ldwFasttextTatoeba = await loadResults('results/ldw-tatoeba-fasttext-20k.csv');

    let bertOpensubtitles = await loadResults('results/bert-opensubtitles.csv');
    let ldwBertOpensubtitles = await loadResults('results/ldw-opensubtitles-bert-20k.csv');

    let cld3Opensubtitles = await loadResults('results/cld3-opensubtitles.csv');
    let ldwCld3Opensubtitles = await loadResults('results/ldw-opensubtitles-cld3-10k.csv');

    let fasttextOpensubtitles = await loadResults('results/fasttext-opensubtitles.csv');
    let glotlidOpensubtitles = await loadResults('results/glotlid-opensubtitles.csv');
    let ldwFasttextOpensubtitles = await loadResults('results/ldw-opensubtitles-fasttext-20k.csv');
  

    console.log("Table 4");
    const outputFs = fs.createWriteStream('summaries/table-4.csv', { flags: 'w' });

    console.log("Table 4: Precision");
    outputFs.write(`Table 4: Performances of the different libraries\n\n`);
    outputFs.write(`Precision\n`);
    outputFs.write(`Benchmark,Type,BERT,ldw20k BERT,CLD3,ldw10k CLD3,fastText,GlotLID,ldw20k fastText\n`);
    outputFs.write(`WiLI,Macro,${bertWili['Macro'].precision},${ldwBertWili['Macro'].precision},${cld3Wili['Macro'].precision},${ldwCld3Wili['Macro'].precision},${fasttextWili['Macro'].precision},${glotlidWili['Macro'].precision},${ldwFasttextWili['Macro'].precision}\n`);
    outputFs.write(`WiLI,Micro,${bertWili['Micro'].precision},${ldwBertWili['Micro'].precision},${cld3Wili['Micro'].precision},${ldwCld3Wili['Micro'].precision},${fasttextWili['Micro'].precision},${glotlidWili['Micro'].precision},${ldwFasttextWili['Micro'].precision}\n`);
    outputFs.write(`WiLI,95% CI`);

    console.log("Table 4: Precision - WiLI 95% CI");
    let [low, high] = await confidenceInterval(bertWili, 'precision', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertWili, 'precision', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);


    [low, high] = await confidenceInterval(cld3Wili, 'precision', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Wili, 'precision', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextWili, 'precision', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidWili, 'precision', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextWili, 'precision', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: Precision - WiLI McNemar");
    let n01, n10, pValue, chi2;
    outputFs.write(`WiLI,McNemar`);
    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(bertWili), Object.keys(ldwBertWili), `results/bert-wili-errors.csv`, `results/ldw-wili-bert-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(cld3Wili), Object.keys(ldwCld3Wili), `results/cld3-wili-errors.csv`, `results/ldw-wili-cld3-10k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(fasttextWili), Object.keys(ldwFasttextWili), `results/fasttext-wili-errors.csv`, `results/ldw-wili-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)}`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(glotlidWili), Object.keys(ldwFasttextWili), `results/glotlid-wili-errors.csv`, `results/ldw-wili-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},\n`);

    outputFs.write(`FLORES+,Macro,${bertFlores['Macro'].precision},${ldwBertFlores['Macro'].precision},${cld3Flores['Macro'].precision},${ldwCld3Flores['Macro'].precision},${fasttextFlores['Macro'].precision},${glotlidFlores['Macro'].precision},${ldwFasttextFlores['Macro'].precision}\n`);
    outputFs.write(`FLORES+,Micro,${bertFlores['Micro'].precision},${ldwBertFlores['Micro'].precision},${cld3Flores['Micro'].precision},${ldwCld3Flores['Micro'].precision},${fasttextFlores['Micro'].precision},${glotlidFlores['Micro'].precision},${ldwFasttextFlores['Micro'].precision}\n`);
    outputFs.write(`FLORES+,95% CI`);

    console.log("Table 4: Precision - FLORES+ 95% CI");
    [low, high] = await confidenceInterval(bertFlores, 'precision', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertFlores, 'precision', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Flores, 'precision', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Flores, 'precision', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextFlores, 'precision', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidFlores, 'precision', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextFlores, 'precision', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: Precision - FLORES+ McNemar");
    outputFs.write(`FLORES+,McNemar`);
    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(bertFlores), Object.keys(ldwBertFlores), `results/bert-flores-errors.csv`, `results/ldw-flores-bert-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(cld3Flores), Object.keys(ldwCld3Flores), `results/cld3-flores-errors.csv`, `results/ldw-flores-cld3-10k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);
 
    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(fasttextFlores), Object.keys(ldwFasttextFlores), `results/fasttext-flores-errors.csv`, `results/ldw-flores-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)}`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(glotlidFlores), Object.keys(ldwFasttextFlores), `results/glotlid-flores-errors.csv`, `results/ldw-flores-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},\n`);

    outputFs.write(`Tatoeba,Macro,${bertTatoeba['Macro'].precision},${ldwBertTatoeba['Macro'].precision},${cld3Tatoeba['Macro'].precision},${ldwCld3Tatoeba['Macro'].precision},${fasttextTatoeba['Macro'].precision},${glotlidTatoeba['Macro'].precision},${ldwFasttextTatoeba['Macro'].precision}\n`);
    outputFs.write(`Tatoeba,Micro,${bertTatoeba['Micro'].precision},${ldwBertTatoeba['Micro'].precision},${cld3Tatoeba['Micro'].precision},${ldwCld3Tatoeba['Micro'].precision},${fasttextTatoeba['Micro'].precision},${glotlidTatoeba['Micro'].precision},${ldwFasttextTatoeba['Micro'].precision}\n`);
    outputFs.write(`Tatoeba,95% CI`);
    console.log("Table 4: Precision - Tatoeba 95% CI");

    [low, high] = await confidenceInterval(bertTatoeba, 'precision', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertTatoeba, 'precision', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Tatoeba, 'precision', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Tatoeba, 'precision', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextTatoeba, 'precision', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidTatoeba, 'precision', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextTatoeba, 'precision', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: Precision - Tatoeba McNemar");
    outputFs.write(`Tatoeba,McNemar`);
    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(bertTatoeba), Object.keys(ldwBertTatoeba), `results/bert-tatoeba-errors.csv`, `results/ldw-tatoeba-bert-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(cld3Tatoeba), Object.keys(ldwCld3Tatoeba), `results/cld3-tatoeba-errors.csv`, `results/ldw-tatoeba-cld3-10k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(fasttextTatoeba), Object.keys(ldwFasttextTatoeba), `results/fasttext-tatoeba-errors.csv`, `results/ldw-tatoeba-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)}`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(glotlidTatoeba), Object.keys(ldwFasttextTatoeba), `results/glotlid-tatoeba-errors.csv`, `results/ldw-tatoeba-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},\n`);


    outputFs.write(`OpenSubtitles,Macro,${bertOpensubtitles['Macro'].precision},${ldwBertOpensubtitles['Macro'].precision},${cld3Opensubtitles['Macro'].precision},${ldwCld3Opensubtitles['Macro'].precision},${fasttextOpensubtitles['Macro'].precision},${glotlidOpensubtitles['Macro'].precision},${ldwFasttextOpensubtitles['Macro'].precision}\n`);
    outputFs.write(`OpenSubtitles,Micro,${bertOpensubtitles['Micro'].precision},${ldwBertOpensubtitles['Micro'].precision},${cld3Opensubtitles['Micro'].precision},${ldwCld3Opensubtitles['Micro'].precision},${fasttextOpensubtitles['Micro'].precision},${glotlidOpensubtitles['Micro'].precision},${ldwFasttextOpensubtitles['Micro'].precision}\n`);
    outputFs.write(`OpenSubtitles,95% CI`);
    console.log("Table 4: Precision - OpenSubtitles 95% CI");

    [low, high] = await confidenceInterval(bertOpensubtitles, 'precision', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertOpensubtitles, 'precision', `results/languages-bert-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Opensubtitles, 'precision', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Opensubtitles, 'precision', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextOpensubtitles, 'precision', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidOpensubtitles, 'precision', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextOpensubtitles, 'precision', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: Precision - OpenSubtitles McNemar");
    outputFs.write(`OpenSubtitles,McNemar`);
    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(bertOpensubtitles), Object.keys(ldwBertOpensubtitles), `results/bert-opensubtitles-errors.csv`, `results/ldw-opensubtitles-bert-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(cld3Opensubtitles), Object.keys(ldwCld3Opensubtitles), `results/cld3-opensubtitles-errors.csv`, `results/ldw-opensubtitles-cld3-10k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(fasttextOpensubtitles), Object.keys(ldwFasttextOpensubtitles), `results/fasttext-opensubtitles-errors.csv`, `results/ldw-opensubtitles-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)}`);

    ({ n01, n10, pValue, chi2 } = await mcNemarTest(Object.keys(glotlidOpensubtitles), Object.keys(ldwFasttextOpensubtitles), `results/glotlid-opensubtitles-errors.csv`, `results/ldw-opensubtitles-fasttext-20k-errors.csv`));
    outputFs.write(`,n01=${n01} n10=${n10} chi2=${chi2.toFixed(2)},\n`);

    console.log("Table 4: Recall");
    outputFs.write(`\nRecall\n`);
    outputFs.write(`Benchmark,Type,BERT,ldw20k BERT,CLD3,ldw10k CLD3,fastText,GlotLID,ldw20k fastText\n`);
    outputFs.write(`WiLI,Macro,${bertWili['Macro'].recall},${ldwBertWili['Macro'].recall},${cld3Wili['Macro'].recall},${ldwCld3Wili['Macro'].recall},${fasttextWili['Macro'].recall},${glotlidWili['Macro'].recall},${ldwFasttextWili['Macro'].recall}\n`);
    outputFs.write(`WiLI,Micro,${bertWili['Micro'].recall},${ldwBertWili['Micro'].recall},${cld3Wili['Micro'].recall},${ldwCld3Wili['Micro'].recall},${fasttextWili['Micro'].recall},${glotlidWili['Micro'].recall},${ldwFasttextWili['Micro'].recall}\n`);
    outputFs.write(`WiLI,95% CI`);

    [low, high] = await confidenceInterval(bertWili, 'recall', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertWili, 'recall', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);


    [low, high] = await confidenceInterval(cld3Wili, 'recall', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Wili, 'recall', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextWili, 'recall', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidWili, 'recall', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextWili, 'recall', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);


    outputFs.write(`FLORES+,Macro,${bertFlores['Macro'].recall},${ldwBertFlores['Macro'].recall},${cld3Flores['Macro'].recall},${ldwCld3Flores['Macro'].recall},${fasttextFlores['Macro'].recall},${glotlidFlores['Macro'].recall},${ldwFasttextFlores['Macro'].recall}\n`);
    outputFs.write(`FLORES+,Micro,${bertFlores['Micro'].recall},${ldwBertFlores['Micro'].recall},${cld3Flores['Micro'].recall},${ldwCld3Flores['Micro'].recall},${fasttextFlores['Micro'].recall},${glotlidFlores['Micro'].recall},${ldwFasttextFlores['Micro'].recall}\n`);
    outputFs.write(`FLORES+,95% CI`);

    [low, high] = await confidenceInterval(bertFlores, 'recall', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertFlores, 'recall', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Flores, 'recall', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Flores, 'recall', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextFlores, 'recall', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidFlores, 'recall', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextFlores, 'recall', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`Tatoeba,Macro,${bertTatoeba['Macro'].recall},${ldwBertTatoeba['Macro'].recall},${cld3Tatoeba['Macro'].recall},${ldwCld3Tatoeba['Macro'].recall},${fasttextTatoeba['Macro'].recall},${glotlidTatoeba['Macro'].recall},${ldwFasttextTatoeba['Macro'].recall}\n`);
    outputFs.write(`Tatoeba,Micro,${bertTatoeba['Micro'].recall},${ldwBertTatoeba['Micro'].recall},${cld3Tatoeba['Micro'].recall},${ldwCld3Tatoeba['Micro'].recall},${fasttextTatoeba['Micro'].recall},${glotlidTatoeba['Micro'].recall},${ldwFasttextTatoeba['Micro'].recall}\n`);
    outputFs.write(`Tatoeba,95% CI`);

    [low, high] = await confidenceInterval(bertTatoeba, 'recall', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertTatoeba, 'recall', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Tatoeba, 'recall', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Tatoeba, 'recall', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextTatoeba, 'recall', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidTatoeba, 'recall', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextTatoeba, 'recall', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`OpenSubtitles,Macro,${bertOpensubtitles['Macro'].recall},${ldwBertOpensubtitles['Macro'].recall},${cld3Opensubtitles['Macro'].recall},${ldwCld3Opensubtitles['Macro'].recall},${fasttextOpensubtitles['Macro'].recall},${glotlidOpensubtitles['Macro'].recall},${ldwFasttextOpensubtitles['Macro'].recall}\n`);
    outputFs.write(`OpenSubtitles,Micro,${bertOpensubtitles['Micro'].recall},${ldwBertOpensubtitles['Micro'].recall},${cld3Opensubtitles['Micro'].recall},${ldwCld3Opensubtitles['Micro'].recall},${fasttextOpensubtitles['Micro'].recall},${glotlidOpensubtitles['Micro'].recall},${ldwFasttextOpensubtitles['Micro'].recall}\n`);
    outputFs.write(`OpenSubtitles,95% CI`);

    [low, high] = await confidenceInterval(bertOpensubtitles, 'recall', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertOpensubtitles, 'recall', `results/languages-bert-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Opensubtitles, 'recall', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Opensubtitles, 'recall', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextOpensubtitles, 'recall', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidOpensubtitles, 'recall', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextOpensubtitles, 'recall', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);


    outputFs.write(`\nAccuracy\n`);
    outputFs.write(`Benchmark,Type,BERT,ldw20k BERT,CLD3,ldw10k CLD3,fastText,GlotLID,ldw20k fastText\n`);
    outputFs.write(`WiLI,Macro,${bertWili['Macro'].accuracy},${ldwBertWili['Macro'].accuracy},${cld3Wili['Macro'].accuracy},${ldwCld3Wili['Macro'].accuracy},${fasttextWili['Macro'].accuracy},${glotlidWili['Macro'].accuracy},${ldwFasttextWili['Macro'].accuracy}\n`);
    outputFs.write(`WiLI,Micro,${bertWili['Micro'].accuracy},${ldwBertWili['Micro'].accuracy},${cld3Wili['Micro'].accuracy},${ldwCld3Wili['Micro'].accuracy},${fasttextWili['Micro'].accuracy},${glotlidWili['Micro'].accuracy},${ldwFasttextWili['Micro'].accuracy}\n`);
    outputFs.write(`WiLI,95% CI`);

    [low, high] = await confidenceInterval(bertWili, 'accuracy', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertWili, 'accuracy', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Wili, 'accuracy', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Wili, 'accuracy', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextWili, 'accuracy', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidWili, 'accuracy', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextWili, 'accuracy', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`FLORES+,Macro,${bertFlores['Macro'].accuracy},${ldwBertFlores['Macro'].accuracy},${cld3Flores['Macro'].accuracy},${ldwCld3Flores['Macro'].accuracy},${fasttextFlores['Macro'].accuracy},${glotlidFlores['Macro'].accuracy},${ldwFasttextFlores['Macro'].accuracy}\n`); 
    outputFs.write(`FLORES+,Micro,${bertFlores['Micro'].accuracy},${ldwBertFlores['Micro'].accuracy},${cld3Flores['Micro'].accuracy},${ldwCld3Flores['Micro'].accuracy},${fasttextFlores['Micro'].accuracy},${glotlidFlores['Micro'].accuracy},${ldwFasttextFlores['Micro'].accuracy}\n`);
    outputFs.write(`FLORES+,95% CI`);

    [low, high] = await confidenceInterval(bertFlores, 'accuracy', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertFlores, 'accuracy', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Flores, 'accuracy', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Flores, 'accuracy', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextFlores, 'accuracy', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidFlores, 'accuracy', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextFlores, 'accuracy', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`Tatoeba,Macro,${bertTatoeba['Macro'].accuracy},${ldwBertTatoeba['Macro'].accuracy},${cld3Tatoeba['Macro'].accuracy},${ldwCld3Tatoeba['Macro'].accuracy},${fasttextTatoeba['Macro'].accuracy},${glotlidTatoeba['Macro'].accuracy},${ldwFasttextTatoeba['Macro'].accuracy}\n`);
    outputFs.write(`Tatoeba,Micro,${bertTatoeba['Micro'].accuracy},${ldwBertTatoeba['Micro'].accuracy},${cld3Tatoeba['Micro'].accuracy},${ldwCld3Tatoeba['Micro'].accuracy},${fasttextTatoeba['Micro'].accuracy},${glotlidTatoeba['Micro'].accuracy},${ldwFasttextTatoeba['Micro'].accuracy}\n`);
    outputFs.write(`Tatoeba,95% CI`);

    [low, high] = await confidenceInterval(bertTatoeba, 'accuracy', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertTatoeba, 'accuracy', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Tatoeba, 'accuracy', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Tatoeba, 'accuracy', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextTatoeba, 'accuracy', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidTatoeba, 'accuracy', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextTatoeba, 'accuracy', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`OpenSubtitles,Macro,${bertOpensubtitles['Macro'].accuracy},${ldwBertOpensubtitles['Macro'].accuracy},${cld3Opensubtitles['Macro'].accuracy},${ldwCld3Opensubtitles['Macro'].accuracy},${fasttextOpensubtitles['Macro'].accuracy},${glotlidOpensubtitles['Macro'].accuracy},${ldwFasttextOpensubtitles['Macro'].accuracy}\n`);
    outputFs.write(`OpenSubtitles,Micro,${bertOpensubtitles['Micro'].accuracy},${ldwBertOpensubtitles['Micro'].accuracy},${cld3Opensubtitles['Micro'].accuracy},${ldwCld3Opensubtitles['Micro'].accuracy},${fasttextOpensubtitles['Micro'].accuracy},${glotlidOpensubtitles['Micro'].accuracy},${ldwFasttextOpensubtitles['Micro'].accuracy}\n`);
    outputFs.write(`OpenSubtitles,95% CI`);

    [low, high] = await confidenceInterval(bertOpensubtitles, 'accuracy', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertOpensubtitles, 'accuracy', `results/languages-bert-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Opensubtitles, 'accuracy', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Opensubtitles, 'accuracy', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextOpensubtitles, 'accuracy', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidOpensubtitles, 'accuracy', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextOpensubtitles, 'accuracy', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: F1-Score");
    outputFs.write(`\nF1-Score\n`);
    outputFs.write(`Benchmark,Type,BERT,ldw20k BERT,CLD3,ldw10k CLD3,fastText,GlotLID,ldw20k fastText\n`);
    outputFs.write(`WiLI,Macro,${bertWili['Macro'].f1},${ldwBertWili['Macro'].f1},${cld3Wili['Macro'].f1},${ldwCld3Wili['Macro'].f1},${fasttextWili['Macro'].f1},${glotlidWili['Macro'].f1},${ldwFasttextWili['Macro'].f1}\n`);
    outputFs.write(`WiLI,Micro,${bertWili['Micro'].f1},${ldwBertWili['Micro'].f1},${cld3Wili['Micro'].f1},${ldwCld3Wili['Micro'].f1},${fasttextWili['Micro'].f1},${glotlidWili['Micro'].f1},${ldwFasttextWili['Micro'].f1}\n`);
    outputFs.write(`WiLI,95% CI`);

    [low, high] = await confidenceInterval(bertWili, 'f1', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertWili, 'f1', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Wili, 'f1', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Wili, 'f1', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextWili, 'f1', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidWili, 'f1', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextWili, 'f1', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`FLORES+,Macro,${bertFlores['Macro'].f1},${ldwBertFlores['Macro'].f1},${cld3Flores['Macro'].f1},${ldwCld3Flores['Macro'].f1},${fasttextFlores['Macro'].f1},${glotlidFlores['Macro'].f1},${ldwFasttextFlores['Macro'].f1}\n`);
    outputFs.write(`FLORES+,Micro,${bertFlores['Micro'].f1},${ldwBertFlores['Micro'].f1},${cld3Flores['Micro'].f1},${ldwCld3Flores['Micro'].f1},${fasttextFlores['Micro'].f1},${glotlidFlores['Micro'].f1},${ldwFasttextFlores['Micro'].f1}\n`);
    outputFs.write(`FLORES+,95% CI`);

    [low, high] = await confidenceInterval(bertFlores, 'f1', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertFlores, 'f1', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Flores, 'f1', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Flores, 'f1', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextFlores, 'f1', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidFlores, 'f1', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextFlores, 'f1', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`Tatoeba,Macro,${bertTatoeba['Macro'].f1},${ldwBertTatoeba['Macro'].f1},${cld3Tatoeba['Macro'].f1},${ldwCld3Tatoeba['Macro'].f1},${fasttextTatoeba['Macro'].f1},${glotlidTatoeba['Macro'].f1},${ldwFasttextTatoeba['Macro'].f1}\n`);
    outputFs.write(`Tatoeba,Micro,${bertTatoeba['Micro'].f1},${ldwBertTatoeba['Micro'].f1},${cld3Tatoeba['Micro'].f1},${ldwCld3Tatoeba['Micro'].f1},${fasttextTatoeba['Micro'].f1},${glotlidTatoeba['Micro'].f1},${ldwFasttextTatoeba['Micro'].f1}\n`);
    outputFs.write(`Tatoeba,95% CI`);

    [low, high] = await confidenceInterval(bertTatoeba, 'f1', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertTatoeba, 'f1', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Tatoeba, 'f1', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Tatoeba, 'f1', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextTatoeba, 'f1', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidTatoeba, 'f1', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextTatoeba, 'f1', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`OpenSubtitles,Macro,${bertOpensubtitles['Macro'].f1},${ldwBertOpensubtitles['Macro'].f1},${cld3Opensubtitles['Macro'].f1},${ldwCld3Opensubtitles['Macro'].f1},${fasttextOpensubtitles['Macro'].f1},${glotlidOpensubtitles['Macro'].f1},${ldwFasttextOpensubtitles['Macro'].f1}\n`);
    outputFs.write(`OpenSubtitles,Micro,${bertOpensubtitles['Micro'].f1},${ldwBertOpensubtitles['Micro'].f1},${cld3Opensubtitles['Micro'].f1},${ldwCld3Opensubtitles['Micro'].f1},${fasttextOpensubtitles['Micro'].f1},${glotlidOpensubtitles['Micro'].f1},${ldwFasttextOpensubtitles['Micro'].f1}\n`);
    outputFs.write(`OpenSubtitles,95% CI`);

    [low, high] = await confidenceInterval(bertOpensubtitles, 'f1', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertOpensubtitles, 'f1', `results/languages-bert-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Opensubtitles, 'f1', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Opensubtitles, 'f1', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextOpensubtitles, 'f1', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidOpensubtitles, 'f1', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextOpensubtitles, 'f1', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    console.log("Table 4: Specificity");
    outputFs.write(`\nSpecificity\n`);
    outputFs.write(`Benchmark,Type,BERT,ldw20k BERT,CLD3,ldw10k CLD3,fastText,GlotLID,ldw20k fastText\n`);
    outputFs.write(`WiLI,Macro,${bertWili['Macro'].specificity},${ldwBertWili['Macro'].specificity},${cld3Wili['Macro'].specificity},${ldwCld3Wili['Macro'].specificity},${fasttextWili['Macro'].specificity},${glotlidWili['Macro'].specificity},${ldwFasttextWili['Macro'].specificity}\n`);
    outputFs.write(`WiLI,Micro,${bertWili['Micro'].specificity},${ldwBertWili['Micro'].specificity},${cld3Wili['Micro'].specificity},${ldwCld3Wili['Micro'].specificity},${fasttextWili['Micro'].specificity},${glotlidWili['Micro'].specificity},${ldwFasttextWili['Micro'].specificity}\n`);
    outputFs.write(`WiLI,95% CI`);

    [low, high] = await confidenceInterval(bertWili, 'specificity', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertWili, 'specificity', `results/languages-bert-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Wili, 'specificity', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Wili, 'specificity', `results/languages-cld3-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextWili, 'specificity', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidWili, 'specificity', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextWili, 'specificity', `results/languages-fasttext-wili.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`FLORES+,Macro,${bertFlores['Macro'].specificity},${ldwBertFlores['Macro'].specificity},${cld3Flores['Macro'].specificity},${ldwCld3Flores['Macro'].specificity},${fasttextFlores['Macro'].specificity},${glotlidFlores['Macro'].specificity},${ldwFasttextFlores['Macro'].specificity}\n`);
    outputFs.write(`FLORES+,Micro,${bertFlores['Micro'].specificity},${ldwBertFlores['Micro'].specificity},${cld3Flores['Micro'].specificity},${ldwCld3Flores['Micro'].specificity},${fasttextFlores['Micro'].specificity},${glotlidFlores['Micro'].specificity},${ldwFasttextFlores['Micro'].specificity}\n`);
    outputFs.write(`FLORES+,95% CI`);

    [low, high] = await confidenceInterval(bertFlores, 'specificity', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertFlores, 'specificity', `results/languages-bert-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Flores, 'specificity', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Flores, 'specificity', `results/languages-cld3-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextFlores, 'specificity', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidFlores, 'specificity', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextFlores, 'specificity', `results/languages-fasttext-flores.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);


    outputFs.write(`Tatoeba,Macro,${bertTatoeba['Macro'].specificity},${ldwBertTatoeba['Macro'].specificity},${cld3Tatoeba['Macro'].specificity},${ldwCld3Tatoeba['Macro'].specificity},${fasttextTatoeba['Macro'].specificity},${glotlidTatoeba['Macro'].specificity},${ldwFasttextTatoeba['Macro'].specificity}\n`);
    outputFs.write(`Tatoeba,Micro,${bertTatoeba['Micro'].specificity},${ldwBertTatoeba['Micro'].specificity},${cld3Tatoeba['Micro'].specificity},${ldwCld3Tatoeba['Micro'].specificity},${fasttextTatoeba['Micro'].specificity},${glotlidTatoeba['Micro'].specificity},${ldwFasttextTatoeba['Micro'].specificity}\n`);
    outputFs.write(`Tatoeba,95% CI`);

    [low, high] = await confidenceInterval(bertTatoeba, 'specificity', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} -${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertTatoeba, 'specificity', `results/languages-bert-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Tatoeba, 'specificity', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Tatoeba, 'specificity', `results/languages-cld3-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextTatoeba, 'specificity', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidTatoeba, 'specificity', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextTatoeba, 'specificity', `results/languages-fasttext-tatoeba.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);

    outputFs.write(`OpenSubtitles,Macro,${bertOpensubtitles['Macro'].specificity},${ldwBertOpensubtitles['Macro'].specificity},${cld3Opensubtitles['Macro'].specificity},${ldwCld3Opensubtitles['Macro'].specificity},${fasttextOpensubtitles['Macro'].specificity},${glotlidOpensubtitles['Macro'].specificity},${ldwFasttextOpensubtitles['Macro'].specificity}\n`);
    outputFs.write(`OpenSubtitles,Micro,${bertOpensubtitles['Micro'].specificity},${ldwBertOpensubtitles['Micro'].specificity},${cld3Opensubtitles['Micro'].specificity},${ldwCld3Opensubtitles['Micro'].specificity},${fasttextOpensubtitles['Micro'].specificity},${glotlidOpensubtitles['Micro'].specificity},${ldwFasttextOpensubtitles['Micro'].specificity}\n`);
    outputFs.write(`OpenSubtitles,95% CI`);

    [low, high] = await confidenceInterval(bertOpensubtitles, 'specificity', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwBertOpensubtitles, 'specificity', `results/languages-bert-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(cld3Opensubtitles, 'specificity', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);
    
    [low, high] = await confidenceInterval(ldwCld3Opensubtitles, 'specificity', `results/languages-cld3-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(fasttextOpensubtitles, 'specificity', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(glotlidOpensubtitles, 'specificity', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}`);

    [low, high] = await confidenceInterval(ldwFasttextOpensubtitles, 'specificity', `results/languages-fasttext-opensubtitles.txt`);
    outputFs.write(`,${low.toFixed(2)} - ${high.toFixed(2)}\n`);


    outputFs.close();
  }
  {
    // Table 9 - Ablation study
    console.log("Table 9");
    let outputFs = fs.createWriteStream('summaries/table-9.csv', { flags: 'w' });

    
    let ldwWili20k = await loadResults('results/ldw-wili-final-20k.csv');
    let ldwWili20kNoDifferential = await loadResults('results/ldw-wili-no-differential-20k.csv');
    let ldwWili20kNoEnglish = await loadResults('results/ldw-wili-no-english-20k.csv');

    let ldwFlores20k = await loadResults('results/ldw-flores-final-20k.csv');
    let ldwFlores20kNoDifferential = await loadResults('results/ldw-flores-no-differential-20k.csv');
    let ldwFlores20kNoEnglish = await loadResults('results/ldw-flores-no-english-20k.csv');

    let ldwMultilingual20k = await loadResults('results/ldw-multilingual-top-20k.csv');
    let ldwMultilingual20kNoDifferential = await loadResults('results/ldw-multilingual-no-differential-20k.csv');
    let ldwMultilingual20kNoEnglish = await loadResults('results/ldw-multilingual-no-english-20k.csv');

    outputFs.write(`Table 9: Ablation study\n\n`);
    outputFs.write(`Precision\n`);
    outputFs.write(`Dataset,type,WiLI,FLORES+,Multilingual\n`);
    outputFs.write(`No differential weighting,Macro,${ldwWili20kNoDifferential['Macro'].precision},${ldwFlores20kNoDifferential['Macro'].precision},${ldwMultilingual20kNoDifferential['Macro'].precision}\n`);
    outputFs.write(`No differential weighting,Micro,${ldwWili20kNoDifferential['Micro'].precision},${ldwFlores20kNoDifferential['Micro'].precision},${ldwMultilingual20kNoDifferential['Micro'].precision}\n`);

    outputFs.write(`Differential weighting,Macro,${ldwWili20kNoEnglish['Macro'].precision},${ldwFlores20kNoEnglish['Macro'].precision},${ldwMultilingual20kNoEnglish['Macro'].precision}\n`);
    outputFs.write(`Differential weighting,Micro,${ldwWili20kNoEnglish['Micro'].precision},${ldwFlores20kNoEnglish['Micro'].precision},${ldwMultilingual20kNoEnglish['Micro'].precision}\n`);
  
    outputFs.write(`Differential weighting with English bias,Macro,${ldwWili20k['Macro'].precision},${ldwFlores20k['Macro'].precision},${ldwMultilingual20k['Macro'].precision}\n`);
    outputFs.write(`Differential weighting with English bias,Micro,${ldwWili20k['Micro'].precision},${ldwFlores20k['Micro'].precision},${ldwMultilingual20k['Micro'].precision}\n`);

    outputFs.write(`\nRecall\n`);
    outputFs.write(`Dataset,type,WiLI,FLORES+,Multilingual\n`);
    outputFs.write(`No differential weighting,Macro,${ldwWili20kNoDifferential['Macro'].recall},${ldwFlores20kNoDifferential['Macro'].recall},${ldwMultilingual20kNoDifferential['Macro'].recall}\n`);
    outputFs.write(`No differential weighting,Micro,${ldwWili20kNoDifferential['Micro'].recall},${ldwFlores20kNoDifferential['Micro'].recall},${ldwMultilingual20kNoDifferential['Micro'].recall}\n`);

    outputFs.write(`Differential weighting,Macro,${ldwWili20kNoEnglish['Macro'].recall},${ldwFlores20kNoEnglish['Macro'].recall},${ldwMultilingual20kNoEnglish['Macro'].recall}\n`);
    outputFs.write(`Differential weighting,Micro,${ldwWili20kNoEnglish['Micro'].recall},${ldwFlores20kNoEnglish['Micro'].recall},${ldwMultilingual20kNoEnglish['Micro'].recall}\n`);

    outputFs.write(`Differential weighting with English bias,Macro,${ldwWili20k['Macro'].recall},${ldwFlores20k['Macro'].recall},${ldwMultilingual20k['Macro'].recall}\n`);
    outputFs.write(`Differential weighting with English bias,Micro,${ldwWili20k['Micro'].recall},${ldwFlores20k['Micro'].recall},${ldwMultilingual20k['Micro'].recall}\n`);


    outputFs.write(`\nAccuracy\n`);
    outputFs.write(`Dataset,type,WiLI,FLORES+,Multilingual\n`);
    outputFs.write(`No differential weighting,Macro,${ldwWili20kNoDifferential['Macro'].accuracy},${ldwFlores20kNoDifferential['Macro'].accuracy},${ldwMultilingual20kNoDifferential['Macro'].accuracy}\n`);
    outputFs.write(`No differential weighting,Micro,${ldwWili20kNoDifferential['Micro'].accuracy},${ldwFlores20kNoDifferential['Micro'].accuracy},${ldwMultilingual20kNoDifferential['Micro'].accuracy}\n`);

    outputFs.write(`Differential weighting,Macro,${ldwWili20kNoEnglish['Macro'].accuracy},${ldwFlores20kNoEnglish['Macro'].accuracy},${ldwMultilingual20kNoEnglish['Macro'].accuracy}\n`);
    outputFs.write(`Differential weighting,Micro,${ldwWili20kNoEnglish['Micro'].accuracy},${ldwFlores20kNoEnglish['Micro'].accuracy},${ldwMultilingual20kNoEnglish['Micro'].accuracy}\n`);
    
    outputFs.write(`Differential weighting with English bias,Macro,${ldwWili20k['Macro'].accuracy},${ldwFlores20k['Macro'].accuracy},${ldwMultilingual20k['Macro'].accuracy}\n`);
    outputFs.write(`Differential weighting with English bias,Micro,${ldwWili20k['Micro'].accuracy},${ldwFlores20k['Micro'].accuracy},${ldwMultilingual20k['Micro'].accuracy}\n`);

    
    outputFs.write(`\nF1-Score\n`);
    outputFs.write(`Dataset,type,WiLI,FLORES+,Multilingual\n`);
    outputFs.write(`No differential weighting,Macro,${ldwWili20kNoDifferential['Macro'].f1},${ldwFlores20kNoDifferential['Macro'].f1},${ldwMultilingual20kNoDifferential['Macro'].f1}\n`);
    outputFs.write(`No differential weighting,Micro,${ldwWili20kNoDifferential['Micro'].f1},${ldwFlores20kNoDifferential['Micro'].f1},${ldwMultilingual20kNoDifferential['Micro'].f1}\n`);

    outputFs.write(`Differential weighting,Macro,${ldwWili20kNoEnglish['Macro'].f1},${ldwFlores20kNoEnglish['Macro'].f1},${ldwMultilingual20kNoEnglish['Macro'].f1}\n`);
    outputFs.write(`Differential weighting,Micro,${ldwWili20kNoEnglish['Micro'].f1},${ldwFlores20kNoEnglish['Micro'].f1},${ldwMultilingual20kNoEnglish['Micro'].f1}\n`);

    outputFs.write(`Differential weighting with English bias,Macro,${ldwWili20k['Macro'].f1},${ldwFlores20k['Macro'].f1},${ldwMultilingual20k['Macro'].f1}\n`);
    outputFs.write(`Differential weighting with English bias,Micro,${ldwWili20k['Micro'].f1},${ldwFlores20k['Micro'].f1},${ldwMultilingual20k['Micro'].f1}\n`);

  

    outputFs.write(`\nSpecificity\n`);
    outputFs.write(`Dataset,type,WiLI,FLORES+,Multilingual\n`);
    outputFs.write(`No differential weighting,Macro,${ldwWili20kNoDifferential['Macro'].specificity},${ldwFlores20kNoDifferential['Macro'].specificity},${ldwMultilingual20kNoDifferential['Macro'].specificity}\n`);
    outputFs.write(`No differential weighting,Micro,${ldwWili20kNoDifferential['Micro'].specificity},${ldwFlores20kNoDifferential['Micro'].specificity},${ldwMultilingual20kNoDifferential['Micro'].specificity}\n`);

    outputFs.write(`Differential weighting,Macro,${ldwWili20kNoEnglish['Macro'].specificity},${ldwFlores20kNoEnglish['Macro'].specificity},${ldwMultilingual20kNoEnglish['Macro'].specificity}\n`);
    outputFs.write(`Differential weighting,Micro,${ldwWili20kNoEnglish['Micro'].specificity},${ldwFlores20kNoEnglish['Micro'].specificity},${ldwMultilingual20kNoEnglish['Micro'].specificity}\n`);
    
    outputFs.write(`Differential weighting with English bias,Macro,${ldwWili20k['Macro'].specificity},${ldwFlores20k['Macro'].specificity},${ldwMultilingual20k['Macro'].specificity}\n`);
    outputFs.write(`Differential weighting with English bias,Micro,${ldwWili20k['Micro'].specificity},${ldwFlores20k['Micro'].specificity},${ldwMultilingual20k['Micro'].specificity}\n`);

    outputFs.close();


    // Table 9.1 - Ablation study - languages
    console.log("Table 9.1");
    outputFs = fs.createWriteStream('summaries/table-9-1.csv', { flags: 'w' });

    outputFs.write(`Table 9.1: Ablation study\n\n`);
    outputFs.write(`Precision\n`);
    outputFs.write(`Dataset,bs,hr,Indonesian,Malay, English\n`);
    outputFs.write(`No differential weighting,${ldwWili20kNoDifferential['bs'].precision},${ldwWili20kNoDifferential['hr'].precision},${ldwWili20kNoDifferential['id'].precision},${ldwWili20kNoDifferential['ms'].precision},${ldwWili20kNoDifferential['en'].precision}\n`);
    outputFs.write(`Differential weighting,${ldwWili20kNoEnglish['bs'].precision},${ldwWili20kNoEnglish['hr'].precision},${ldwWili20kNoEnglish['id'].precision},${ldwWili20kNoEnglish['ms'].precision},${ldwWili20kNoEnglish['en'].precision}\n`);
    outputFs.write(`Differential weighting with English bias,${ldwWili20k['bs'].precision},${ldwWili20k['hr'].precision},${ldwWili20k['id'].precision},${ldwWili20k['ms'].precision},${ldwWili20k['en'].precision}\n`);

    outputFs.write(`\nRecall\n`);
    outputFs.write(`Dataset,bs,hr,Indonesian,Malay, English\n`);
    outputFs.write(`No differential weighting,${ldwWili20kNoDifferential['bs'].recall},${ldwWili20kNoDifferential['hr'].recall},${ldwWili20kNoDifferential['id'].recall},${ldwWili20kNoDifferential['ms'].recall},${ldwWili20kNoDifferential['en'].recall}\n`);
    outputFs.write(`Differential weighting,${ldwWili20kNoEnglish['bs'].recall},${ldwWili20kNoEnglish['hr'].recall},${ldwWili20kNoEnglish['id'].recall},${ldwWili20kNoEnglish['ms'].recall},${ldwWili20kNoEnglish['en'].recall}\n`);
    outputFs.write(`Differential weighting with English bias,${ldwWili20k['bs'].recall},${ldwWili20k['hr'].recall},${ldwWili20k['id'].recall},${ldwWili20k['ms'].recall},${ldwWili20k['en'].recall}\n`);

    outputFs.write(`\nAccuracy\n`);
    outputFs.write(`Dataset,bs,hr,Indonesian,Malay, English\n`);
    outputFs.write(`No differential weighting,${ldwWili20kNoDifferential['bs'].accuracy},${ldwWili20kNoDifferential['hr'].accuracy},${ldwWili20kNoDifferential['id'].accuracy},${ldwWili20kNoDifferential['ms'].accuracy},${ldwWili20kNoDifferential['en'].accuracy}\n`);
    outputFs.write(`Differential weighting,${ldwWili20kNoEnglish['bs'].accuracy},${ldwWili20kNoEnglish['hr'].accuracy},${ldwWili20kNoEnglish['id'].accuracy},${ldwWili20kNoEnglish['ms'].accuracy},${ldwWili20kNoEnglish['en'].accuracy}\n`);
    outputFs.write(`Differential weighting with English bias,${ldwWili20k['bs'].accuracy},${ldwWili20k['hr'].accuracy},${ldwWili20k['id'].accuracy},${ldwWili20k['ms'].accuracy},${ldwWili20k['en'].accuracy}\n`);

    outputFs.write(`\nF1-Score\n`);
    outputFs.write(`Dataset,bs,hr,Indonesian,Malay, English\n`);
    outputFs.write(`No differential weighting,${ldwWili20kNoDifferential['bs'].f1},${ldwWili20kNoDifferential['hr'].f1},${ldwWili20kNoDifferential['id'].f1},${ldwWili20kNoDifferential['ms'].f1},${ldwWili20kNoDifferential['en'].f1}\n`);
    outputFs.write(`Differential weighting,${ldwWili20kNoEnglish['bs'].f1},${ldwWili20kNoEnglish['hr'].f1},${ldwWili20kNoEnglish['id'].f1},${ldwWili20kNoEnglish['ms'].f1},${ldwWili20kNoEnglish['en'].f1}\n`);
    outputFs.write(`Differential weighting with English bias,${ldwWili20k['bs'].f1},${ldwWili20k['hr'].f1},${ldwWili20k['id'].f1},${ldwWili20k['ms'].f1},${ldwWili20k['en'].f1}\n`);

    outputFs.write(`\nSpecificity\n`);
    outputFs.write(`Dataset,bs,hr,Indonesian,Malay, English\n`);
    outputFs.write(`No differential weighting,${ldwWili20kNoDifferential['bs'].specificity},${ldwWili20kNoDifferential['hr'].specificity},${ldwWili20kNoDifferential['id'].specificity},${ldwWili20kNoDifferential['ms'].specificity},${ldwWili20kNoDifferential['en'].specificity}\n`);
    outputFs.write(`Differential weighting,${ldwWili20kNoEnglish['bs'].specificity},${ldwWili20kNoEnglish['hr'].specificity},${ldwWili20kNoEnglish['id'].specificity},${ldwWili20kNoEnglish['ms'].specificity},${ldwWili20kNoEnglish['en'].specificity}\n`);
    outputFs.write(`Differential weighting with English bias,${ldwWili20k['bs'].specificity},${ldwWili20k['hr'].specificity},${ldwWili20k['id'].specificity},${ldwWili20k['ms'].specificity},${ldwWili20k['en'].specificity}\n`);

    outputFs.close();
  }

})();


function loadResults(filename: string) : Promise<any> {
  let results : any = {};;
  const fileStream = fs.createReadStream(filename, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });

  return new Promise((resolve) => {
    rl.on('line', (line: string) => {
      const [language, precision, recall, accuracy, f1, specificity, samples] = line.split(',');
      if (language === 'language')
        return;

      results[language] = {
        precision, 
        recall, 
        accuracy,
        f1, 
        specificity, 
        samples
      };
    });

    rl.on('close', () => {
      resolve(results);
    });
  });
}

function confidenceInterval(stats: any, field : string = 'accuracy', intervalFile: string, p: number = 95) : Promise<number[]> {
  const fileStream = fs.createReadStream(intervalFile, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });
  let results : number[] = [];

  return new Promise((resolve) => {
    rl.on('line', (line: string) => {
      let total = 0;
      let count = 0;
      const languages = line.split(',');
      for(let language of languages) {
        if (language.length > 3 || language.length < 2)
          continue;

        if(!stats[language] || !stats[language][field])
          continue;

        let value = parseFloat(stats[language][field]);
        total += value;
        count++;
      }

      let mean = total / count;
      results.push(mean);
    });

    rl.on('close', () => {
      results = results.sort((a, b) => a - b);
      let lowerIndex = Math.floor((100 - p) / 2 / 100 * results.length);
      let upperIndex = Math.ceil((p + (100 - p) / 2) / 100 * results.length) - 1;
      results = [results[lowerIndex], results[upperIndex]];

      resolve(results);
    });
  });

}

function binomialCoeff(n : number, k: number) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - (k - i));
    res /= i;
  }
  return res;
}

// Exact McNemar (two-sided)
function exactMcNemar(n10: number, n01: number) {
  const n = n10 + n01;
  if (n === 0) return 1.0;

  const k = Math.min(n10, n01);
  let cumulative = 0;

  for (let i = 0; i <= k; i++) {
    cumulative += binomialCoeff(n, i);
  }

  const p = 2 * cumulative / Math.pow(2, n);
  return Math.min(p, 1.0);
}

async function mcNemarTest(languages1 : string[], languages2: string[], error1File : string, error2File: string): Promise<any> {
  console.log(`\tLoading ${error1File}...`);
  let errors1 : any = await loadErrors(error1File);
  console.log(`\tLoading ${error2File}...`);
  let errors2 : any = await loadErrors(error2File);

  let error1Count = 0;
  let error2Count = 0;

  for(let key of Object.keys(errors1)) {
    let { language, text } = errors1[key];
    // console.log(`${language} => ${text}`);

    if (! languages2.includes(language))
      continue;

    if (! errors2[key])
      error1Count++;
    /*else 
      console.log(`Same error found: ${language}`);*/
  }

  for(let key of Object.keys(errors2)) {
    let { language, text } = errors2[key];

    if (! languages1.includes(language))
      continue;

    if (! errors1[key])
      error2Count++;
    /*else 
      console.log(`Same error found: ${language}`);*/
  }

  const n01 = error1Count;
  const n10 = error2Count;
  const pValue = exactMcNemar(n10, n01);
  const chi2 = (Math.pow(Math.abs(n01 - n10) - 1, 2)) / (n01 + n10);

  console.log(`\tmcNemarTest done`);
  return { n01, n10, pValue, chi2 };
  
}

function loadErrors(filename: string) : Promise<any> {
  let results : any = {};
  const fileStream = fs.createReadStream(filename, 'utf-8');
  const rl = readline.createInterface({ input: fileStream });

  return new Promise((resolve) => {
    rl.on('line', (line: string) => {
      // Parse line without {columns: true} to avoid header overhead
      const parsed = csvsync.parse(line, { skip_empty_lines: true })[0];
      if (!parsed || parsed.length < 3) return;

      const id = parsed[0];
      const language = parsed[1];
      const text = parsed[2];

      if (id) {
        results[id] = { language, text };
      } else {
        results[text] = { language, text };
      }
    });

    rl.on('close', () => {
      resolve(results);
    });
  });
}