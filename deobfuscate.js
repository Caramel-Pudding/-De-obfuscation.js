const shared = require('./shared');

async function deobfuscate(sourcePath, outputPath, dictionaryPath) {
    let code = await shared.readFileAsync(sourcePath, 'utf8');
    const data = await shared.readFileAsync(dictionaryPath);

    const dict = JSON.parse(data);
    code = makeVisible(code);
    Object.keys(dict).forEach(key => {
        code = code.replace(dict[key], key);
    });
    await shared.writeFileAsync(outputPath, code);
    return code;
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

deobfuscate(shared.sourcePathDeobfuscation, shared.outputDeobfuscatedPath, shared.dictionaryPath);

module.exports = deobfuscate;