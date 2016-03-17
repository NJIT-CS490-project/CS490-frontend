{
  window.lib = window.lib || {};
  window.lib.stream = {};
  const exports = window.lib.stream;

  const f = window.lib.f;

  exports.create = () => [];

  exports.pulse = (stream, value) => {
    stream.forEach(cb => cb(value));
    return stream;
  };

  exports.subscribe = (stream, cb) => {
    stream.push(cb);
    return stream;
  };

  exports.map = (stream, transform) => {
    const newStream = exports.create();
    const partialPulse = f.partial(exports.pulse, newStream);
    exports.subscribe(stream, value => partialPulse(transform(value)));
    return newStream;
  };

  exports.fromEvent = (EventTarget, eventName) => {
    const stream = exports.create();
    const partialPulse = f.partial(exports.pulse, stream);
    EventTarget.addEventListener(eventName, partialPulse);
    return stream;
  };

  exports.log = (stream, tag) => exports.subscribe(stream, value => {
    console.log({ tag, value });
  });

  exports.merge = (streams) => {
    const newStream = exports.create();
    const partialPulse = f.partial(exports.pulse, newStream);
    streams.forEach(stream => {
      exports.subscribe(stream, partialPulse);
    });
    return newStream;
  };
}
