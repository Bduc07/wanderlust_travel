import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertMarkdownToPDF() {
  // Read the markdown file
  const markdownPath = path.join(__dirname, 'README.md');
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  
  // Convert markdown to HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Wanderlust Travel Website - Installation Guide</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        h2 {
          color: #2980b9;
          margin-top: 30px;
        }
        h3 {
          color: #3498db;
        }
        code {
          background-color: #f5f5f5;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: monospace;
        }
        pre {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
        }
        pre code {
          background-color: transparent;
          padding: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div id="markdown-content"></div>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script>
        document.getElementById('markdown-content').innerHTML = marked.parse(\`${markdown.replace(/`/g, '\\`')}\`);
      </script>
    </body>
    </html>
  `;

  // Create temporary HTML file
  const tempHtmlPath = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHtmlPath, html);

  // Launch browser and create PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: path.join(__dirname, 'Readme.pdf'),
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    printBackground: true
  });

  await browser.close();

  // Clean up temp file
  fs.unlinkSync(tempHtmlPath);
  
  console.log('PDF has been generated successfully!');
}

// Self-invoking function to use async/await
(async () => {
  try {
    await convertMarkdownToPDF();
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();