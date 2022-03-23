let compiler = require('vue-template-compiler')
let ast = compiler.compile('<<cpmponent v-model="name" />')
console.log(ast)