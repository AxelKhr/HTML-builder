const fs = require('fs');
const path = require('path');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');

const dirSrcPath = path.join(__dirname, 'files');
const dirDestPath = path.join(__dirname, 'files-copy');

rm(dirDestPath, { recursive: true, force: true }).then(result => {
  return mkdir(dirDestPath, { recursive: true });
}).then(result => {
  return readdir(dirSrcPath, { withFileTypes: true });
}).then(objs => {
  for (const obj of objs) {
    if (obj.isFile()) {
      copyFile(path.join(dirSrcPath, obj.name), path.join(dirDestPath, obj.name));
    }
  }
})


