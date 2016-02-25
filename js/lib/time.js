(function() {
  window.lib = window.lib || {};
  window.lib.time = {};
  const root = window.lib.time;

  root.delay = (milliseconds) => {
    return (argument) => {
      return new Promise((fulfill) => {
        setInterval(() => {
          fulfill(argument);
        }, milliseconds);
      });
    };
  };
})();
