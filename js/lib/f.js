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
}
