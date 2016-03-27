{
  const stream = window.lib.stream;
  const f = window.lib.f;

  const createEventButton = stream.fromEvent(document.querySelector('[value="Create Event"]'), 'click');
  const logoutButton = stream.fromEvent(document.querySelector('[value="Logout"]'), 'click');

  const searchInput = stream.fromEvent(document.getElementById('search'), 'input');
  const searchContents = stream.map(searchInput, x => x.target.value);
  const debouncedSearch = stream.debounce(searchContents, 500);
  const minimumLengthSearch = stream.filter(debouncedSearch, x => x.length > 2);
}
