import * as fs from 'fs';
if(!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}
fs.copyFileSync('./package.json', './dist/package.json');
