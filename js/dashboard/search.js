{
  const stream = window.lib.stream;
  const f = window.lib.f;
  const time = window.lib.time;
  const eventView = window.views.eventView;

  const createSearchStream = searchBar => {
    const searchInput = stream.fromEvent(searchBar, 'input');
    const searchContents = stream.map(searchInput, x => x.target.value);
    const debouncedSearch = stream.debounce(searchContents, 500);
    return stream.filter(debouncedSearch, x => x.length > 2);
  };

  const deleteEvent = event => {
    const id = event.target['data-id'];
    return fetch(`php/middle.php?endpoint=delete.php&id=${id}`)
      .then
      .then(response => (response.statusText === 'OK') ? response.json() : Promise.reject(response.statusText))
      .then(() => alert('Event successfully deleted!'))
      .catch(error => alert(error));
  };

  const searchBar = document.getElementById('search');
  const searchStream = createSearchStream(searchBar);

  const main = document.getElementsByClassName('main')[0];
  stream.subscribe(searchStream, search => {
    console.log(search);
    const string = encodeURIComponent(search);
    const count = 30;
    const request = fetch(`php/middle.php?endpoint=search.php&string=${string}&count=${count}`);
    Promise.race([request, time.timeout(5000, 'Search timed out.')])
      .then(response => (response.statusText === 'OK') ? response.json() : Promise.reject(response.statusText))
      .then(json => {
        return fetch('php/middle.php?endpoint=self.php')
          .then(response => response.json())
          .then(self => json.map(event => eventView(event, self.username, self.admin)));
      })
      .then(newInnerHTML => {
        main.innerHTML = newInnerHTML;
        return main;
      })
      .then(main => {
        const buttons = main.querySelectorAll('[value="Delete"]');
        buttons.forEach(button => button.addEventListener('click', deleteEvent));
      })
      .catch(error => console.error(error));
  });
}
