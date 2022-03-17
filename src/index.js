import { initMixin } from './init.js';
import { renderMixin } from './render.js'
import { lifecycleMixin } from './lifecycle.js';
import { initGlobalAPI } from './initGlobalAPI/index.js';
import { compileToFunction } from './compiler/index.js';
import { patch, createElm } from './vdom/patch.js';

// Vue的核心代码 只是Vue的一个声明
function Vue(options) {
  // 进行初始化操作
  this._init(options);

}

// 通过引入的方式 给Vue添加方法
initMixin(Vue); // 给Vue原型添加一个_init方法
renderMixin(Vue); // _render 得到虚拟dom
lifecycleMixin(Vue); // _update 渲染更新都需要这个方法

initGlobalAPI(Vue); // 初始化全局API

// const vm1 = new Vue({
//   data() {
//     return {
//       name: 'wsy'
//     }
//   }
// });

// const vm2 = new Vue({
//   data() {
//     return {
//       name: 'sawyer',
//       age: 16
//     }
//   }
// });

// let render1 = compileToFunction(`<div id="app">{{name}}</div>`);
// let render2 = compileToFunction(`<p id="app">{{name}}<span>{{age}}</span></p>`);

// let vnode1 = render1.call(vm1);
// let vnode2 = render2.call(vm2);

// let el = createElm(vnode1);
// document.body.appendChild(el);

// setTimeout(() => {
//   patch(vnode1, vnode2);
// }, 3000);

export default Vue;