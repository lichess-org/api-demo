import { Ctrl } from './ctrl';
import { Stream } from './ndJsonStream';
import { formData } from './util';
import page from 'page';

export class SeekCtrl {
  constructor(readonly stream: Stream, readonly root: Ctrl) {
    this.awaitClose();
  }

  awaitClose = async () => {
    await this.stream.closePromise;
    if (this.root.page == 'seek') page('/');
  };

  onUnmount = () => this.stream.close();

  static make = async (config: any, root: Ctrl) => {
    const stream = await root.auth.openStream(
      '/api/board/seek',
      {
        method: 'post',
        body: formData(config),
      },
      _ => {}
    );
    return new SeekCtrl(stream, root);
  };
}
