import initMixin from './mixin.js';
import initAssetRegisters from './assets.js'
import { ASSETS_TYPE } from './const.js';
import initExtend from './initExtend.js';

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = {};

  initMixin(Vue);


  // 初始化的全局过滤器、指令、组件 
  // Vue.options = { components: {}, directives: {}, filter: {} }
  ASSETS_TYPE.forEach(type => {
    Vue.options[type + 's'] = {};
  });
  
  Vue.options._base = Vue; // _base是Vue的构造函数 _base永远指向父类

  initExtend(Vue);
  initAssetRegisters(Vue);
}