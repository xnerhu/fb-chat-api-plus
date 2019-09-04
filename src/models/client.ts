import { ReadStream, createReadStream } from 'fs';
import axios from 'axios';

import { Wrapper } from './wrapper';

export class Client extends Wrapper {
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

    await this.sendMessage({ attachment: stream }, threadId);
  }
}
