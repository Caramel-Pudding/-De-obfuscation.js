'use strict'
const obfuscate = require('../obfuscate');
const deobfuscate = require('../deobfuscate');
const childProcess = require('child_process');
const shared = require('../shared');

const filename = 'test';

const sourcePath = `assets/obfuscation/${filename}.js`;
const outputObfuscatedPath = `assets/obfuscation/output/obfuscated/${filename}-ob.js`;
const outputDeobfuscatedPath = `assets/obfuscation/output/deobfuscated/${filename}-deob.js`;
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
    let notObfuscatedCode;

    beforeAll(() =>
        obfuscate.obfuscate(sourcePath, outputObfuscatedPath, dictionaryPath).then((obfuscated) => {
            obfuscatedCode = obfuscated;
            return deobfuscate(outputObfuscatedPath, outputDeobfuscatedPath, dictionaryPath).then(deobfuscated => {
                deobfuscatedCode = deobfuscated;
                return shared.readFileAsync(sourcePath, '').then(code => {
                    notObfuscatedCode = code.toString();
                });
            });
        })
    );

    describe('Obfuscated code', () => {
        it("contains only spaces and \\n", () => {
            const result = obfuscatedCode.replace(/ /g, '').replace(/\n/g, '');
            expect(result).toBe('');
        });

        it("should run without errors", (done) => {
            runScript(outputObfuscatedPath, (error) => {
                expect(error).toBe(null);
                done();
            })
        });
    });

    describe('Deobfuscated code', () => {
        it("should run without errors (if not-obfuscated too)", (done) => {
            runScript(outputDeobfuscatedPath, (error) => {
                expect(error).toBe(null);
                done();
            })
        });

        it("should be like not-obfuscated without spaces", () => {
            const codeWithoutSpaces = obfuscate.removeSpaces(notObfuscatedCode);
            expect(deobfuscatedCode).toBe(codeWithoutSpaces);
        });

    });

});

