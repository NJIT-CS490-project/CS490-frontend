{
  window.lib = window.lib || {};
  window.lib.stream = {};
  const exports = window.lib.stream;

  exports.create = () => {
    const observers = [];

    const observe = cb => {
      observers.push(cb);
    };

    const update = value => {
      observers.forEach(cb => {
        cb(value);
      });
    };

    return { observe, update };
  };

  exports.map = (stream, transform) => {
    const newStream = exports.create();
    stream.observe((value) => {
      stream.update(transform(value));
    });
    return newStream;
  };
}
