{
  const Stream = window.lib.Stream;
  const f = window.lib.f;
  const time = window.lib.time;
  const api = window.lib.api;
  const validate = window.lib.validate;
  const eventView = window.lib.views.event;

  const fromSearch = searchBar =>
    Stream
    .fromEvent(searchBar, 'input')
    .map(event => event.target.value)
    .debounce(500)
    .filter(x => x.length > 2);

  const deleteHandler = event =>
    api.deleteEvent(event.target.dataset.id)
       .then(() => alert('Event successfully deleted'))
       .catch(() => alert('Could not delete event'));


  const elements = {
    order: document.getElementById('order'),
    sorting: document.getElementById('sorting'),
    search: document.getElementById('search'),
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    room: document.getElementById('room'),
    favorited: document.getElementById('favorited'),
    onlyNJIT: document.getElementById('onlyNJIT'),
    onlyUser: document.getElementById('onlyUser'),
    mine: document.getElementById('mine'),
  };


  fromSearch(elements.search)
    .map(search => ({ search }))
    .merge(Stream
           .fromSelect(elements.order)
           .map(order => ({ order })))
    .merge(Stream
           .fromSelect(elements.sorting)
           .map(sorting => ({ sorting })))
    .merge(Stream
           .fromInput(elements.startDate)
           .filter(date => date === '' || validate.date(date))
           .map(startDate => ({ startDate })))
    .merge(Stream
           .fromInput(elements.endDate)
           .filter(date => date === '' || validate.date(date))
           .map(endDate => ({ endDate })))
    .merge(Stream
           .fromInput(elements.startTime)
           .filter(date => date === '' || validate.time(date))
           .map(startDate => ({ startTime })))
    .merge(Stream
           .fromInput(elements.endTime)
           .filter(date => date === '' || validate.time(date))
           .map(endDate => ({ endTime })))
    .merge(Stream
           .fromInput(elements.room)
           .debounce(250)
           .map(room => ({ room })))
    .merge(Stream
           .fromCheckbox(elements.favorited)
           .map(favorited => ({ favorited })))
    .merge(Stream
           .fromCheckbox(elements.onlyNJIT)
           .map(onlyNJIT => ({ onlyNJIT })))
    .merge(Stream
           .fromCheckbox(elements.onlyUser)
           .map(onlyUser => ({ onlyUser })))
    .merge(Stream
           .fromCheckbox(elements.mine)
           .map(mine => ({ mine })))
    .reduce({}, f.assign)
    .log('filter object');


  fromSearch(searchBar)
    .subscribe(search => {
      const requestOptions = { credentials: 'same-origin' };
      const string = encodeURIComponent(search);
      const count = 30;
      const parallels = [
        fetch(`php/middle.php?endpoint=search.php&string=${string}&count=${count}`, requestOptions),
        time.timeout(5000, 'Search timed out.'),
      ];

      Promise.race(parallels)
        .then(response => (response.statusText === 'OK')
          ? response.json()
          : Promise.reject(response.statusText))
        .then(json => (json.message === 'Events found')
          ? json.events
          : Promise.reject(json.message))
        .then(events =>
          api.getSelf()
            .then(self => events.map(event => eventView(event, self.id, self.admin)))
            .catch(console.error))
        .then(newInnerHTML => {
          const main = document.getElementsByClassName('main')[0];
          main.innerHTML = newInnerHTML;
          return main;
        })
        .then(main => {
          const buttons = Array.from(main.querySelectorAll('[value="Delete"]'));
          buttons.forEach(button => button.addEventListener('click', deleteHandler));
        })
        .catch(error => console.error(error));
    });
}
