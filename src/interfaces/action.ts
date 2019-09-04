import { IMessage } from './message';
import { Client } from '../models';

export interface IAction {
  aliases?: string | string[];
  description?: string;
  hidden?: boolean;
  args?: string[];
  image?: string;
  argsParser?: (data: IActionData) => IActionArgsResolver | Promise<IActionArgsResolver>;
  onError?: (data: IActionData) => boolean | Promise<boolean>;
  onInvoke?: (data: IActionData) => any | Promise<any>;
}

export interface IActionData {
  args?: string[];
  action?: IAction;
  message?: IMessage;
  client?: Client;
  threadId?: string;
}

export interface IActionArgsResolver {
  args?: any[];
  error?: boolean;
}
