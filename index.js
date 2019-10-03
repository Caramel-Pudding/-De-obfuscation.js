var fs = require('fs');

const sourcePath = 'assets/test.js';
const outputObfuscatedPath = 'assets/obfuscated/test.js';
const outputDeobfuscatedPath = 'assets/deobfuscated/test.js';
const dictionaryPath = 'assets/dictionary.json';

obfuscate(sourcePath, outputObfuscatedPath, dictionaryPath);
// deobfuscate(outputObfuscatedPath, outputDeobfuscatedPath, dictionaryPath);

function obfuscate(sourcePath, outputPath, dictionaryPath) {
    fs.readFile(sourcePath, 'utf8', (err, contents) => {
        if (err) {
            console.log(err);
            return;
        }
        fs.readFile(dictionaryPath, (err, data) => {
            let dict = JSON.parse(data);
            Object.keys(dict).forEach(key => {
                contents = contents.replace(key, dict[key]);
                console.log(key, dict[key]);
            });
            fs.writeFile(outputPath, contents, (err) => {
                if (err) console.log(err);
            })
        })
    });
}

function deobfuscate(sourcePath, outputPath, dictionaryPath) {
    fs.readFile(sourcePath, 'utf8', (err, contents) => {
        if (err) {
            console.log(err);
            return;
        }
        fs.readFile(dictionaryPath, (err, data) => {
            let dict = JSON.parse(data);
            Object.keys(dict).forEach(key => {
                contents = contents.replace(dict[key], key);
            });
            fs.writeFile(outputPath, contents, (err) => {
                console.log(err);
            })
        })
    });
}
