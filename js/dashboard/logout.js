{
  const stream = window.lib.stream;
  const time = window.lib.time;

  const logoutButton = document.querySelector('[value="Logout"]');
  const logoutStream = stream.fromEvent(logoutButton, 'click');

  stream.subscribe(logoutStream, () => {
    const requestOptions = {
      method: 'PUT',
      credentials: 'same-origin',
    };

    const request = fetch('php/middle.php?endpoint=logout.php', requestOptions);
    Promise.race([request, time.timeout(5000, 'Logout timed out. (?)')])
      .then(response => (response.statusText === 'OK') ? Promise.resolve() : Promise.reject(response.statusText))
      .then(() => {
        document.cookie = 'PHPSESSID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      })
      .then(() => { window.location = 'index.html'; })
      .catch(error => console.error(error));
  });
}
