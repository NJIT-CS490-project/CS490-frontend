{
  const Stream = window.lib.Stream;
  const time = window.lib.time;
  const eventView = window.lib.views.event;

  const fromSearch = searchBar =>
    Stream
    .fromEvent(searchBar, 'input')
    .map(event => event.target.value)
    .debounce(500)
    .filter(x => x.length > 2);

  const deleteEvent = event => {
    const id = event.target.dataset.id;
    const requestOptions = { credentials: 'same-origin', method: 'DELETE' };

    return fetch(`php/middle.php?endpoint=delete.php&id=${id}`, requestOptions)
      .then(response => (response.statusText !== 'OK') ? Promise.reject(response.statusText) : '')
      .then(() => alert('Event successfully deleted!'))
      .catch(error => console.error(error));
  };

  const retrieveSelf = () =>
    fetch('php/middle.php?endpoint=self.php', { credentials: 'same-origin' })
    .then(response => (response.statusText === 'OK')
      ? response
      : Promise.reject(response.statusText))
    .then(response => response.json());


  const searchBar = document.getElementById('search');
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
        .then(events => {
          retrieveSelf()
            .then(self => events.map(event => eventView(event, self.id, self.admin)));
        })
        .then(newInnerHTML => {
          const main = document.getElementsByClassName('main')[0];
          main.innerHTML = newInnerHTML;
          return main;
        })
        .then(main => {
          const buttons = Array.from(main.querySelectorAll('[value="Delete"]'));
          buttons.forEach(button => button.addEventListener('click', deleteEvent));
        })
        .catch(error => console.error(error));
    });
}
