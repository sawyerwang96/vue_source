import Watcher from './observer/watcher.js';
import { patch } from './vdom/patch.js'
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // 通过虚拟节点 渲染出真实dom
    const vm = this;
    vm.$el = patch(vm.$el, vnode); // 虚拟节点创建出真实节点 替换掉 真实的$el
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options; // render
  vm.$el = el; // 真实的dom元素

  // Watcher 就是用来渲染的
  // vm._render 通过解析render方法 渲染出虚拟dom _c _v _s
  // vm._update 通过虚拟dom 创建真实dom 

  callHook(vm, 'beforeMount');

  // 渲染页面
  let updateComponent = () => { // 渲染和更新都会使用到该方法
    // 返回的是虚拟dom
    vm._update(vm._render());
  }

  // 渲染watcher 每个组件都有一个watcher  vm.$watch
  new Watcher(vm, updateComponent, () => {}, true); // true表示他是一个渲染watcher

  callHook(vm, 'mounted');
}

// 发布
export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); // call(vm)保证是当前实例的调用
    }
  }
}