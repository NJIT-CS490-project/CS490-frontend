{
  window.lib = window.lib || {};
  window.lib.stream = {};
  const exports = window.lib.stream;

  exports.create = () => {
    const observers = [];

    const subscribe = cb => {
      observers.push(cb);
    };

    const pulse = value => {
      observers.forEach(cb => {
        cb(value);
      });
    };

    return { subscribe, pulse };
  };

  exports.map = (stream, transform) => {
    const newStream = exports.create();
    stream.subscribe((value) => {
      newStream.pulse(transform(value));
    });
    return newStream;
  };

  exports.fromEvent = (EventTarget, eventName) => {
    const stream = exports.create();
    EventTarget.addEventListener(eventName, stream.pulse);
    return stream;
  };
}
