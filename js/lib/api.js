{
  window.lib = window.lib || {};
  window.lib.api = {};

  const ifSuccessfulResponse = response => {
    if (response.ok) Promise.resolve(response);
    Promise.reject('Response code was not within 200-299 range');
  };

  const snagJSON = response => response.json();


  const exports = window.lib.api;

  exports.getBuildings = () => {
    const requestOptions = {
      method: 'GET',
    };

    return fetch('php/middle.php?endpoint=locations.php', requestOptions)
      .then(ifSuccessfulResponse)
      .then(snagJSON);
  };
}
