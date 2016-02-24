(function() {
  window.lib = window.lib || {};
  window.lib.error = {};
  let root = window.lib.error;

  root.FormValidationError = function(message) {
    this.name = 'FormValidationError';
    this.message = message;
    this.stack = (new Error()).stack;
  };
  root.FormValidationError.prototype = Object.create(Error.prototype);
  root.FormValidationError.prototype.constructor = root.FormValidationError; 
})();
