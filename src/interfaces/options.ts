export interface IOptions {
  logLevel?: 'silly' | 'verbose' | 'info' | 'http' | 'warn' | 'error' | 'silent';
  selfListen?: boolean;
  listenEvents?: boolean;
  pageID?: string;
  updatePresence?: boolean;
  forceLogin?: boolean;
  userAgent?: string;
  actionPrefix?: string;
  actionsPerPage?: number;
}
