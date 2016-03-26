{
  window.lib = window.lib || {};
  window.lib.stream = {};
  const exports = window.lib.stream;

  const f = window.lib.f;

  exports.create = () => ({ value: exports, subscribers: [] });

  exports.pulse = (stream, value) => {
    stream.value = value;
    stream.subscribers.forEach(cb => cb(value));
    return stream;
  };

  exports.subscribe = (stream, cb) => {
    stream.subscribers.push(cb);
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

  exports.filter = (stream, predicate) => {
    const newStream = exports.create();
    exports.subscribe(stream, value => {
      if (predicate(value)) exports.pulse(newStream, value);
    });
    return newStream;
  };

  exports.debounce = (stream, wait) => {
    const newStream = exports.create();
    const debouncedPulse = f.debounce(exports.pulse, wait);
    exports.subscribe(stream, value => {
      debouncedPulse(newStream, value);
    });
    return newStream;
  };

  exports.reduce = (stream, initial, reducer) => {
    const newStream = exports.create();
    let accumulated = initial;
    exports.subscribe(stream, value => {
      accumulated = reducer(accumulated, value);
      exports.pulse(newStream, accumulated);
    });
    return newStream;
  };

  exports.value = stream => stream.value;

  exports.combine = (streamA, streamB, combiner) => {
    const newStream = exports.create();

    exports.subscribe(streamA, value => {
      const otherValue = exports.value(streamB);
      exports.pulse(newStream, combiner(value, otherValue));
    });
    exports.subscribe(streamB, value => {
      const otherValue = exports.value(streamA);
      exports.pulse(newStream, combiner(value, otherValue));
    });

    return newStream;
  };
}
