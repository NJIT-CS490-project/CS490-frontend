(function() {
  window.ajax = window.ajax || {};
  var root = window.ajax;

  root.get = function(url) {
    return new Promise(function(fulfill, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.addEventListener('load', function() {
        if (request.status < 400) {
          fulfill(request.responseText);
        } else {
          reject(new Error('Request could not be completed: ' + request.statusText));
        }
      });

      request.addEventListener('error', function() {
        reject(new Error('No network detected: ' + request.statusText));
      });

      request.send(null);
    });
  };
});
