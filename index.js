#!/usr/bin/env node
const { program } = require('commander');   // 命令行
const inquirer = require('inquirer');       // 交互式的命令
const download = require("download-git-repo");  // 下载并提取 git 仓库，用于下载项目模板
const spin = require('io-spin')

const chalk = require("chalk"); // 给终端的字体加上颜色

const path = require('path');
const fs = require('fs');

const { copyDir } = require('./utils')
// cli版本
program.version(require('./package').version, '-v, --version, -V', 'cli的最新版本号');

const templates = require('./template/index');

// 命令行选择列表
let prompList = [
    {
        type:'list',
        name: 'template',
        message: '请选择你想要生成的项目模板？',
        choices: templates,
        default: templates[0]
    }
]
// 获取文件路径
function resolvePath(pathName){
  return path.resolve(path.join(__dirname, pathName))
}
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
  const spinner = spin("downloading...",'Box1');
  spinner.start()
  return new Promise((resolve, reject) => {
    download(
        gitUrl,
        path.resolve(process.cwd(), projectName),
        { clone: true },
        function (err) {
          if (err) {
            return reject(err);
            spinner.stop()
          }
          spinner.stop()
          resolve();
        }
    );
  });
}
async function downloadGitTemplate(projectName, gitUrl) {
  console.log(
      chalk.bold.cyan("cmq_cli: ") + "creating..."
  );
  try {
    await checkName(projectName);
    await downloadTemplate(gitUrl, projectName)
    console.log(chalk.green("download completed"));
    console.log(
        chalk.bold.cyan("cmq_cli: ") + "finished!"
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
}
// 选择以自定义模板还是git的模板
function checkTem(template,filename){
  let customTem = [ 'mobile-template', 'vue-admin-template']
  if(customTem.indexOf(template)>=0){
    let sourceDir = resolvePath(`./template/${template}`)
    let targetDir = path.resolve(`${process.cwd()}/${filename}`)
    copyDir(sourceDir, targetDir).then(()=>{
      console.log(
          chalk.bold.cyan("cmq_cli: ") + "finished!"
      );
    })
  }else {
    let downloadList = {
        "vue-element-admin": {
          src: "https://github.com:PanJiaChen/vue-element-admin#master"
        },
        "ts-vue": {
          src: "https://github.com:easy-wheel/ts-vue#master",
        }
    }
    downloadGitTemplate(filename,downloadList[template].src)
  }
}
// 设置选项
program
    .command('create <filename>')
    .description('选择模板项目')
    .action(async (filename) => {
      const res = await inquirer.prompt(prompList)  // 命令行选择的选择的选项
      console.log("选择了", res.template);
      checkTem(res.template,filename)
    })

// 处理命令行输入的参数
program.parse(process.argv);

