const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default; // js deep tree shaking
const PurifyCSSPlugin = require('purifycss-webpack'); // css tree shaking
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css
const setIterm2Badge = require('set-iterm2-badge'); // iterm 打印。。。 c
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development'; // 环境变量
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const merge = require('webpack-merge'); // 合并配置
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { join } = require('path');


const _modeflag = _mode === 'production' ? true : false; // 是否为线上环境

setIterm2Badge('帅帅的包~');

const  webpackConfig = {
  module: {
    rules: [
        {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              // 'style-loader',  // style-loader跟mini-css-extract-plugin有冲突 得用人家默认的
              {
                /**
                 * modules表示指定css module 可以import 同时里面class名会被编译成一个唯一标识
                 * 防止css冲突，每个模块的css类名被打包成当前模块对应的。类似vue scoped的实现。
                 * localIdentName 可以规范化class命名 name为module name local为css模块里的类名
                 */
                // loader: 'css-loader?modules&localIdentName=[name]_[local]-[hash:base64:5]'
                loader: 'css-loader'
            }]
        }
    ]
  },
  devServer: {
    // port: 3000,
    // hot: true,
    before(app) { // mock 数据
      app.get('/api/test', (req, res) => {
        res.json({
          code: 200,
          message: 'mock 数据'
        })
      })
    }
  },
  // 单页配置
  optimization: {
    splitChunks: { // 配置对主包main.bundles.js进行拆分
      cacheGroups: {  // 缓存组
        commons: {
          chunks: 'initial', // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
          name: 'common', // 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成
          minChunks: 1, // 表示被引用次数，默认为1
          maxInitialRequests: 5, // 最大的初始化加载次数，默认为1
          minSize: 0 // 表示在压缩前的最小模块大小，默认为0；
        }
      }
    },
    runtimeChunk: { // 打出一个运行时的包
      name: "runtime"
    }
  },
  plugins: [
        new WebpackDeepScopeAnalysisPlugin({
          dry: true,
          verbose: true,
          cleanOnceBeforeBuildPatterns: ['./dist/*.html']
        }), // 优化jstree shaking
        new MiniCssExtractPlugin({ // 提取css
            filename: _modeflag ? 'styles/[name].[hash:5].css' : 'styles/[name].css',
            chunkFilename: _modeflag ? '[id].[hash:5].css' : 'styles/[name].css',
        }),
        new HtmlWebpackPlugin({
          title: '单页应用',
          template: './src/index.html', //指定要打包的html路径和文件名
          filename: 'index.html' //指定输出路径和文件名
        }),
        new CleanWebpackPlugin(),
        new PurifyCSSPlugin({ // css tree shaking
            paths: glob.sync(join(__dirname, './src/*.html'))
        })
    ]
};

module.exports = merge(_mergeConfig, webpackConfig);
