{
  window.lib = window.lib || {};
  window.lib.f = {};
  const exports = window.lib.f;

  exports.partial = (func, ...args) => func.bind(this, ...args);

  exports.debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      const later = exports.partial(func, ...args);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  };

  exports.assign = (base, extension) => {
    Object.keys(extension)
    .forEach(key => {
      base[key] = extension[key];
    });
    return base;
  };

  exports.toKeys = (array, value) => {
    const obj = {};
    array.forEach(element => {
      obj[element] = value;
    });
    return obj;
  };

  exports.range = (end) => {
    const array = [];
    for (let index = 0; index < end; index++) {
      array.push(index);
    }
    return array;
  };
}
