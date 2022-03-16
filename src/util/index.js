const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'update',
  'beforeDestroy',
  'destroyed'
];

let strats = {};
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

function mergeHook(parentVal, childVal) {
  if (childVal) { // 有新值
    // if (parentVal) { // 有新值也有旧值
    //   return parentVal.concat(childVal);
    // } else { // 只有新值
    //   return [childVal];
    // }
    return parentVal ? parentVal.concat(childVal) : [childVal];
  } else { // 直接返回旧值
    return parentVal;
  }
}

/**
 * 当前数据是不是对象
 * @param {*} data 
 * @returns Boolean 
 */
export function isObject(data) {
  return data !== null && typeof data === 'object';
}

/**
 * 定义响应式
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  });
}

/**
 * 代理
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      if (newValue === vm[source][key]) {
        return;
      }
      vm[source][key] = newValue;
    }
  })
}

/**
 * 组件合并策略
 * @param {*} parentVal 
 * @param {*} childVal 
 * @returns 
 */
function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal); // res.__proto__ === parentVal
  
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key];
    }
  }

  return res;
}
strats.components = mergeAssets;


export function mergeOptions(parent, child) {
  const options = {};

  for (let key in parent) {
    mergeField(key);
  }

  for (let key in child) { // 如果已经合并过了，就不需要再合并了
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  // 默认合并策略
  // 有些属性需要有特殊的合并方式，比如生命周期的合并
  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key]);
    }

    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      };
    } else if (child[key] == null) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }

  return options;
}

export const isReservedTag = tagName => {
  let obj = {};
  let str = 'p,div,span,input,button';
  str.split(',').forEach(tag => {
    obj[tag] = true;
  });
  return obj[tagName];
};