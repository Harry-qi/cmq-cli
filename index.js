#!/usr/bin/env node
const { program } = require('commander');   // 命令行
const inquirer = require('inquirer');       // 交互式的命令
const path = require('path');

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

// 设置选项
program
    .command('create <filename>')
    .description('选择模板项目')
    .action(async (filename) => {
      const res = await inquirer.prompt(prompList)  // 命令行选择的选择的选项
      copyDir(resolvePath(`./template/${res.template}`),resolvePath(`./${filename}`));
    })

// 处理命令行输入的参数
program.parse(process.argv);

