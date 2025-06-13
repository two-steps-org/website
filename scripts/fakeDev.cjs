const http = require('http');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');

function getFile(filePath) {
  const locations = [filePath, path.join(distDir, filePath), path.join(publicDir, filePath)];
  for (const loc of locations) {
    if (fs.existsSync(loc) && fs.statSync(loc).isFile()) {
      return loc;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = getFile(path.join(projectRoot, urlPath === '/' ? 'index.html' : urlPath));
  if (!filePath) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

const port = process.env.PORT || 5173;
server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
