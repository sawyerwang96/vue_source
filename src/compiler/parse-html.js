// ?: 匹配不捕获
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
// argument[0]:匹配到的结果(标签) argument[1]:匹配到的标签名 

const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"
// ^\s* 任意数量 \s 空格  <div id
// ([^\s"'<>\/=]+) 属性名限制 不能有空格 "'<>\/=
// (?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))) 不匹配
//    n个空白字符 = n个空白字符
// (?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))
//    "([^"]*)" ""中间只要不是双引号的
//    '([^']*)' ''中间不是单引号的
//    ([^\s"'=<>`]+) 没有单引号也没有双引号的
// ` aa='aa'` aa

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// {{ }}

// {{
//   aaa  
// }}



export function parseHTML(html) {
  let root = null;
  let currentParent;
  let stack = [];
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tagName, attrs) {
    // 遇到初始标签就创建一个ast元素
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element; //把当前的元素标记为父ast树
    stack.push(element); // 将开始标签存入栈中
  }

  function chars(text) {
    // console.log('text', text);
    text = text.replace(/\s/g, ''); // 去除所有空格

    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    // console.log('end', tagName);
    let element = stack.pop();

    // 在获取当前占中最后一个元素为当前元素的父亲
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  // 不停地解析HTML字符串
  while (html) {
    let textEnd = html.indexOf('<');

    if (textEnd === 0) {
      // < 的索引为0 肯定是一个标签 开始标签/结束标签

      // 获取匹配的结果 tagName、attrs
      let startTagMatch = parseStartTag();

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs); // 1.解析开始标签
        continue;
      }

      let endTagMatch = html.match(endTag);
      console.log('endTagMatch', endTagMatch);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]); // 2.解析结束标签
        continue;
      }
    }

    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd); // 获取开始位置到下一个标签的开始< 之间的内容
    }
    if (text) {
      advance(text.length);
      chars(text); // 3.解析文本标签
    }
  }

  // 匹配开始标签
  function parseStartTag() {
    let start = html.match(startTagOpen); // 匹配到就是一个开始标签
    if (start) {
      /**
        * <div id="app">
        *   <p>{{ name }}</p>
        *   <span>{{ age }}</span>
        * </div>
        */
      // ['<div', 'div', index: 0, input: '<div id="app">\n    <p>{{ name }}</p>\n    <span>{{ age }}</span>\n  </div>', groups: undefined]
      console.log(start);
      let match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      /**
        *  id="app">
        *   <p>{{ name }}</p>
        *   <span>{{ age }}</span>
        * </div>
        */

      let end, attr;
      // 不是开始标签的结束 并且 匹配到了属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 进行属性解析
        advance(attr[0].length); // 将属性去掉(attr[0].length 匹配到的属性结果)
        match.attrs.push({
          name: attr[1],
          // attr[2] --> =  
          // attr[3]/attr[4]属性分别用的是双引号和单引号 
          // attr[5]:id=xx类型的
          value: attr[3] || attr[4] || attr[5]
        })
      }

      if (end) {
        advance(end[0].length); // 去掉开始标签的 >
        return match;
      }

      console.log(match, html);
    }
  }

  function advance(n) {
    html = html.substring(n);
  }

  return root;
}
