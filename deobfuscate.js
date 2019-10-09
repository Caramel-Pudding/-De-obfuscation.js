const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function deobfuscate(sourcePath, outputPath, dictionaryPath) {
    let code = await readFileAsync(sourcePath, 'utf8');
    const data = await readFileAsync(dictionaryPath);

    const dict = JSON.parse(data);
    code = makeVisible(code);
    Object.keys(dict).forEach(key => {
        code = code.replace(dict[key], key);
    });
    await writeFileAsync(outputPath, code);
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

module.exports = deobfuscate;