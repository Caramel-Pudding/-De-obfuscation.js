const shared = require('./shared');

async function obfuscate(sourcePath, outputPath, dictionaryPath) {
    
    let code = await shared.readFileAsync(sourcePath, 'utf8');
    const data = await shared.readFileAsync(dictionaryPath);
    const dict = JSON.parse(data);

    // obfuscation
    code = removeSpaces(code);
    Object.keys(dict).forEach(key => {
        code = code.replace(key, dict[key]);
    });
    code = makeInvisible(code);
    await shared.writeFileAsync(outputPath, code);
    return code;
}

function removeSpaces(code) {
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

obfuscate(shared.sourcePathObfuscation, shared.outputObfuscatedPath, shared.dictionaryPath);

module.exports.obfuscate = obfuscate;
module.exports.removeSpaces = removeSpaces;