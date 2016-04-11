{
  const Stream = window.lib.Stream;
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

  const fieldsFilled = inputElements =>
    inputElements
    .map(element =>
      Stream
      .fromInput(element, 'input')
      .merge(Stream.poll(() => element.value, 2000))
      .map(string => string.length > 0))
    .reduce((previousStream, currentStream) => previousStream.and(currentStream));


  const buttons = {
    showNew: document.querySelector('[value="Create Event"]'),
    cancel: document.getElementById('create-cancel'),
    submit: document.getElementById('create-submit'),
  };
  const formContainer = document.getElementById('modal-create');
  const newEventForm = formContainer.getElementsByTagName('form')[0];

  Stream
    .fromEvent(buttons.showNew, 'click')
    .subscribe(() => showModalForm(formContainer, newEventForm, buttons.submit));

  Stream
    .fromEvent(buttons.cancel, 'click')
    .subscribe(() => hideModalForm(formContainer, newEventForm, buttons.submit));


  const requiredFields = Array
    .from(newEventForm.getElementsByTagName('input'))
    .filter(element => element.required);
  Stream
    .fromEvent(newEventForm, 'reset')
    .map(() => false)
    .merge(fieldsFilled(requiredFields))
    .subscribe(allowSubmit => {
      buttons.submit.disabled = !allowSubmit;
    });

  const properties = {
    title: Stream.fromInput(document.getElementById('create-title')),
    date: Stream.fromInput(document.getElementById('create-date')),
    startTime: Stream.fromInput(document.getElementById('create-start')),
    endTime: Stream.fromInput(document.getElementById('create-end')),
    place: Stream.fromInput(document.getElementById('create-place')),
  };
  Stream
    .fromEvent(buttons.submit, 'click')
    .subscribe(() => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          title: properties.title.get() || '',
          date: properties.date.get() || '',
          startTime: properties.startTime.get() || '',
          endTime: properties.endTime.get() || '',
          location: properties.location.get() || '',
        }),
        credentials: 'same-origin',
      };

      const parallels = [
        fetch('php/middle.php?endpoint=create.php', requestOptions),
        time.timeout(5000, 'Event creation request timed out'),
      ];

      Promise.race(parallels)
        .then(response => (response.statusText === 'OK')
          ? response.json()
          : Promise.reject(response.statusText))
        .then(json => (json.message === 'Valid login')
          ? Promise.resolve()
          : Promise.reject(json.message))
        .then(() => hideModalForm(formContainer, newEventForm, buttons.submit))
        .catch(error => alert(error));
    });
}
