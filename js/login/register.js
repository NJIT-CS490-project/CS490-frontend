{
  const stream = window.lib.stream;
  const time = window.lib.time;

  const fieldsMatch = fields => {
    return fields
      .map(field => stream.fromEvent(field, 'input'))
      .map(eventStream => stream.map(eventStream, event => event.target.value))
      .reduce((previousStream, newStream) => stream.combine(previousStream, newStream, (a, b) => a === b));
  };

  const fieldsFilled = fields => {
    return fields
      .map(field => stream.fromEvent(field, 'input'))
      .map(eventStream => stream.map(eventStream, event => event.target.value))
      .map(textStream => stream.map(textStream, text => text.length > 0))
      .reduce(stream.and);
  };

  const registerForm = document.getElementById('register');
  const registerButton = registerForm.querySelector('[type="button"]');
  const usernameInput = registerForm.querySelector('[type="text"]');
  const passwordFields = registerForm.querySelectorAll('[type="password"]');
  const passwordInput = passwordFields[0];
  const confirmPasswordInput = passwordFields[1];

  const passwordsMatch = fieldsMatch([passwordInput, confirmPasswordInput]);
  const allFilled = fieldsFilled([passwordInput, confirmPasswordInput, usernameInput]);
  const showButton = stream.and(passwordsMatch, allFilled);
  stream.subscribe(showButton, shouldEnable => {
    registerButton.disabled = !shouldEnable;
  });

  const usernameProperty = stream.map(stream.fromEvent(usernameInput, 'input'), event => event.target.value);
  const passwordProperty = stream.map(stream.fromEvent(passwordInput, 'input'), event => event.target.value);
  const registerClick = stream.fromEvent(registerButton, 'click');
  stream.subscribe(stream.debounce(registerClick, 250), () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: stream.value(usernameProperty),
        password: stream.value(passwordProperty),
      }),
    };

    const request = fetch('php/middle.php?endpoint=create.php', requestOptions);
    Promise.race([request, time.timeout(5000, 'Registration timed out')])
      .then(response => (response.statusText === 'OK') ? response.json() : Promise.reject(response.statusText))
      .then(json => (json.message === 'Successfully created user') ? Promise.resolve() : Promise.reject(json.message))
      .then(() => alert('Account successfully created!'))
      .catch(error => alert(error));
  });
}
