import { ReadStream, createReadStream } from 'fs';
import axios from 'axios';

import { IOptions, IMessage, IAction, IActionData } from '../interfaces';
import { parseRawText } from '../utils';
import { Wrapper } from './wrapper';

export class Client extends Wrapper {
  public actions: IAction[] = [];

  constructor(options?: IOptions, actions: IAction[] = []) {
    super({
      actionPrefix: '.',
      actionsPerPage: 10,
      ...options
    });

    this.actions = actions;
    this.addListener('message', this.onMessage);
  }

  public async sendImage(url: string, threadId: string) {
    let stream: ReadStream;

    if (url.startsWith('http') || url.startsWith('https')) {
      const res = await axios(url, {
        responseType: 'stream',
      });

      stream = res.data;
    } else {
      stream = createReadStream(url);
    }

    return await this.sendMessage({ attachment: stream }, threadId);
  }

  public async sendBigEmoji(emoji: string, threadId: string) {
    const url = await this.getEmojiUrl(emoji, 128, 1.5);
    await this.sendImage(url, threadId);
  };

  protected onMessage = async (message: IMessage, sendTypingIndicator = true) => {
    const { body, threadID } = message;
    const { actionPrefix } = this.options;
    const parsed = parseRawText(body, actionPrefix);
    if (!parsed) return;
    const action = this.getAction(parsed.name);
    if (!action) return;

    const end = sendTypingIndicator && this.sendTypingIndicator(threadID);
    const { argsParser, onError, image } = action;

    let args = parsed.args;
    let error = action.args && args && args.length < action.args.length;

    let data: IActionData = {
      client: this,
      message,
      action,
      threadId: threadID
    };

    if (argsParser) {
      const res = await argsParser({ args, ...data });

      error = res.error != null ? res.error : error;
      args = res.args;
    }

    data = { args, ...data };

    if (error) {
      let cancel = false;

      if (onError) {
        cancel = await onError(data);
      }

      if (!cancel) {
        await this.sendMissingArgs(action, args, threadID);
      }
    } else if (action.onInvoke) {
      await action.onInvoke(data)
    }

    if (image) {
      await this.sendImage(image, threadID);
    }

    if (sendTypingIndicator) end();
  }

  protected getAction(name: string) {
    return this.actions.find(({ aliases }) => {
      if (aliases instanceof Array) {
        return aliases.indexOf(name) !== -1;
      }
      return aliases === name;
    });
  }

  public async sendHelp(data: IMessage, page = 0) {
    const { threadID } = data;
    const { actionPrefix, actionsPerPage } = this.options;
    const pages = Math.ceil(this.actions.length / actionsPerPage);
    const start = page * actionsPerPage;
    const actions = this.actions.filter(r => !r.hidden).slice(start, start + actionsPerPage);
    if (!actions.length) return null;

    const footer = `---------------- 📄 (${page + 1}/${pages}) ----------------`;
    const dash = '-'.repeat(Math.floor((footer.length - 3) / 2));

    let str = `${dash} ⌨️ ${dash}\n\n`;

    for (const action of actions) {
      if (action.hidden) continue;

      const name = action.aliases instanceof Array ? action.aliases[0] : action.aliases;
      const description = action.description ? ` - ${action.description}` : '';

      str += '✏️ ' + actionPrefix + name + description;

      if (action.args) {
        str += `\n     • ${action.args.join(', ')}`;
      }

      str += '\n\n';
    }

    str += footer;

    return await this.sendMessage({ body: str }, threadID);
  }

  public async sendMissingArgs(action: IAction, args: string[], threadId: string) {
    const list = action.args.slice(args.length);
    const str = `Missing arguments:\n⚠️ ${list.join('\n⚠️ ')}`;

    return await this.sendMessage({ body: str }, threadId);
  }
}
