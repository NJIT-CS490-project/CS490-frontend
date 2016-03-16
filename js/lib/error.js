(function() {
  window.lib = window.lib || {};
  window.lib.error = {};
  let exports = window.lib.error;

  exports.FormValidationError = function(message) {
    this.name = 'FormValidationError';
    this.message = message;
    this.stack = (new Error()).stack;
  };
  exports.FormValidationError.prototype = Object.create(Error.prototype);
  exports.FormValidationError.prototype.constructor = root.FormValidationError; 
})();
