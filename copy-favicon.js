const fs = require('fs');
const path = require('path');

// Create the public/images directory if it doesn't exist
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy the favicon from src/pages/images to public/images
const sourceFile = path.join(__dirname, 'src', 'pages', 'images', 'favicon.png');
const destinationFile = path.join(publicImagesDir, 'favicon.png');

try {
  fs.copyFileSync(sourceFile, destinationFile);
  console.log('✓ Favicon copied successfully to public/images/favicon.png');
} catch (err) {
  console.error('Error copying favicon:', err);
} 