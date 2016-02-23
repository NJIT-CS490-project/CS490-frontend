(function() {
  const form = document.getElementById("login");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const params = window.lib.form.getFormEntries(form);
    window.lib.ajax.get("php/middle.php", params)
    .then(response => console.log(response));
  });
})();
