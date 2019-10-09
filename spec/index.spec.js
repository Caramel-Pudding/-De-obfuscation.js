'use strict'
const obfuscate = require('../obfuscate');
const deobfuscate = require('../deobfuscate');
const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const filename = 'test';

const sourcePath = `assets/tests/${filename}.js`;
const outputObfuscatedPath = `assets/output/obfuscated/${filename}-ob.js`;
const outputDeobfuscatedPath = `assets/output/deobfuscated/${filename}-deob.js`;
const dictionaryPath = 'assets/dictionary.json';


describe('Obfuscation', () => {
    beforeEach(() =>
        obfuscate(sourcePath, outputObfuscatedPath, dictionaryPath).then(() =>
            deobfuscate(outputObfuscatedPath, outputDeobfuscatedPath, dictionaryPath)
        )
    );

    it("contains spec with an expectation", () => {
        expect(true).toBe(true);
    });
});