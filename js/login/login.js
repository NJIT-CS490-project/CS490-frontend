{
  const Stream = window.lib.Stream;
  const time = window.lib.time;

  const allFieldsFilled = inputElements => {
    const reducer = (previous, current) => previous.and(current);

    return inputElements
    .map(inputElement => Stream.fromEvent(inputElement, 'input'))
    .map(inputStream => inputStream.map(event => event.target.value))
    .map(textStream => textStream.map(text => text.length > 0))
    .reduce(reducer);
  };

  const loginForm = document.getElementById('login');
  const usernameInput = loginForm.querySelector('[type="text"]');
  const passwordInput = loginForm.querySelector('[type="password"]');
  const loginButton = loginForm.getElementById('login-button');
  const guestButton = loginForm.getElementById('guest-button');

  allFieldsFilled([usernameInput, passwordInput])
  .subscribe(allFilled => {
    loginButton.disabled = !allFilled;
  });

  const usernameProperty = Stream
  .fromEvent(usernameInput, 'input')
  .map(event => event.target.value);

  const passwordProperty = Stream
  .fromEvent(passwordInput, 'input')
  .map(event => event.target.value);

  Stream
  .fromEvent(loginButton, 'click')
  .subscribe(() => {
    const requestOptions = {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        username: usernameProperty.get(),
        password: passwordProperty.get(),
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const parallels = [
      fetch('php/middle.php?endpoint=login.php', requestOptions),
      time.timeout(5000, 'Login timed out'),
    ];

    Promise.race(parallels)
    .then(response => {
      if (response.statusText === 'OK') return response.json();
      return Promise.reject(response.statusText);
    })
    .then(json => {
      if (json.message === 'Valid login') return Promise.resolve();
      return Promise.reject(json.message);
    })
    .then(() => {
      window.location = 'dashboard.html';
    })
    .catch(error => alert(error));
  });
}
