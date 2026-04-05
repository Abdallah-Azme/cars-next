const fs = require('fs');
const path = require('path');

const locales = ['ar', 'ja', 'sw'];
const sourceFile = 'messages/en.json';
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const sourceKeys = getKeys(source);

locales.forEach(lang => {
  const file = `messages/${lang}.json`;
  if (!fs.existsSync(file)) {
    console.log(`File ${file} does not exist`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const targetKeys = getKeys(data);
  
  const missing = sourceKeys.filter(k => !targetKeys.includes(k));
  const extra = targetKeys.filter(k => !sourceKeys.includes(k));
  
  console.log(`\n--- Results for ${lang}.json ---`);
  if (missing.length > 0) {
    console.log(`Missing keys in ${lang}:`);
    missing.forEach(k => console.log(`  - ${k}`));
  } else {
    console.log(`No missing keys in ${lang}`);
  }
  
  if (extra.length > 0) {
    console.log(`Extra keys in ${lang} (not in English):`);
    extra.forEach(k => console.log(`  - ${k}`));
  }
});
