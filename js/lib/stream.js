{
  window.lib = window.lib || {};
  window.lib.stream = {};
  const exports = window.lib.stream;

  const f = window.lib.f;

  /**
   * @sig [(a -> b)]
   */
  exports.create = () => [];

  /**
   * @sig [(a -> b)] -> a -> [(a -> b)]
   */
  exports.pulse = (stream, value) => {
    stream.forEach(cb => cb(value));
    return stream;
  };

  /**
   * @sig [(a -> b)] -> (a -> b) -> [(a -> b)]
   */
  exports.subscribe = (stream, cb) => {
    stream.push(cb);
    return stream;
  };

  /**
   * @sig [(a -> b)] -> (b -> c) -> [(b -> c)]
   */
  exports.map = (stream, transform) => {
    const newStream = exports.create();
    const partialPulse = f.partial(exports.pulse, newStream);
    exports.subscribe(stream, value => partialPulse(transform(value)));
    return newStream;
  };

  /**
   * @sig EventTarget a => String b => a -> b -> [(c -> d)]
   */
  exports.fromEvent = (EventTarget, eventName) => {
    const stream = exports.create();
    const partialPulse = f.partial(exports.pulse, stream);
    EventTarget.addEventListener(eventName, partialPulse);
    return stream;
  };

  /**
   * @sig String a => [(b -> c)] -> a -> [(b -> c)]
   */
  exports.log = (stream, tag) => exports.subscribe(stream, value => {
    console.log({ tag, value });
  });

  /**
   * @sig [[(a -> b)]] -> [(a -> b)]
   */
  exports.merge = (streams) => {
    const newStream = exports.create();
    const partialPulse = f.partial(exports.pulse, newStream);
    streams.forEach(stream => {
      exports.subscribe(stream, partialPulse);
    });
    return newStream;
  };

  /**
   * @sig Bool a => [(b -> c)] -> (* -> a) -> [(b -> c)]
   */
  exports.filter = (stream, predicate) => {
    const newStream = exports.create();
    exports.subscribe(stream, value => {
      if (predicate(value)) exports.pulse(newStream, value);
    });
    return newStream;
  };

  exports.debounce = (stream, wait) => {
    const identity = x => x;
    const debounceIdentity = f.debounce(identity, wait);
    return exports.map(stream, debounceIdentity);
  }
}
