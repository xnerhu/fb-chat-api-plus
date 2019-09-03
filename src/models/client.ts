import { EventEmitter } from 'events';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import fbLogin from 'facebook-chat-api';

import { ICredentials } from '../interfaces';

export declare interface Client { }

export class Client extends EventEmitter {
  private api: any;

  private loggedIn = false;

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

        this.api = api;
        this.loggedIn = true;

        resolve();
      });
    });
  }
}
