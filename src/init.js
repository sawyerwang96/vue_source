import { initState } from "./state.js";
import { compileToFunction } from './compiler/index.js';
import { mountComponent, callHook } from './lifecycle.js';
import { mergeOptions } from "./util/index.js";
import { nextTick } from "./util/next-tick.js";

export function initMixin(Vue) {
  // 初始化流程
  Vue.prototype._init = function (options) {
    console.log(options);

    const vm = this; // vm/this -> 实例对象

    // 自己的和父类的
    // 将用户传递的和全局的options 合并
    vm.$options = mergeOptions(vm.constructor.options, options);
    // 该方法可能会被子组件调用所以不能直接使用Vue.options进行合并
    // 所以要通过实例的

    callHook(vm, 'beforeCreate');

    // 初始化状态
    initState(vm);

    callHook(vm, 'created');

    // 如果传入了el属性 需要将页面渲染出来
    // 如果传入了el 就需要实现挂载流程
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    if (!options.render) {
      let template = options.template;

      if (!template && el) {
        template = el.outerHTML;
      }

      console.log(template);
      // 将template转成render
      const render = compileToFunction(template);
      options.render = render;
    }

    mountComponent(vm, el);
  }

  // 用户调用的nextTick
  Vue.prototype.$nextTick = nextTick;

}