import { IProfile } from './profile';
import { IAttachment } from './attachment';

export interface IThread {
  threadID?: string;
  participantIDs?: string[];
  name?: string;
  nicknames?: { [key: string]: string };
  unreadCount?: number;
  messageCount?: number;
  imageSrc?: string;
  timestamp?: string;
  muteUntil?: string;
  isGroup?: boolean;
  isSubscribed?: boolean;
  folder?: 'INBOX' | 'ARCHIVED' | 'PENDING' | 'OTHER';
  isArchived?: boolean;
  customizationEnabled?: boolean;
  participantAddMode?: 'ADD';
  reactionsMuteMode?: 'REACTIONS_NOT_MUTED' | 'REACTIONS_MUTED';
  mentionsMuteMode?: 'MENTIONS_NOT_MUTED' | 'MENTIONS_MUTED';
  cannotReplyReason?: 'RECIPIENTS_NOT_LOADABLE' | 'BLOCKED';
  lastReadTimestamp?: string;
  snippetAttachments?: IAttachment[];
  snippetSender?: string;
  lastMessageTimestamp?: string;
  participants?: IProfile[];
  emoji?: string;
  color?: string;
  adminIDs?: { id: string }[];
}
