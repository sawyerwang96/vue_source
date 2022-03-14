import { mergeOptions } from '../util/index.js';

export default function initMixin(Vue) {
  // 生命周期的合并策略 [beforeCreate, beforeCreate]
  // 发布-订阅模式
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}