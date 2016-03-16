(function() {
  window.lib = window.lib || {};
  window.lib.form = {};
  let exports = window.lib.form;

  exports.getFormEntries = form => {
    const formData = new FormData(form);
    let obj = {};
    for (let pair of formData.entries()) {
      obj[pair[0]] = pair[1];
    }
    return obj;
  };

  exports.filled = obj => {
    return new Promise((fulfill, reject) => {
      const filled = Object.keys(obj)
      .map(key => obj[key])
      .every(value => value);

      if (filled) fulfill(obj);
      else reject(new window.lib.error.FormValidationError('Form is not filled'));
    });
  };
})();
