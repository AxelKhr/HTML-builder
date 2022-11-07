const path = require('path');
const { open, readdir, readFile, appendFile } = require('fs/promises');

const dirSrcPath = path.join(__dirname, 'styles');
const dirDestPath = path.join(__dirname, 'project-dist');

open(path.join(dirDestPath, 'bundle.css'), 'w').then(result => {
  return readdir(dirSrcPath, { withFileTypes: true });
}).then(objs => {
  for (let obj of objs) {
    const filePath = path.join(dirSrcPath, obj.name);
    if (obj.isFile() && (path.extname(filePath) === '.css')) {
      (async () => {
        const data = await readFile(path.join(dirSrcPath, obj.name), { encoding: 'utf8' });
        await appendFile(path.join(dirDestPath, 'bundle.css'), data + '\n');
      })();
    }
  }
})
