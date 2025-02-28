import van from "vanjs-core";

export function Dbounce(func, delay) {
  let timeout;
  return function() {
    const context = this,
    args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export function throttle(functN, Dlay) {
  let pre = 0;
  return function() {
    if (Date.now() - pre > Dlay) {
      pre = Date.now();
      return functN.apply(this, arguments);
    } 
  }
}

export function htm(content,nomer,attr) {
  const args = [];
  if (attr) args[0] = attr;
  if (!nomer) nomer = "span";
  if (Array.isArray(content)) {
    let itR8 = content.length,
    nth = itR8;
    for (;itR8;--itR8) {
      args.push(content[nth - itR8]);
    }
  }
  else args.push(content);
  return van.tags[nomer].apply(null,args);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}