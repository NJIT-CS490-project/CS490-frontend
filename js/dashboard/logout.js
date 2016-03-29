{
  const stream = window.lib.stream;

  const logoutButton = document.querySelector('[value="Logout"]');
  const logoutStream = stream.fromEvent(logoutButton, 'click');
  stream.log(logoutStream, 'Logout Click Stream');

  stream.subscribe(logoutStream, () => {
    window.location = 'index.html';
  });
}
