import { observe } from './observer/index.js';
import { proxy } from './util/index.js';


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
    initWatch(vm);
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

function initWatch() {}
