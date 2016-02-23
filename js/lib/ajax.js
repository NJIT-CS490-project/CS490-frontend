(function() {
  window.lib = window.lib || {};
  window.lib.ajax = {};
  var root = window.lib.ajax;

  var toParameterString = function(obj) {
    return Object.keys(obj)
      .reduce(function(prev, current) {
        return prev + current + '=' + obj[current] + '&';
      }, '?')
      .slice(0, -1);
  };

  root.get = function(url, params) {
    var parameterizedUrl = (params)
      ? url + toParameterString(params)
      : url;

    return new Promise(function(fulfill, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', parameterizedUrl, true);

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
})();
