const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('\nPlease enter your text:\n');

stdin.on('data', data => {
  const dataStr = data.toString();
  if (dataStr.trim() === 'exit') {
    exit();
  } else {
    output.write(dataStr);
  }
})

process.on('SIGINT', exit);

process.on('exit', () => {
  stdout.write('\nGoodbye\n');
})
