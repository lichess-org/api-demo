import { Ctrl } from './ctrl';
import { Stream } from './ndJsonStream';
import { formData } from './util';
import page from 'page';

export default class ChallengeCtrl {
  constructor(readonly stream: Stream, readonly root: Ctrl) {
    this.awaitClose();
  }

  awaitClose = async () => {
    await this.stream.closePromise;
    if (this.root.page == 'challenge') page('/');
  };

  onUnmount = () => this.stream.close();

  static make = async (config: any, root: Ctrl) => {
    const stream = await root.auth.openStream(
      `/api/challenge/${config.username}`,
      {
        method: 'post',
        body: formData({
          ...config,
          keepAliveStream: true,
        }),
      },
      _ => {}
    );
    return new ChallengeCtrl(stream, root);
  };
}
