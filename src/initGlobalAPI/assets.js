import { ASSETS_TYPE } from "./const.js";

export default function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function(id, definition) {
      console.log(id, definition);
      if (type === 'component') {
        // 注册全局组件
        // 使用extend方法 将对象definition变成构造函数

        // 子组件也可能有Vue.component方法
        definition = this.options._base.extend(definition);
        console.log(this, 'wsy~~~~~~');
        // this.options --> Vue.options  保证永远指向父类
        // _base ---> function Vue
      } else if (type === 'filter') {
      } else if (type === 'directive') {
      }

      // 放到了全局的options对象上
      Vue.options[type + 's'][id] = definition;
    }
  });
}