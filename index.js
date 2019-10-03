var fs = require('fs');
const util = require('util');

const sourcePath = 'assets/test.js';
const outputObfuscatedPath = 'assets/obfuscated/test.js';
const outputDeobfuscatedPath = 'assets/deobfuscated/test.js';
const dictionaryPath = 'assets/dictionary.json';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function obfuscate(sourcePath, outputPath, dictionaryPath) {
    let code = await readFileAsync(sourcePath, 'utf8');
    const data = await readFileAsync(dictionaryPath);
    const dict = JSON.parse(data);

    // obfuscation
    code = removeSpaces(code);
    code = makeInvisible(code);
    // Object.keys(dict).forEach(key => {
    //     code = code.replace(key, dict[key]);
    // });

    await writeFileAsync(outputPath, code);
}

async function deobfuscate(sourcePath, outputPath, dictionaryPath) {
    let code = await readFileAsync(sourcePath, 'utf8');
    const data = await readFileAsync(dictionaryPath);

    const dict = JSON.parse(data);
    // Object.keys(dict).forEach(key => {
    //     code = code.replace(dict[key], key);
    // });
    code = makeVisible(code);

    await writeFileAsync(outputPath, code);
}

obfuscate(sourcePath, outputObfuscatedPath, dictionaryPath).then(() => {
    deobfuscate(outputObfuscatedPath, outputDeobfuscatedPath, dictionaryPath);
});

function removeSpaces(code) {
    return code.replace(/(\W+?)\s+(\W+?)/g, '$1$2');
}

function makeInvisible(visibleCode) {
    let result = '';
    
    for (let symbol of visibleCode) {
        binary = symbol.charCodeAt(0).toString(2);
        binary = binary.padStart(8, ' ');
        let invisible = binary.replace(/0/g, ' ');
        invisible = invisible.replace(/1/g, '\n'); 
        result += invisible;
    }
    return result;
}

function makeVisible(invisibleCode) {
    let result = '';

    invisibleCode = invisibleCode.replace(/\n/g, 1);
    invisibleCode = invisibleCode.replace(/ /g, 0);
    let splittedString = invisibleCode.match(/.{8}/g);
    for (binary of splittedString) {
        result += String.fromCharCode(parseInt(binary, 2).toString(10)); 
    }
    return result;
}