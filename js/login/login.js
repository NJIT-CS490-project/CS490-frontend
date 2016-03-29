{
  const stream = window.lib.stream;

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

  const loginButtonStream = stream.fromEvent(loginButton, 'click');
  stream.map(stream.debounce(loginButtonStream, 1000), () => {
    window.location = 'dashboard.html';
  });
}
