const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      content = content.replace(/isRtl \? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"/g, '"me-2 h-4 w-4"');
      content = content.replace(/isRtl \? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"/g, '"ms-2 h-4 w-4"');
      
      content = content.replace(/isRtl\s*\?\s*['"]text-right block w-full['"]\s*:\s*['"]['"]/g, '"block w-full text-start"');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Cleaned up ' + fullPath);
      }
    }
  }
}

try {
  processDir(path.join(__dirname, 'src'));
} catch (e) {
  console.error(e);
}
