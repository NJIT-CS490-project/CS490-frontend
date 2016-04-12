{
  const getBuildings = window.lib.api.getBuildings;
  const optionListView = window.lib.views.optionList;

  const dropdown = document.getElementById('create-building');

  getBuildings()
    .then(optionListView)
    .then(htmlList => {
      dropdown.innerHTML += htmlList;
    });
}
