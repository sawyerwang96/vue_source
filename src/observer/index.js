import { isObject, def } from "../util/index.js";
import { arrayMethods } from './array.js';
import Dep from "./dep.js";

class Observer {
  constructor(value) {
    this.dep = new Dep(); // 给数组用的
    // vue如果数据嵌套层次过多 需要递归的去解析对象的属性

    // value.__ob__ = this;
    // __ob__ 描述对象已经被监控过了
    // Object.defineProperty(value, '__ob__', {
    //   value: this,
    //   enumerable: false, // 不可枚举 避免栈溢出
    //   writable: true,
    //   configurable: true
    // });
    def(value, '__ob__', this); // 给每个监控过的对象新增一个__ob__属性

    if (Array.isArray(value)) {
      // 数组并不会对索引进行观测
      value.__proto__ = arrayMethods;
      // 如果数组元素是对象再进行检测
      this.observerArray(value); // 递归了，但是没有收集依赖
    } else {
      this.walk(value); // 对对象进行观测
    }
  }

  observerArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }

  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value); // 定义响应式数据
    }
  }
}

function defineReactive(data, key, value) {
  let dep = new Dep(); // 这个dep是给对象属性使用的

  // value可能是个数组 也可能是对象 返回的结果是Observer的实例（当前这个value对应的observer）
  // 如果值还是对象 需要递归实现深度检测
  let childOb = observe(value);// 如果value是数组，拿到观测数组的observer实例

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 每个属性都对应着自己的watcher
      if (Dep.target) {
        // 如果当前有watcher
        dep.depend(); // 将watcher保存起来

        if (childOb) { // 数组的依赖收集
          childOb.dep.depend(); // 收集了数组的相关依赖

          // 如果数组中还有数组
          if (Array.isArray(value)) {
            dependArray(value); // 收集依赖
          }
        }
      }

      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      }
      console.log('change');
      observe(newValue);
      value = newValue;

      dep.notify(); // 通知依赖的watcher来进行一个更新操作
    }
  })
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i];

    // 数组中的数组的依赖收集
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}


// 把data中的所有属性 都是用Object.defineProperty重新定义 ES5
// Object.defineProperty() 不能兼容ie8及以下 vue2 无法兼容ie8版本
export function observe(data) {
  if (!isObject(data)) {
    return;
  }

  return new Observer(data);
}