import { observe } from './observer/index.js';
import { isObject, proxy } from './util/index.js';
import Watcher from './observer/watcher.js';

export function initState (vm) {
  const opts = vm.$options;

  // 数据来源 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm);
  }

  if (opts.methods) {
    initMethod(vm);
  }

  if (opts.data) {
    initData(vm);
  }

  if (opts.computed) {
    initComputed(vm);
  }

  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
}

function initProps() {}

function initMethod() {}

function initData(vm) {
  // 数据初始化工作
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};

  // 对象劫持 用户改变数据 可以得到通知 重新渲染页面
  // MVVM模式 数据改变可以驱动视图变化
  // Object.definedProperty();

  for (let key in data) {
    proxy(vm, '_data', key);
  }

  observe(data);
}

function initComputed() {}

function initWatch(vm, watch) {
  // watch的原理是通过 Watcher
  for (let key in watche) {
    // 获取key对应的值
    const handler = watch[key];

    if (Array.isArray(handler)) {
      // 用户传递的是数组，循环数组依次执行创建
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      // 单纯的key value
      createWatcher(vm, key, handler);
    }
  }
}


function createWatcher(vm, key, handler, options) {
  if (isObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (typeof handler === 'string') {
    // 获取methods中的方法替换字符串的handler
    handler = vm.$options.methods[handler]
  }

  return vm.$watch(key, handler, option)
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
    const vm = this;

    // 用户watcher 用户用的
    // 渲染watcher 渲染用的（new Watcher传递的第四个参数为true，代表是渲染watcher）
    options.user = true;
    new Watcher(vm, exprOrFn, cb, options);

  }
}