const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/mubar/.gemini/antigravity/scratch/reversemarket';
const brainDir = 'C:/Users/mubar/.gemini/antigravity/brain/e3cb5790-f9cf-4872-8869-6189a8dc8c55';
const assetsDir = path.join(rootDir, 'frontend/dist/assets');

const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.startsWith('index') && f.endsWith('.css'));
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!cssFile || !jsFile) {
  throw new Error('Build assets not found in dist/assets');
}

let cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const loginBgBase64 = fs.readFileSync(path.join(rootDir, 'login_bg_base64.txt'), 'utf8').trim();

// Inline base64 login background
jsContent = jsContent.replaceAll('"/assets/login_bg.png"', `"data:image/png;base64,${loginBgBase64}"`);
cssContent = cssContent.replaceAll('/assets/login_bg.png', `data:image/png;base64,${loginBgBase64}`);

const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReverseMarket | Demand-Driven B2B Procurement Marketplace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      ${cssContent}
    </style>
  </head>
  <body class="bg-[#fdf2f4] text-gray-900 antialiased font-sans selection:bg-brand-500 selection:text-white">
    <div id="root"></div>
    <script>
      ${jsContent}
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(brainDir, 'reversemarket_live.html'), standaloneHtml, 'utf8');
console.log(`Successfully regenerated reversemarket_live.html with inline login background!`);
