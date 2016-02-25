(function() {
  const toggleExclusiveClass = (predicate, element, successClass, failClass) => {
    if (predicate === true) window.lib.element.replaceClass(element, failClass, successClass);
    else window.lib.element.replaceClass(element, successClass, failClass);
  };

  const form = document.getElementById('login');
  const njitSlider = document.getElementById('njitSlider');
  const backendSlider = document.getElementById('backendSlider');

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
      .then(response => JSON.parse(response))
      .then(responseObj => {
        toggleExclusiveClass(responseObj['njit'], njitSlider, 'bg-success', 'bg-failure');
        window.lib.element.removeClass(document.querySelector('.slider-left'), 'slider-left-hidden');

        toggleExclusiveClass(responseObj['db'], backendSlider, 'bg-success', 'bg-failure');
        window.lib.element.removeClass(document.querySelector('.slider-right'), 'slider-right-hidden');
      })
      .then(window.lib.time.delay(3000))
      .then(() => {
        window.lib.element.addClass(document.querySelector('.slider-left'), 'slider-left-hidden');
        window.lib.element.addClass(document.querySelector('.slider-right'), 'slider-right-hidden');
      })
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
