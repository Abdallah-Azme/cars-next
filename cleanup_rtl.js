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

      // Match ${isRtl ? 'flex-row-reverse space-x-reverse' : ''} -> replace with ''
      content = content.replace(/\$\{isRtl \? 'flex-row-reverse space-x-reverse' : ''\}/g, '');
      
      // Match ${isRtl ? 'flex-row-reverse' : ''} with varying prefixes
      content = content.replace(/\$\{isRtl \? '(?:sm:|md:|lg:|xl:)?flex-row-reverse' : ''\}/g, '');

      // Match ${isRtl ? 'text-right' : 'text-left'} -> text-start
      content = content.replace(/\$\{isRtl \? 'text-right' : 'text-left'\}/g, 'text-start');

      // Match ${isRtl ? 'text-left' : 'text-right'} -> text-end
      content = content.replace(/\$\{isRtl \? 'text-left' : 'text-right'\}/g, 'text-end');

      // Match ${isRtl ? 'flex-row-reverse text-right' : ''} -> text-start
      content = content.replace(/\$\{isRtl \? 'flex-row-reverse text-right' : ''\}/g, 'text-start');

      // Match ${isRtl ? 'md:flex-row-reverse' : 'md:flex-row'}
      content = content.replace(/\$\{isRtl \? 'md:flex-row-reverse' : 'md:flex-row'\}/g, 'md:flex-row');

      // Match ${isRtl ? 'md:justify-start flex-row-reverse' : 'md:justify-start'}
      content = content.replace(/\$\{isRtl \? 'md:justify-start flex-row-reverse' : 'md:justify-start'\}/g, 'md:justify-start');

      // Replace rtl:flex-row-reverse -> ''
      content = content.replace(/rtl:flex-row-reverse/g, '');

      // Replace className={isRtl ? 'flex-row-reverse' : ''} -> ''
      content = content.replace(/className=\{isRtl \? 'flex-row-reverse' : ''\}/g, '');

      // Clean up stray empty interpolation
      content = content.replace(/\$\{\s*\}/g, '');
      
      // Cleanup empty className={` `}
      content = content.replace(/className=\{\s*`\s*`\s*\}/g, '');

      // Try to clean up multiple spaces inside className backticks
      content = content.replace(/className=\{`([^`]+)`\}/g, (match, p1) => {
          return `className={\`${p1.replace(/\s{2,}/g, ' ').trim()}\`}`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
