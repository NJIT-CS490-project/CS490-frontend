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
})();
