const fs = require('fs');
const path = require('path');

const markdownDir = './markdown';
const htmlDir = './html';

// Every five seconds, parse all markdown files in the markdown directory
setInterval(() => {
  fs.readdir(markdownDir, (err, files) => {
    if (err) {
      console.error('Error reading markdown directory:', err);
      return;
    }

    files.forEach((file) => {
      if (path.extname(file) === '.md') {
        const markdownPath = path.join(markdownDir, file);
        const htmlPath = path.join(htmlDir, file.replace('.md', '.html'));

        fs.readFile(markdownPath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err);
            return;
          }

          const htmlBody = parseMarkdown(data);
          const title = path.basename(file, '.md');
          const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="../styles.css"></head><body>${htmlBody}</body></html>`;

          fs.writeFile(htmlPath, html, 'utf8', (err) => {
            if (err) {
              console.error(`Error writing HTML file for ${file}:`, err);
            } else {
              console.log(`Parsed ${file} to HTML.`);
            }
          });
        });
      }
    });
  });
}, 5000);

function parseMarkdown(markdown) {
  return (
    markdown
      // Headings
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')

      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')

      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')

      // Line breaks
      .replace(/\n$/gim, '<br />')

      // Paragraphs
      .replace(/^(?!<h[1-6]>)(.+)$/gm, '<p>$1</p>')

      // Code blocks
      .replace(/```(.*?)```/gim, '<pre><code>$1</code></pre>')

      // Inline code
      .replace(/`(.*?)`/gim, '<code>$1</code>')

      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')

      // Lists
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
  );
}
