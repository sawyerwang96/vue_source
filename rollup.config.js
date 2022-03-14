// 可以支持es6的语法
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 入口
  output: {
    file: 'dist/umd/vue.js', // 打包输出路径
    name: 'Vue', // 指定打包后全局变量的名字 
    format: 'umd', // 统模块规范
    sourcemap: true, // es6 -> es5 开启源码调试 可以找到源码报错的位置
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development' && serve({
      open: true,
      openPage: '/public/index.html', // 默认打开html的路径
      port: 3000,
      contentBase: ''
    })
  ]
}