(function() {
  window.lib = window.lib || {};
  window.lib.form = {};
  let root = window.lib.form;

  root.getFormEntries = form => {
    const formData = new FormData(form);
    let obj = {};
    for (let pair of formData.entries()) {
      obj[pair[0]] = pair[1];
    }
    return obj;
  };

  root.filled = obj => {
    return new Promise((fulfill, reject) => {
      const filled = Object.keys(obj)
      .map(key => obj[key])
      .every(value => value);

      if (filled) fulfill(obj);
      else reject(new Error('Form is not filled'));
    });
  };
})();
