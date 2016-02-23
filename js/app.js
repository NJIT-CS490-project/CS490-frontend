(function() {
  const form = document.getElementById("login");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const params = window.lib.form.getFormEntries(form);
    window.lib.form.filled(params)
      .then(params => {
        return window.lib.ajax.get('php/middle.php', params);
      })
      .then(response => console.log(response))
      .catch(err => console.dir(err));
  });
})();
