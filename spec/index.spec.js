'use strict'
const obfuscate = require('../obfuscate');
const deobfuscate = require('../deobfuscate');
const util = require('util');
const fs = require('fs');
const childProcess = require('child_process');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const filename = 'test';

const sourcePath = `assets/tests/${filename}.js`;
const outputObfuscatedPath = `assets/output/obfuscated/${filename}-ob.js`;
const outputDeobfuscatedPath = `assets/output/deobfuscated/${filename}-deob.js`;
const dictionaryPath = 'assets/dictionary.json';

// function for running scripts
const runScript = (scriptPath, callback) => {
    let invoked = false;

    const process = childProcess.fork(scriptPath);

    process.on('error', (err) => {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', (code) => {
        if (invoked) return;
        invoked = true;
        const err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}
// end function for running scripts

describe('Tests', () => {

    let obfuscatedCode;
    let deobfuscatedCode;

    beforeAll(() =>
        obfuscate(sourcePath, outputObfuscatedPath, dictionaryPath).then((obfuscated) => {
            obfuscatedCode = obfuscated;
            return deobfuscate(outputObfuscatedPath, outputDeobfuscatedPath, dictionaryPath).then(deobfuscated => {
                deobfuscatedCode = deobfuscated;
            });
        })
    );

    describe('Obfuscated code', () => {
        it("contains only spaces and \\n", () => {
            const result = obfuscatedCode.replace(/ /g, '').replace(/\n/g, '');
            expect(result).toBe('');
        });
    });

    describe('Deobfuscated code', () => {
        it("should run without errors", (done) => {
            runScript(outputDeobfuscatedPath, (error) => {
                expect(error).toBe(null);
                done();
            })
        });
    });
});

