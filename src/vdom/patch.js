export function patch(oldVnode, vnode) {
  console.log('patch', oldVnode, vnode);
  // 递归创建真实dom 替换老的节点

  if (!oldVnode) {
    // 组件的挂载 vm.$mount()
    // 通过当前的虚拟节点 创建元素并返回
    return createElm(vnode);
  }

  // 是否是真实元素
  // new Vue的时候传递的el是选择器，el = querySelector(el);
  const isRealElement = oldVnode.nodeType;

  if (isRealElement) {
    const oldElm = oldVnode; // <div id="app">
    const parentElm = oldElm.parentNode; // <body>
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldElm);

    // 将渲染好的结果返回
    return el;
  } else {
    // diff算法特点：平级对比 我们正常操作dom，很少设计到父变成子或者子变成父 O(n^3)
    if (oldVnode.tag !== vnode.tag) {
      oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }

    if (!oldVnode.tag) { // 文本没有tag
      if (oldVnode.text !== vnode.text) {
        oldVnode.text = vnode.text; // 替换文本
      }
    }

    // 标签一致且不是文本(对比属性是否一致)
    // 使用旧的el，更新属性
    let el = vnode.el = oldVnode.el;
    updateProperties(vnode, oldVnode.data);

    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];

    if (oldChildren.length && newChildren.length) {
      // 新旧都有子节点
      updateChildren(el, oldChildren, newChildren);
    } else if (newChildren.length) {
      // 新的有子节点
      for (let i = 0 ; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElm(child));
      }
    } else if (oldChildren.length) {
      el.innerHTML = '';
    }
  }
}

/**
 * 根据虚拟节点创建真实的节点
 * @param {*} vnode 
 * @returns 
 */
export function createElm(vnode) {
  console.log('createElm', vnode);
  let { tag, children, key, data, text } = vnode;

  if (typeof tag === 'string') {
    // tag不是字符串的就是普通的html 或者是组件

    // 实例化组件
    if (createComponent(vnode)) {
      // 返回真实的dom
      return vnode.componentInstance.$el;
    }



    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    // 虚拟dom上映射中真实dom 方便后续操作
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

// 初始化的作用
function createComponent(vnode) {
  // 需要创建组件的实例

  let i = vnode.data;
  console.log(i);

  if ((i = i.hook) && (i = i.init)) {
    console.log(i); // 调用component的init方法
    i(vnode);
  }

  // init方法执行完毕后
  if (vnode.componentInstance) {
    return true;
  }
}

function updateChildren(parent, oldChildren, newChildren) {
  // 采用双指针

  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  // 在对比过程中，新老虚拟就节点只要有一方循环完毕就结束了（指针重合）
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 如果同一个节点 就需要对比这个元素的属性
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i < newEndIndex; i++) {
      // 新增子节点
      parent.appendChild(createElm(newChildren[i]));
    }
  }


}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) || (oldVnode.key === newVnode.key);
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {}; // 创建vnode的是由有给data默认值
  let el = vnode.el;

  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = '';
    }
  }

  // 旧的属性中有，新的属性中没有，将旧的属性从真实dom中删除
  for (let key in oldProps) {
    if (!newProps) {
      el.removeAttribute(key);
    }
  }

  for (let key in newProps) {
    if (key === 'style') {
      console.log('newProps', newProps.style);
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}