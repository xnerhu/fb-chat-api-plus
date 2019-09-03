import { IAttachment } from './attachment';

export type IMessageType = 'message' | 'event' | 'typ' | 'read' | 'read_receipt' | 'message_reaction' | 'presence' | 'message_unsend' | 'message_reply';
export type ILogMessageType = 'log:subscribe' | 'log:unsubscribe' | 'log:thread-name' | 'log:thread-color' | 'log:thread-icon' | 'log:user-nickname';

export interface IMessage {
  type?: IMessageType;
  attachments?: IAttachment[];
  body?: string;
  isGroup?: boolean;
  mentions?: { [key: string]: string };
  messageID?: string;
  senderID?: string;
  threadID?: string;
  isUnread?: boolean;
  author?: string;
  logMessageBody?: string;
  logMessageData?: any;
  logMessageType?: ILogMessageType;
  from?: string;
  fromMobile?: boolean;
  isTyping?: boolean;
  time?: string;
  reader?: string;
  offlineThreadingID?: string;
  reaction?: string;
  timestamp?: string;
  userID?: string;
  statuses?: number;
  deletionTimestamp?: string;
  messageReply?: IMessage;
}
