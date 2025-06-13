const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

fs.copyFileSync(path.join(projectRoot, 'index.html'), path.join(distDir, 'index.html'));
copyDir(path.join(projectRoot, 'public'), path.join(distDir, 'public'));

console.log('Build succeeded (static copy).');
