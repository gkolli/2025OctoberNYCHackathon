import * as deepl from 'deepl-node';
import * as fs from 'fs/promises';

// --- CONFIGURATION ---
// ⚠️ IMPORTANT: Replace with your actual DeepL API Key
const AUTH_KEY = '4d3c30c3-4978-45ed-9bde-a49933fb115b:fx'; 

// The local file to translate
const SOURCE_FILE = 'en.json';

// Define the target languages (DeepL language codes)
const TARGET_LANGUAGES = [
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'fr', name: 'French' },
    { code: 'ar', name: 'Arabic' }
];
// ---------------------

// Flatten a nested object into a single level with dot-separated keys
function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

// Unflatten an object with dot-separated keys back into a nested object
function unflattenObject(obj) {
    const result = {};
    for (const i in obj) {
        const keys = i.split('.');
        keys.reduce((acc, key, j) => {
            if (j === keys.length - 1) {
                acc[key] = obj[i];
            } else {
                acc[key] = acc[key] || {};
            }
            return acc[key];
        }, result);
    }
    return result;
}

async function translateJsonFile() {
    // 1. Initialize DeepL Translator
    try {
        const translator = new deepl.Translator(AUTH_KEY);
        console.log('DeepL Translator initialized.');
        
        // 2. Load the source JSON data
        console.log(`Reading source file: ${SOURCE_FILE}`);
        const fileContent = await fs.readFile(SOURCE_FILE, 'utf-8');
        const sourceData = JSON.parse(fileContent);

        // 3. Iterate through target languages and translate
        for (const lang of TARGET_LANGUAGES) {
            console.log(`
--- Translating to ${lang.name} (${lang.code.toUpperCase()}) ---`);
            
            const flatData = flattenObject(sourceData);
            
            const keysToTranslate = Object.keys(flatData).filter(key => 
                typeof flatData[key] === 'string' && flatData[key].trim().length > 0
            );

            const sourceTexts = keysToTranslate.map(key => flatData[key]);
            
            if (sourceTexts.length === 0) {
                console.log('No valid strings found to translate. Skipping.');
                continue;
            }

            try {
                const results = await translator.translateText(
                    sourceTexts, 
                    'en', 
                    lang.code,
                    { 
                        tagHandling: 'xml',
                        formality: (lang.code === 'ar') ? 'prefer_more' : undefined 
                    }
                );
                
                const translatedFlatData = { ...flatData };
                for (let i = 0; i < keysToTranslate.length; i++) {
                    translatedFlatData[keysToTranslate[i]] = results[i].text;
                }
                
                const translatedData = unflattenObject(translatedFlatData);

                // 4. Save the translated JSON file
                const outputFileName = `${lang.code.toLowerCase()}.json`;
                await fs.writeFile(
                    outputFileName, 
                    JSON.stringify(translatedData, null, 4), 
                    'utf-8'
                );
                console.log(`✅ Successfully saved translation to ${outputFileName}`);

            } catch (error) {
                console.error(`❌ DeepL Error during translation to ${lang.name}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`❌ Fatal Error in script execution: ${error.message}`);
    }
}

translateJsonFile();