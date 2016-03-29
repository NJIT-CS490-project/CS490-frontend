{
  const stream = window.lib.stream;
  const f = window.lib.f;
  const eventView = window.views.eventView;

  const createSearchStream = searchBar => {
    const searchInput = stream.fromEvent(searchBar, 'input');
    const searchContents = stream.map(searchInput, x => x.target.value);
    const debouncedSearch = stream.debounce(searchContents, 500);
    return stream.filter(debouncedSearch, x => x.length > 2);
  };

  const searchBar = document.getElementById('search');
  const searchStream = createSearchStream(searchBar);

  const main = document.getElementsByClassName('main')[0];
  stream.subscribe(searchStream, () => {
    main.innerHTML = '';

    const random = () => Math.floor(Math.random() * 25);

    const newInnerHTML = f
    .range(random())
    .map(() => eventView({}))
    .join('\n');

    main.innerHTML = newInnerHTML;
  });
}
