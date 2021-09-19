#!/usr/bin/env node
import { program } from 'commander';   // 命令行
import inquirer from 'inquirer';       // 交互式的命令
import download from "download-git-repo";  // 下载并提取 git 仓库，用于下载项目模板
import ora from 'ora';

import chalk from "chalk"; // 给终端的字体加上颜色

import path from 'path';
import fs from 'fs';
import child_process from 'child_process';

import templates from './template/index.js'

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
  const spinner = ora("downloading...",'Box1').start()
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
    await setPackageContent(projectName);
    installDependencies(projectName)  // 安装依赖
  } catch (error) {
    console.log(chalk.red(error));
  }
}
// 安装依赖
function installDependencies(filename) {
    console.log("Dependencies are being installed, it may take a few minutes");
    const spinner = ora("Dependencies downloading...",'Box1').start();
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
  let downloadList = {
      "vant-mobile-template": {
        src: "direct:https://github.com/Harry-qi/vant-mobile-template.git"
      },
      "vue2-template": {
        src: "direct:https://github.com/Harry-qi/vue2-tempalte.git"
      },
      "vue2-simple-admin": {
        src: "direct:https://github.com/Harry-qi/vue-admin-template.git"
      },
      "vue-element-admin": {
        src: "direct:https://github.com/PanJiaChen/vue-element-admin.git"
      }
  }
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
const packageData = fs.readFileSync('./package.json', 'utf8')
const version = JSON.parse(packageData).version
program.version(version, '-v, --version, -V', 'cli的最新版本号');

// 处理命令行输入的参数
program.parse(process.argv);

