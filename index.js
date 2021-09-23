#!/usr/bin/env node
const { program } = require('commander');   // 命令行
const inquirer = require('inquirer');       // 交互式的命令
const download = require("download-git-repo");  // 下载并提取 git 仓库，用于下载项目模板
const spin = require('io-spin');
const chalk = require("chalk"); // 给终端的字体加上颜色

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const downloadList = require('./template/index');
const templates = Object.keys(downloadList)

// 命令行选择列表
let promptList = [
  {
    type:'list',
    name: 'template',
    message: '请选择你想要生成的项目模板？',
    choices: templates,
    default: templates[0]
  }
]

// 创建项目前校验是否已存在
function checkName(projectName) {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data.includes(projectName)) {
        return reject(new Error(`${projectName} already exists!`));
      }
      resolve();
    });
  });
}
// 下载git仓库
function downloadTemplate(gitUrl, projectName) {
  const spinner = spin("downloading...")
  spinner.start()
  return new Promise((resolve, reject) => {
    download(
        gitUrl,
        path.resolve(process.cwd(), projectName),
        { clone: true },
        function (err) {
          if (err) {
            return reject(err);
          }
          spinner.stop()
          resolve();
        }
    );
  });
}
// 下载远程仓库
async function downloadGitTemplate(projectName, gitUrl) {
  console.log(
    chalk.bold.cyan("cmq_cli: ") + "creating..."
  );
  try {
    await checkName(projectName); // 检查项目名
    await downloadTemplate(gitUrl, projectName) // 下载模板
    await setPackageContent(projectName); // 设置package.json的name
    installDependencies(projectName)  // 安装依赖
  } catch (error) {
    console.log(chalk.red(error));
  }
}
// 安装依赖
function installDependencies(filename) {
  console.log("Dependencies are being installed, it may take a few minutes");
  const spinner = spin("Dependencies downloading...")
  spinner.start()
  child_process.exec('npm i',{cwd: path.resolve(process.cwd(), filename)}, (error)=>{
    if(error){
      console.error(error)
      return
    }
    spinner.stop();
    console.log(
      chalk.bold.cyan("cmq_cli: ") + "finished!"
    );
  })

}
// 选择以自定义模板还是git的模板
function checkTem(template,filename){
  downloadGitTemplate(filename,downloadList[template].src)
}
// 设置package.json的一些信息
async function setPackageContent(projectName) {
  // name description author
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), projectName, "package.json"),
      "utf8",
      (err, data) => {
        if (err) {
          return reject(err);
        }
        let packageContent = JSON.parse(data);
        packageContent.name = projectName;
        fs.writeFile(
          path.resolve(process.cwd(), projectName, "package.json"),
          JSON.stringify(packageContent, null, 2),
          "utf8",
          (err, data) => {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      }
    );
  });
}
// 获取文件路径
function resolvePath(pathName){
  const __dirname = path.resolve(path.dirname(''));
  return path.resolve(path.join(__dirname, pathName))
}
// 设置选项
program
  .command('create <filename>')
  .description('选择模板项目')
  .action(async (filename) => {
    const res = await inquirer.prompt(promptList)  // 命令行选择的选择的选项
    console.log("选择了", res.template);
    checkTem(res.template,filename)
  })

// cli版本
program.version(require('./package').version, '-v, --version, -V', 'cli的最新版本号');
// 处理命令行输入的参数
program.parse(process.argv);

