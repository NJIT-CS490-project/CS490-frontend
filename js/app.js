(function() {
  const form = document.getElementById('login');
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
          .map(element => {
            element.className = element.className.replace('empty-input', '');
            return element;
          })
          .filter(inputElement => !inputElement.textLength)
          .forEach(element => {
            element.className += ' empty-input';
          });
      });
  });
})();
