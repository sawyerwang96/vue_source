import { nextTick } from '../util/next-tick.js';

let queue = [];
let has = {};

function flushSchedularQueue() {
  queue.forEach(watcher => watcher.run());
  queue = []; // 清空
  has = {}; // 清空
}

export function queueWatcher(watcher) {

  let id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;

    // 宏任务和微任务 vue里面使用Vue.nextTick
    // Vue.nextTick = promise / mutationObserver / setImmediate / setTimeout
    // setTimeout(flushSchedularQueue, 0);
    nextTick(flushSchedularQueue, 0);
  }
}
