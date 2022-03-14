import { isObject, isReservedTag } from "../util/index.js";

export function createElement(vm, tag, data = {}, ...children) {
  console.log('create-element.js---createElement---data', data);
  // ast ---> render ---> 调用
  let key = data.key;

  if (key) {
    delete data.key;
  }

  // 以前表示的是标签  现在是组件

  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined);
  } else {
    // 组件 找到组件的定义
    let Ctor = vm.$options.components[tag];
    
    return createComponent(vm, tag, data, key, children, Ctor);
  }

}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }

  data.hook = {
    init(vnode) { // 组件被创建的时候调用
      // 当前组件的实例 就是ComponentInstance
      let child = vnode.componentInstance = new Ctor({ _isComponent: true });

      // 创建一个实例完成后 会调用_init方法 没有$options.el 就不会挂载(不会调用$mount方法)
      // 需要调用$mount方法 $mount方法中会调用mountComponent
      // 每一个组件渲染都得过程中都会创建一个watcher（参数为updateComponent函数）
      // updateComponent _update(_render());
      // _update ---> vm.$el = patch(vm.$el, vnode);
      child.$mount(); // 组件的挂载 vm.$el
      // vm.$el就会空的
    }
  }

  // $vnode--->当前这个组件的vnode 占位符vnode
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, { Ctor, children });
}

export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}

// template ---> ast
// ast ---> render
// render ---> 虚拟dom
// 虚拟dom ---> 真实dom

// 重新生成虚拟dom ---> 更新dom
