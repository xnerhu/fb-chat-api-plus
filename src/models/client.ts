import { EventEmitter } from 'events';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import fbLogin from 'facebook-chat-api';

import { ICredentials, IMessage, IOptions } from '../interfaces';

export declare interface Client { }

export class Client extends EventEmitter {
  private _api: any;

  private loggedIn = false;

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

  public login(credentials: ICredentials) {
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

  private _onMessage = (err: Error, message: IMessage) => {
    if (err) throw err;

    console.log(message);
  }
}
