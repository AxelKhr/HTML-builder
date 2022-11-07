const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const dirPath = path.join(__dirname, 'secret-folder');

readdir(dirPath, { withFileTypes: true }).then(objs => {
  for (const obj of objs) {
    if (obj.isFile()) {
      const filePath = path.join(dirPath, obj.name);
      const fileName = path.basename(filePath).replace(/\..+/gm, '');
      const fileExt = path.extname(filePath).replace('.', '');
      stat(filePath).then(statRes => {
        const fileSize = statRes.size.toString() + ' bytes';
        stdout.write(fileName + ' - ' + fileExt + ' - ' + fileSize + '\n');
      })
    }
  }
})