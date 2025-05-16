import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts markdown files to PDF
 * @param {string} inputFile - Path to markdown file
 * @param {string} outputFile - Path for output PDF
 * @param {string} title - Document title
 */
async function convertMarkdownToPDF(inputFile, outputFile, title) {
  try {
    // Read the markdown file
    console.log(`Reading markdown from ${inputFile}...`);
    const markdown = fs.readFileSync(path.join(__dirname, inputFile), 'utf8');
    
    // Convert markdown to HTML
    console.log('Converting markdown to HTML...');
    const htmlContent = marked.parse(markdown);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
            font-size: 14px;
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
            font-size: 12px;
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
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          blockquote {
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin-left: 0;
            color: #555;
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
          ul, ol {
            padding-left: 20px;
          }
          p {
            margin-bottom: 15px;
          }
          .page-break {
            page-break-after: always;
          }
          .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 90vh;
          }
          .cover-page h1 {
            font-size: 36px;
            border-bottom: none;
          }
          .cover-page p {
            font-size: 18px;
            margin-top: 10px;
          }
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
            padding: 10px 0;
          }
          .header {
            text-align: right;
            font-size: 10px;
            color: #777;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <h1>Wanderlust Travel Website</h1>
          <p>Installation and User Guide</p>
          <p style="margin-top: 100px;">May 16, 2025</p>
        </div>
        
        <div class="page-break"></div>
        
        <div class="header">
          Wanderlust Travel Website - Documentation
        </div>
        
        ${htmlContent}
        
        <div class="footer">
          © 2025 Wanderlust Travel. All rights reserved.
        </div>
      </body>
      </html>
    `;

    // Create a PDF with puppeteer
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    
    console.log('Opening new page...');
    const page = await browser.newPage();
    
    console.log('Setting content...');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    console.log(`Generating PDF to ${outputFile}...`);
    await page.pdf({
      path: path.join(__dirname, outputFile),
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      },
      printBackground: true,
      displayHeaderFooter: false
    });

    console.log('Closing browser...');
    await browser.close();
    
    console.log(`PDF successfully generated: ${outputFile}`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

// Generate all PDFs
async function generateAllPDFs() {
  // Install Guide
  await convertMarkdownToPDF(
    'README.md', 
    'Wanderlust-Installation-Guide.pdf',
    'Wanderlust Travel Website - Installation Guide'
  );
  
  // How It Works Guide
  await convertMarkdownToPDF(
    'HOW_IT_WORKS.md', 
    'Wanderlust-User-Guide.pdf',
    'Wanderlust Travel Website - User Guide'
  );
  
  console.log('All PDFs generated successfully!');
}

// Ensure marked is available
if (!marked) {
  console.error('The marked package is required. Please install it using:');
  console.error('npm install marked');
  process.exit(1);
}

// Run PDF generation
generateAllPDFs().catch(err => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});