const fs = require('fs');
const path = require('path');
const { rm, mkdir, readdir, open, readFile, writeFile, appendFile, copyFile } = require('fs/promises');

async function createDir(dirPath) {
  return rm(dirPath, { recursive: true, force: true }).then(result => {
    return mkdir(dirPath, { recursive: true });
  })
}

async function readTemplates(tempPath) {
  return readdir(tempPath, { withFileTypes: true }).then(async (objs) => {
    let templates = {};
    for (let obj of objs) {
      const filePath = path.join(tempPath, obj.name);
      if (obj.isFile() && (path.extname(filePath) === '.html')) {
        const fileName = path.basename(filePath).replace(/\..+/gm, '');
        templates[fileName] = await readFile(filePath, { encoding: 'utf8' });
      }
    }
    return templates;
  });
}

function buildHTML(tempHTML, templates) {
  const tempTags = tempHTML.match(/\{\{.+\}\}/g);
  tempTags.forEach(tag => {
    tempHTML = tempHTML.replace(tag, templates[tag.slice(2, -2)]);
  })
  return tempHTML;
}

async function buildCSS(srcPath, destPath, fileName) {
  let fd = {};
  await open(path.join(destPath, fileName), 'w').then(result => {
    fd = result;
    return readdir(srcPath, { withFileTypes: true });
  }).then(async (objs) => {
    for (let obj of objs) {
      const filePath = path.join(srcPath, obj.name);
      if (obj.isFile() && (path.extname(filePath) === '.css')) {
        const data = await readFile(path.join(srcPath, obj.name), { encoding: 'utf8' });
        await appendFile(path.join(destPath, fileName), data + '\n');
      }
    }
  });
  fd.close();
}

async function copyDir(srcPath, destPath) {
  rm(destPath, { recursive: true, force: true }).then(result => {
    return mkdir(destPath, { recursive: true });
  }).then(result => {
    return readdir(srcPath, { withFileTypes: true });
  }).then(async (objs) => {
    for (const obj of objs) {
      if (obj.isFile()) {
        await copyFile(path.join(srcPath, obj.name), path.join(destPath, obj.name));
      } else if (obj.isDirectory()) {
        await copyDir(path.join(srcPath, obj.name), path.join(destPath, obj.name));
      }
    }
  })
}

(async function buildPage(srcPath, destPath) {
  const dirSrcPath = path.join(__dirname, srcPath);
  const dirDestPath = path.join(__dirname, destPath);
  try {
    await createDir(dirDestPath);
    const templates = await readTemplates(path.join(dirSrcPath, 'components'));
    const tempHTML = await readFile(path.join(__dirname, 'template.html'), { encoding: 'utf8' });
    const newHTML = buildHTML(tempHTML, templates);
    await writeFile(path.join(dirDestPath, 'index.html'), newHTML);
    await buildCSS(path.join(dirSrcPath, 'styles'), dirDestPath, 'style.css');
    await copyDir(path.join(dirSrcPath, 'assets'), path.join(dirDestPath, 'assets'));
  } catch (err) {
    console.log(err);
  }
})('', 'project-dist');
