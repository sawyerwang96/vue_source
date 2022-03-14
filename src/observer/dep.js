let id = 0;
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // age: [watcher, watcher]
  }

  depend() { // 观察者模式
    // this.subs.push(Dep.target);

    // 让这个watcher 记住当前的dep
    // Dep.target ---> watcher
    // this ---> dep
    Dep.target.addDep(this);
  }

  notify() {
    this.subs.forEach(watcher => watcher.update());
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }
}

let stack = [];

/**
 * 将watcher保留
 * @param {*} watcher 
 */
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

/**
 * 将watcher移除
 */
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}