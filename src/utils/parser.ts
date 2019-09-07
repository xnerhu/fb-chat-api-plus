export const parseActionName = (text: string, prefix: string) => {
  if (!text.startsWith(prefix)) return null;

  let str = '';

  for (let i = prefix.length; i < text.length; i++) {
    str += text[i];

    if (text[i] === '"' || text[i] === ' ' || text[i] === '\n') {
      return str.slice(0, -1);
    } else if (i === text.length - 1) {
      return str;
    }
  }

  return null;
}

export const parseActionArgs = (text: string, offset: number, argsLength: number) => {
  if (argsLength === 1) {
    const arg = text.slice(offset);
    return arg !== '' ? [arg] : [];
  }

  let args: string[] = [];

  let str = '';
  let quotes = false;

  for (let i = offset; i < text.length; i++) {
    if (text[i] === '"') {
      quotes = !quotes;
    } else if (text[i] !== ' ' || quotes) {
      str += text[i];
    }

    if ((text[i] === ' ' && !quotes) || i === text.length - 1) {
      args.push(str);
      str = '';
    }
  }

  return args;
}
