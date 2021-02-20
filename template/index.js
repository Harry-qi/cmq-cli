const path = require('path');
const fs = require('fs');
const filePath1 = path.resolve(path.join(__dirname, './mobile-template'));
const filePath2 = path.resolve(path.join(__dirname, './vue-admin-template'));

// 递归读取文件
function getFiles(filePath){
  let files =  fs.readdirSync(filePath)
  let dirs = [];
  (function iterator(i) {
    if (i === files.length) {
      return;
    }
    let data = fs.statSync(path.join(filePath, files[i]))
    if (data.isFile()) {
      dirs.push(files[i]);
    }
    iterator(i + 1);
  })(0);
  return dirs
}


let template1Src = getFiles(filePath1)
let template2Src = getFiles(filePath2)
// git下载模板
let downloadList = [
  {
    name: 'vue-element-admin',
    src: "https://github.com:PanJiaChen/vue-element-admin#master"
  },
  {
    name:'ts-vue',
    src: "https://github.com:easy-wheel/ts-vue#master",
  }
]
module.exports = [
  { name: 'mobile-template', src: template1Src },
  { name: 'vue-admin-template', src: template2Src },
    ...downloadList
]
