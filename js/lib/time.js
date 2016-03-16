(function() {
  window.lib = window.lib || {};
  window.lib.time = {};
  const exports = window.lib.time;

  exports.delay = (milliseconds) => {
    return (argument) => {
      return new Promise((fulfill) => {
        setInterval(() => {
          fulfill(argument);
        }, milliseconds);
      });
    };
  };
})();
