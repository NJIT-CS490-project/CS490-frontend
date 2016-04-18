{
  const Stream = window.lib.Stream;
  const validate = window.lib.validate;


  const hideModalForm = (container, form, submitButton) => {
    container.classList.add('hidden');
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
    cancel: document.getElementById('edit-cancel'),
    submit: document.getElementById('edit-submit'),
  };
  const formContainer = document.getElementById('modal-edit');
  const editEventForm = formContainer.getElementsByTagName('form')[0];

  const requiredFields = Array
    .from(editEventForm.getElementsByTagName('input'))
    .filter(element => element.required);

  const properties = {
    date: Stream.fromInput(document.getElementById('edit-date')),
    startTime: Stream.fromInput(document.getElementById('edit-start')),
    endTime: Stream.fromInput(document.getElementById('edit-end')),
    room: Stream.fromInput(document.getElementById('edit-room')),
    building: Stream.fromSelect(document.getElementById('edit-building')),
  };

  Stream
    .fromEvent(buttons.cancel, 'click')
    .subscribe(() => {
      hideModalForm(formContainer, editEventForm, buttons.submit);
    });

  fieldsFilled(requiredFields)
    .and(properties.building.map(value => value !== ''))
    .and(properties.date.map(validate.date))
    .and(properties.startTime.map(validate.time))
    .and(properties.endTime.map(validate.time))
    .merge(Stream.fromEvent(editEventForm, 'reset').map(() => false))
    .subscribe(allowSubmit => {
      buttons.submit.disabled = !allowSubmit;
    });
}
