{
  const stream = window.lib.stream;
  const createSearchStream = searchBar => {
    const searchInput = stream.fromEvent(searchBar, 'input');
    const searchContents = stream.map(searchInput, x => x.target.value);
    const debouncedSearch = stream.debounce(searchContents, 500);
    return stream.filter(debouncedSearch, x => x.length > 2);
  };

  const searchBar = document.getElementById('search');
  const searchStream = createSearchStream(searchBar);
  stream.log(searchStream, 'Search Stream');
}
