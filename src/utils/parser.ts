export const parseRawText = (text: string, prefix: string) => {
  if (!text.startsWith(prefix)) return null;

  let name: string;
  let args: string[] = [];

  let str = '';
  let quotes = false;

  for (let i = prefix.length; i < text.length; i++) {
    if (text[i] === '"') {
      quotes = !quotes;
    } else if (text[i] !== ' ' || quotes) {
      str += text[i];
    }

    if ((text[i] === ' ' && !quotes) || i === text.length - 1) {
      if (!name) name = str;
      else args.push(str);
      str = '';
    }
  }

  if (!name) return null;

  return { name: name.toLowerCase(), args };
};
