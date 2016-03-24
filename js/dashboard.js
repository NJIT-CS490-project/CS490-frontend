{
  const stream = window.lib.stream;
  const f = window.lib.f;

  const createEventButton = stream.fromEvent(document.querySelector('[value="Create Event"]'), 'click');
  const logoutButton = stream.fromEvent(document.querySelector('[value="Logout"]'), 'click');

  const searchInput = stream.fromEvent(document.getElementById('search'), 'input');
  const searchContents = stream.map(searchInput, x => x.target.value);
  const longSearchContents = stream.filter(searchContents, x => x.length > 2);
  const debouncedLongSearchContents = stream.debounce(longSearchContents, 500);
  stream.log(debouncedLongSearchContents, 'contents');
}
