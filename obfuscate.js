
const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function obfuscate(sourcePath, outputPath, dictionaryPath) {
    
    let code = await readFileAsync(sourcePath, 'utf8');
    const data = await readFileAsync(dictionaryPath);
    const dict = JSON.parse(data);

    // obfuscation
    code = removeSpaces(code);
    Object.keys(dict).forEach(key => {
        code = code.replace(key, dict[key]);
    });
    code = makeInvisible(code);
    await writeFileAsync(outputPath, code);
    return code;
}

function removeSpaces(code) {
    // code = code.replace(/(\W)\s+(\W)/g, '$1$2');
    code = code.replace(/ +$/gm, '');
    code = code.replace(/([^\w\s"']?)\s+([^\w\s"'])/g, '$1$2');
    code = code.replace(/([^\w\s"'])\s+([^\w\s"']?)/g, '$1$2');
    return code;
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

module.exports = obfuscate;