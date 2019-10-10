const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const filename = 'test';

const sourcePathObfuscation = `assets/obfuscation/${filename}.js`;
const sourcePathDeobfuscation = `assets/deobfuscation/${filename}.js`;
const outputObfuscatedPath = `assets/output/obfuscated/${filename}-ob.js`;
const outputDeobfuscatedPath = `assets/output/deobfuscated/${filename}-deob.js`;
const dictionaryPath = 'assets/dictionary.json';

module.exports.readFileAsync = readFileAsync;
module.exports.writeFileAsync = writeFileAsync;

module.exports.filename = filename;

module.exports.sourcePathObfuscation = sourcePathObfuscation;
module.exports.sourcePathDeobfuscation = sourcePathDeobfuscation;
module.exports.outputObfuscatedPath = outputObfuscatedPath;
module.exports.outputDeobfuscatedPath = outputDeobfuscatedPath;
module.exports.dictionaryPath = dictionaryPath;