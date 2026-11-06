const fs = require('fs');

const cssContent = fs.readFileSync('C:/Users/mubar/.gemini/antigravity/scratch/reversemarket/frontend/dist/assets/index-cbVbqhQi.css', 'utf8');
const jsContent = fs.readFileSync('C:/Users/mubar/.gemini/antigravity/scratch/reversemarket/frontend/dist/assets/index-Dfymhlur.js', 'utf8');

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
  <body class="bg-[#fff0f3] text-gray-900 antialiased font-sans selection:bg-brand-500 selection:text-white">
    <div id="root"></div>
    <script>
      ${jsContent}
    </script>
  </body>
</html>
`;

fs.writeFileSync('C:/Users/mubar/.gemini/antigravity/brain/e3cb5790-f9cf-4872-8869-6189a8dc8c55/reversemarket_live.html', standaloneHtml, 'utf8');
console.log('reversemarket_live.html updated.');
