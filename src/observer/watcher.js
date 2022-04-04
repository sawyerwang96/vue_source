import { pushTarget, popTarget } from './dep.js';
import { queueWatcher } from './schedular.js';

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    this.user = options.user; // 标识watcher的状态
    this.sync = option.sync; // 用户watcher是否是同步执行(sync: true)
    this.id = id++; // wathcer的表标识

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn; // 将内部传过来的updateComponent 放到getter属性上
    } else {
      // 将getter封装成取值函数
      this.getter = function () {
        let path = exprOrFn.split('.');
        let val = vm;
        for (let i = path; i < path.length; i++) {
          val = vm[path[i]]
        }
        return val
      };
    }


    this.depsId = new Set();
    this.deps = [];

    this.value = this.get(); // 调用get方法会让渲染watcher执行(保存当前的值)
  };

  get() {
    pushTarget(this); // 将watcher存起来  this--->watcher
    let value = this.getter.call(this.vm); // 渲染watcher的执行
    popTarget(this); // 移除watcher
    return value;
  }

  update() {
    if (this.sync) {
      this.run();
    } else {
      // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
      queueWatcher(this);
      // this.get();
    }
  }

  run() {
    let oldValue = this.value;
    let newValue = this.get();
    this.value = newValue;

    if (this.user) {
      // 如果当前是用户watcher 就执行用户定义的callback
      this.callback.call(this.vm, newValue, oldValue);
    }
  }

  addDep(dep) {
    // watcher不能重复存放同一个dep 
    // dep里不能重复存放同一个watcher
    let id = dep.id;

    if(!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this); // 将watcher加入到dep中
    }
  }
}

export default Watcher;
