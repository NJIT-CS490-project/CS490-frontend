{
  const getBuildings = window.lib.api.getBuildings;
  const optionListView = window.lib.views.optionList;

  const createDropdown = document.getElementById('create-building');
  const filterDropdown = document.getElementById('building');

  getBuildings()
    .then(optionListView)
    .then(htmlList => {
      createDropdown.innerHTML += htmlList;
      filterDropdown.innerHTML += htmlList;
    });
}
