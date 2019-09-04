import { EventEmitter } from 'events';
import { existsSync, readFileSync, writeFileSync, ReadStream } from 'fs';
import fbLogin from 'facebook-chat-api';

import { ICredentials, IMessage, IOptions, IProfile, IThread, IFolderType, IPicture, ISearchRes, IUserInfoRes } from '../interfaces';

export declare interface Client {
  on(event: 'message', listener: (message: IMessage) => void): this;
}

export class Client extends EventEmitter {
  private _api: any;

  public loggedIn = false;

  private options: IOptions;

  constructor(options?: IOptions) {
    super();

    if (options) {
      this.options = options;
    }
  }

  public setOptions(options: IOptions) {
    this.options = { ...this.options, ...options };
  }

  public login(credentials: ICredentials): Promise<void> {
    this.loggedIn = false;

    const { appState, appStatePath } = credentials;

    if (!appState && appStatePath && existsSync(appStatePath)) {
      credentials.appState = JSON.parse(readFileSync(credentials.appStatePath, 'utf8'));
    }

    return new Promise((resolve, reject) => {
      fbLogin(credentials, (err, api) => {
        if (err) reject(err);

        if (appStatePath) {
          writeFileSync(appStatePath, JSON.stringify(api.getAppState()), 'utf8');
        }

        this._api = api;
        this.loggedIn = true;

        api.listen(this._onMessage);

        resolve();
      });
    });
  }

  public addUserToGroup(userId: string, threadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.addUserToGroup(userId, threadId, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeAdminStatus(threadId: string, userId: string | string[], adminStatus: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeAdminStatus(threadId, userId, adminStatus, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeArchivedStatus(threadId: string | string[], archive: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeArchivedStatus(threadId, archive, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeBlockedStatus(userId: string, block: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeBlockedStatus(userId, block, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeGroupImage(stream: ReadStream, threadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeGroupImage(stream, threadId, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeNickname(nickname: string, threadId: string, participantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeNickname(nickname, threadId, participantId, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeThreadColor(color: string, threadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeThreadColor(color, threadId, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public changeThreadEmoji(emoji: string, threadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.changeThreadEmoji(emoji, threadId, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public createPoll(title: string, threadId: string, options?: { [key: string]: boolean }): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.createPoll(title, threadId, options, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public deleteMessage(message: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.deleteMessage(message, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public deleteThread(thread: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.deleteThread(thread, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public forwardAttachment(attachmentId: string, user: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.forwardAttachment(attachmentId, user, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public getAppState(): any[] {
    return this._api.getAppState();
  }

  public getCurrentUserID(): string {
    return this._api.getCurrentUserID();
  }

  public getEmojiUrl(emoji: string, size: 32 | 64 | 128, pixelRatio: 1 | 1.5): string {
    return this._api.getEmojiUrl(emoji, size, pixelRatio);
  }

  public getFriendsList(): Promise<IProfile[]> {
    return new Promise((resolve, reject) => {
      this._api.getFriendsList((err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  public getThreadHistory(threadId: string, amount = 20, timestamp?: number): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      this._api.getThreadHistory(threadId, amount, timestamp, (err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  public getThreadInfo(threadId: string): Promise<IThread> {
    return new Promise((resolve, reject) => {
      this._api.getThreadInfo(threadId, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }

  public getThreadList(limit: number, timestamp: string, tags: IFolderType[] = []): Promise<IThread[]> {
    return new Promise((resolve, reject) => {
      this._api.getThreadInfo(limit, timestamp, tags, (err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  public getThreadPictures(threadId: string, offset = 0, limit = 1): Promise<IPicture[]> {
    return new Promise((resolve, reject) => {
      this._api.getThreadPictures(threadId, offset, limit, (err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  public getUserID(name: string): Promise<ISearchRes[]> {
    return new Promise((resolve, reject) => {
      this._api.getUserID(name, (err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  public getUserInfo(id: string | string[]): Promise<IUserInfoRes> {
    return new Promise((resolve, reject) => {
      this._api.getUserInfo(id, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  private _onMessage = (err: Error, message: IMessage) => {
    if (err) return console.error(err);
    this.emit('message', message);
  }
}
