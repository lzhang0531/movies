const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/dist/'
  : '/'

const pages = {
  manage: {
    // 应用入口配置，相当于单页面应用的main.js，必需项
    entry: 'src/manage/main.js',
      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/manage.html',
      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'manage.html',
      // 包含的模块，可选项
      // chunks: ['manage'],
      publicPath: BASE_URL,
  },
  index: {
    // 应用入口配置，相当于单页面应用的main.js，必需项
    entry: 'src/index/app.js',
      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/index.html',
      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'index.html',
      // chunks: ['index'],
      publicPath: BASE_URL,
  },
}

module.exports = {
  pages,
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src/manage')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/manage/components'))
      .set('index', resolve('src/index'))
  },
  configureWebpack: config => {
    config.externals = {
      // 格式为 '资源的名字' : '给外部引用的名字',
      // vue: 'Vue',
      // 'vue-router': 'VueRouter',
      // axios: 'axios',
      // vuex: 'Vuex',
      dplayer: 'Dplayer'
    }
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/manage': {
        target: 'http://47.111.232.212:9090',
        changeOrigin: true,  //是否跨域
        pathRewrite:{
          '^/manage':''
        }
      },
      '/file': {
        target: 'http://47.111.232.212',  // 后台接口域名
        changeOrigin: true,  //是否跨域
      }
    }
  }
}
