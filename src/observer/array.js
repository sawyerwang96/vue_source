let arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);

let methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort'
];

methodsToPatch.forEach(method => {
  // AOP切片编程
  arrayMethods[method] = function (...args) {
    let result = arrayProto[method].apply(this, args);
    // this --> 数组
    // __ob__ --> Observer的实例
    let ob = this.__ob__;
    // push unshift 添加的元素是一个对象
    let inserted; // 当前用户插入的元素

    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
      default:
        break;
    }

    if (inserted) {
      ob.observerArray(inserted);
    }

    ob.dep.notify(); // 如果用户调用了push方法 我会通知当前这个dep去更新

    return result;
  }
});
