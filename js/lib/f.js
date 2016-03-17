{
  window.lib = window.lib || {};
  window.lib.f = {};
  const exports = window.lib.f;

  exports.partial = (func, ...args) => func.bind(this, ...args);
}
