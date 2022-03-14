import { pushTarget, popTarget } from './dep.js';
import { queueWatcher } from './schedular.js';

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    this.id = id++; // wathcer的表标识

    this.getter = exprOrFn; // 将内部传过来的updateComponent 放到getter属性上

    this.depsId = new Set();
    this.deps = [];

    this.get(); // 调用get方法会让渲染watcher执行
  };

  get() {
    pushTarget(this); // 将watcher存起来  this--->watcher
    this.getter(); // 渲染watcher的执行
    popTarget(this); // 移除watcher
  }

  update() {
    // 等待着 一起更新 因为每次调用update的时候 都放入了watcher
    queueWatcher(this);
    // this.get();
  }

  run() {
    this.get();
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
