{
  window.lib = window.lib || {};
  window.lib.time = {};
  const exports = window.lib.time;

  exports.delay = (milliseconds) => (argument) => new Promise(fulfill => {
    setInterval(fulfill.bind(undefined, argument), milliseconds);
  });
}
