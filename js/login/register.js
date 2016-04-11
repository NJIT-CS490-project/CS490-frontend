{
  const Stream = window.lib.Stream;
  const time = window.lib.time;


  const fieldsMatch = fields => {
    const combiner = (a, b) => a === b;
    return fields
    .map(field => Stream.fromInput(field, 'input'))
    .reduce((previous, current) => previous.combine(current, combiner));
  };

  const fieldsFilled = fields => {
    const reducer = (a, b) => a && b;

    return fields
    .map(field => Stream.fromInput(field, 'input'))
    .map(textStream => textStream.map(text => text.length > 0))
    .reduce(reducer);
  };

  const ifValidResponse = response => {
    if (response.statusText === 'OK') return response;
    return Promise.reject(response.statusText);
  };

  const parseResponseJSON = response => response.json();

  const ifAccountCreated = json => {
    if (json.message === 'Properly created account') return Promise.resolve();
    return Promise.reject(json.message);
  };


  const registerForm = document.getElementById('register');
  const passwordFields = registerForm.querySelectorAll('[type="password"]');
  const passwordInput = passwordFields[0];
  const confirmPasswordInput = passwordFields[1];
  const usernameInput = registerForm.querySelector('[type="text"]');
  const registerButton = registerForm.querySelector('[type="button"]');

  fieldsMatch([passwordInput, confirmPasswordInput])
  .and(fieldsFilled([passwordInput, confirmPasswordInput, usernameInput]))
  .subscribe(shouldEnable => {
    registerButton.disabled = !shouldEnable;
  });

  const usernameProperty = Stream.fromInput(usernameInput);

  const passwordProperty = Stream.fromInput(passwordInput)

  Stream
  .fromEvent(registerButton, 'click')
  .debounce(250)
  .subscribe(() => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: usernameProperty.get(),
        password: passwordProperty.get(),
      }),
    };

    const parallels = [
      fetch('php/middle.php?endpoint=register.php', requestOptions),
      time.timeout(5000, 'Registration timed out'),
    ];

    Promise.race(parallels)
    .then(ifValidResponse)
    .then(parseResponseJSON)
    .then(ifAccountCreated)
    .then(() => alert('Account successfully created!'))
    .catch(error => alert(error));
  });
}
