{
  const stream = window.lib.stream;
  const time = window.lib.time;


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

  const inputToStream = inputElement => stream.map(stream.fromEvent(inputElement, 'input'),
                                                   event => event.target.value);


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

  const titleField = document.getElementById('create-title');
  const titleProperty = inputToStream(titleField);

  const descriptionField = document.getElementById('create-description');
  const descriptionProperty = inputToStream(descriptionField);

  const dateField = document.getElementById('create-date');
  const dateProperty = inputToStream(dateField);

  const startTimeField = document.getElementById('create-start');
  const startTimeProperty = inputToStream(startTimeField);

  const endTimeField = document.getElementById('create-end');
  const endTimeProperty = inputToStream(endTimeField);

  const placeField = document.getElementById('create-place');
  const placeProperty = inputToStream(placeField);


  stream.subscribe(showNewEventStream, () => {
    showModalForm(formContainer, newEventForm, submitFormButton);
  });

  stream.subscribe(cancelFormStream, () => {
    hideModalForm(formContainer, newEventForm, submitFormButton);
  });

  stream.subscribe(stream.merge([formResetStream, fieldsFilledStream]), allowSubmit => {
    submitFormButton.disabled = !allowSubmit;
  });

  stream.subscribe(submitFormStream, () => {
    const title = stream.value(titleProperty);
    const description = stream.value(descriptionProperty) || '';
    const date = stream.value(dateProperty);
    const startTime = stream.value(startTimeProperty) || '';
    const endTime = stream.value(endTimeProperty) || '';
    const location = stream.value(placeProperty);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ title, description, date, startTime, endTime, location }),
    };

    const request = fetch('php/middle.php?endpoint=create.php', requestOptions);
    Promise.race([request, time.timeout(5000, 'Event creation request timed out')])
      .then(response => (response.statusText === 'OK') ? response.json() : Promise.reject(response.statusText))
      .then(json => (json.message === "Valid login") ? Promise.resolve() : Promise.reject(json.message))
      .then(() => {
        hideModalForm(formContainer, newEventForm, submitFormButton);
      })
      .catch(error => alert(error));
  });
}
