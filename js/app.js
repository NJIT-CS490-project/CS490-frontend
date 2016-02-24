(function() {
  const toggleExclusiveClass = (predicate, element, successClass, failClass) => {
    if (prediacate === true) window.lib.element.replaceClass(element, failClass, successClass);
    else window.lib.element.replaceClass(element, successClass, failClass);
  }

  const form = document.getElementById('login');

  Array.from(form.querySelectorAll('input'))
  .forEach(element => {
    element.addEventListener('input', function() {
      window.lib.element.removeClass(element, 'empty-input');
    });
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const params = window.lib.form.getFormEntries(form);
    window.lib.form.filled(params)
      .then(params => {
        return window.lib.ajax.get('php/middle.php', params);
      })
      .then(response => console.log(response))
      .catch(err => {
        if (err.name !== 'FormValidationError') return err;
        Array.from(form.children)
          .filter(inputElement => !inputElement.textLength)
          .forEach(element => {
            element.className += ' empty-input';
          });
      });
  });
})();
