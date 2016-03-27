{
  const stream = window.lib.stream;

  const hideModalForm = (container, form, submitButton) => {
    container.classList.add('hidden');
    form.reset();
    submitButton.disabled = true;
  };

  const showModalForm = (container, form, submitButton) => {
    container.classList.remove('hidden');
    form.reset();
    submitButton.disabled = true;
  };

  const fieldsFilled = inputElements => {
    return inputElements
    .map(element => {
      const eventStream = stream.fromEvent(element, 'input');
      const contentStream = stream.map(eventStream, event => event.target.value);
      const pollStream = stream.poll(() => element.value, 2000);
      return stream.merge([contentStream, pollStream]);
    })
    .map(valueStream => stream.map(valueStream, string => string.length > 0))
    .reduce(stream.and);
  };

  const showNewEventButton = document.querySelector('[value="Create Event"]');
  const showNewEventStream = stream.fromEvent(showNewEventButton, 'click');

  const formContainer = document.getElementById('modal-create');
  const newEventForm = formContainer.getElementsByTagName('form')[0];

  const submitFormButton = document.getElementById('create-submit');
  const submitFormStream = stream.fromEvent(submitFormButton, 'click');

  const cancelFormButton = document.getElementById('create-cancel');
  const cancelFormStream = stream.fromEvent(cancelFormButton, 'click');

  const formResetStream = stream.map(stream.fromEvent(newEventForm, 'reset'), () => false);

  const requiredFields = [].slice
  .call(newEventForm.getElementsByTagName('input'))
  .filter(element => element.required);
  const fieldsFilledStream = fieldsFilled(requiredFields);

  stream.subscribe(showNewEventStream, () => {
    showModalForm(formContainer, newEventForm, submitFormButton);
  });

  stream.subscribe(stream.merge([cancelFormStream, submitFormStream]), () => {
    hideModalForm(formContainer, newEventForm, submitFormButton);
  });

  stream.subscribe(stream.merge([formResetStream, fieldsFilledStream]), allowSubmit => {
    submitFormButton.disabled = !allowSubmit;
  });
}
