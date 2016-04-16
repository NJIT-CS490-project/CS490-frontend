{
  window.lib = window.lib || {};
  window.lib.api = {};


  const ifSuccessfulResponse = response => {
    if (response.ok) return Promise.resolve(response);
    return Promise.reject('Response code was not within 200-299 range');
  };

  const snagJSON = response => response.json();

  const objectToParams = object =>
    '?' + Object
      .keys(object)
      .filter(key => object[key] !== '')
      .map(key => `${key}=${encodeURIComponent(object[key])}`)
      .join('&');

  const exports = window.lib.api;

  exports.getBuildings = () => {
    const requestOptions = {
      method: 'GET',
    };

    return fetch('php/middle.php?endpoint=locations.php', requestOptions)
      .then(ifSuccessfulResponse)
      .then(snagJSON);
  };

  exports.deleteEvent = id => {
    const requestOptions = { credentials: 'same-origin', method: 'DELETE' };

    return fetch(`php/middle.php?endpoint=delete.php&id=${id}`, requestOptions)
      .then(ifSuccessfulResponse);
  };

  exports.getSelf = () =>
    fetch('php/middle.php?endpoint=self.php', { credentials: 'same-origin' })
    .then(ifSuccessfulResponse)
    .then(snagJSON);
}
