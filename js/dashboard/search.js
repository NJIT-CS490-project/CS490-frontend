{
  const Stream = window.lib.Stream;
  const f = window.lib.f;
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

  const favoriteHandler = event =>
    api.postFavorite(event.target.dataset.id)
       .then(() => alert('Event favorited!'))
       .catch(() => alert('Could not favorite event'));


  const elements = {
    order: document.getElementById('order'),
    sorting: document.getElementById('sorting'),
    search: document.getElementById('search'),
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    room: document.getElementById('room'),
    building: document.getElementById('building'),
    favorited: document.getElementById('favorited'),
    onlyNJIT: document.getElementById('onlyNJIT'),
    onlyUser: document.getElementById('onlyUser'),
    mine: document.getElementById('mine'),
  };


  const filterStream = fromSearch(elements.search)
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
           .map(startTime => ({ startTime })))
    .merge(Stream
           .fromInput(elements.endTime)
           .filter(date => date === '' || validate.time(date))
           .map(endTime => ({ endTime })))
    .merge(Stream
           .fromInput(elements.room)
           .debounce(250)
           .map(room => ({ room })))
    .merge(Stream
           .fromSelect(elements.building)
           .map(building => ({ building })))
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


  filterStream
    .subscribe(filterObject => {
      api.getSearch(filterObject)
        .then(json => {
          if (json.message === 'Events found') return json.events;
          return Promise.reject(json.message);
        })
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
