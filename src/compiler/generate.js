const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];

    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
      console.log('genProps-------', obj);
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  let children = el.children;
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`;
  }
  return false;
}

function gen(node) {
  if (node.type === 1) {
    return generate(node);
  } else {
    let text = node.text; // a {{ name }} b {{ age }} c
    // if (!defaultTagRE.test(text)) {
    //   return `_v(${JSON.stringify(text)})`;
    // }
    let tokens = [];
    let match, index;
    let lastIndex = defaultTagRE.lastIndex = 0;

    while(match = defaultTagRE.exec(text)) {
      index = match.index;
      console.log('-----', {index, lastIndex});
      if (index > lastIndex) {
        console.log('enter', match);
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    console.log('///////', tokens);
    return `_v(${tokens.join('+')})`
  }
}

export function generate(el) {
  const children = genChildren(el);

  // 标签名 属性 后代
  let code = `_c(
      '${el.tag}',
      ${el.attrs.length ? genProps(el.attrs) : 'undefined'}
      ${ children ? `,${children}` : ''}
    )
  `;

  return code;
}