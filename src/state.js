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

/**
 * 内部原理是通过watcher来实现的
 * @param {*} vm 
 * @param {*} computed 
 */
function initComputed(vm, computed) {
  // _computedWatchers 存放着所有的计算属性对应的watcher
  const watchers = vm._computedWatchers = {};

  for (let key in computed) {
    const userDef = computed[key]; // 获取用户定义的computed（可能是函数，也可能是对象）
    const getter = 'function' === typeof userDef ? userDef : userDef.get;

    // 获得getter函数
    // lazy: true表示计算属性（Watcher内部会根据lazy属性判断是否立即执行watcher）
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });

    // 计算属性可以直接通过vm来进行取值，所以将属性定义到实例
    defineComputed(vm, key, userDef);
  }
}

const sharePropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => {}
};

// 将属性定义到vm（vue实例上）
function defineComputed(target, key, userDef) {
  // 需要添加缓存效果
  if ('function' === typeof userDef) {
    sharePropertyDefinition.get = createComputedGetter(key);
  } else {
    sharePropertyDefinition.get = createComputedGetter(key);
    sharePropertyDefinition.set = userDef.set || (() => {})
  }
  Object.defineProperty(target, key, sharePropertyDefinition)
}

function createComputedGetter(key) {
  return function() { // 通过watcher添加缓存
    // this为当前Vue实例
    // _computedWatchers 存放着所有的计算属性对应的watcher(initComputed)
    let watcher = this._computedWatchers[key];

    if (watcher.dirty) { // 默认第一次dirty取值为true，就调用用户的方法
      // 调用用户的方法
      watcher.evaluate(); // --> get --> pushTarget --> 调用用户定义的方法(方法中会对数据进行取值)
    }

    return watcher.value;
  }
}

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