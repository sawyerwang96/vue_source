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
  }
}

/**
 * 根据虚拟节点创建真实的节点
 * @param {*} vnode 
 * @returns 
 */
function createElm(vnode) {
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
    console.log(i);
    i(vnode);
  }

  // init方法执行完毕后
  if (vnode.componentInstance) {
    return true;
  }
}

function updateProperties(vnode) {
  // let newProps = vnode.data || {};
  let newProps = vnode.data; // 创建vnode的是由有给data默认值
  let el = vnode.el;

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