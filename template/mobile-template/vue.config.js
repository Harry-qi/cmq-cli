const autoprefixer = require('autoprefixer')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('./src'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          require('postcss-pxtorem')({
            rootValue: 75, // 效果图 750
            propList: ['*'], // 属性的选择器，*表示通用
            selectorBlackList: ['.px-'] //   忽略的选择器   .ig-  表示 .ig- 开头的都不会转换
          })
        ]
      }
    }
  }
}
