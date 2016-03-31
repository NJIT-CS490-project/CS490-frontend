{
  const stream = window.lib.stream;
  const time = window.lib.time;

  const allFilledStream = inputElements => {
    return inputElements
      .map(inputElement => stream.fromEvent(inputElement, 'input'))
      .map(inputStream => stream.map(inputStream, event => event.target.value))
      .map(textStream => stream.map(textStream, text => text.length > 0))
      .reduce(stream.and);
  };

  const loginForm = document.getElementById('login');
  const usernameInput = loginForm.querySelector('[type="text"]');
  const passwordInput = loginForm.querySelector('[type="password"]');
  const loginButton = loginForm.querySelector('[type="button"]');

  const loginFilled = allFilledStream([usernameInput, passwordInput]);
  stream.subscribe(loginFilled, isFilled => {
    loginButton.disabled = !isFilled;
  });

  const usernameProperty = stream.map(stream.fromEvent(usernameInput, 'input'), event => event.target.value);
  const passwordProperty = stream.map(stream.fromEvent(passwordInput, 'input'), event => event.target.value);

  const loginButtonStream = stream.fromEvent(loginButton, 'click');
  stream.subscribe(loginButtonStream, () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: stream.value(usernameProperty),
        password: stream.value(passwordProperty),
      }),
    };

    const request = fetch('php/middle.php?endpoint=login.php', requestOptions);
    Promise.race([request, time.timeout(5000, 'Login timed out')])
      .then(response => (response.statusText === 'OK') ? response.json() : Promise.reject(response.statusText))
      .then(json => (json.message === "Valid login") ? Promise.resolve() : Promise.reject(json.message))
      .then(() => {
        window.location = 'dashboard.html';
      })
      .catch(error => alert(error));
  });
}
