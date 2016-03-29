{
  const stream = window.lib.stream;

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

  stream.log(passwordsMatch, 'Passwords Match');
  stream.log(allFilled, 'All Fields Filled');

  stream.subscribe(showButton, shouldEnable => {
    registerButton.disabled = !shouldEnable;
  });

}
