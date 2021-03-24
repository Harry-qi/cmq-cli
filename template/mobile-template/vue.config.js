const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('./src'))
  }
}
