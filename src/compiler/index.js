import { parseHTML } from "./parse-html.js";
import { generate } from './generate.js';

export function compileToFunction(template) {
  // 1、解析html字符串 将html转为ast
  let root = parseHTML(template);
  console.log('root--------', root);

  // 将ast生成最终的render函数 --> 字符串拼接(模板引擎)
  let code = generate(root);
  console.log(code);

  // <div id="app"><p>hello {{name}}</p> hello</div>
  // 核心思路：将模板转化成 下面的这段字符串
  // _c('div', {id: 'app}, _c('p', undefined, _v('hello' + s(name))), _v('hello'))

  let renderFn = new Function(`with(this) { console.log('with this', this); return ${code} }`);
  return renderFn;
}
