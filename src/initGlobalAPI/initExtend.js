import { mergeOptions } from "../util/index.js";
export default function initExtend(Vue) {
  // new Vue 父类_init()

  let cid = 0;
  // 创建子类 继承于父类 扩展的时候都扩展到自己的属性上
  Vue.extend = function(extendOptions) {
    console.log('------------extendOptions-------------', extendOptions);
    const Sub = function VueComponent(options) {
      this._init(options);
    };

    console.log('extend------this', this);
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype);
    Sub.prototype.constructor = Sub;

    // this.options--->父类的options
    Sub.options = mergeOptions(this.options, extendOptions);

    // mixin、use

    return Sub;
  };
}