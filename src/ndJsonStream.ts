// from https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e

type Handler = (line: any) => void;

export const readStream = (name: string, handler: Handler) => (response: Response) => {
  const stream = response.body!.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = '';

  const process = (json: string) => {
    const msg = JSON.parse(json);
    console.log(name, msg);
    handler(msg);
  };

  const loop: () => Promise<void> = () =>
    stream.read().then(({ done, value }) => {
      if (done) {
        if (buf.length > 0) return process(buf);
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop() || '';
        for (const i of parts.filter(p => p)) process(i);
        return loop();
      }
    });

  return loop();
};
