{
  window.lib = window.lib || {};
  window.lib.views = {};
  const exports = window.lib.views;

  exports.optionList = (list) => list.map(item => `<option>${item}</option>`).join('\n');

  exports.event = (model, requesterID, isAdmin) => {
    const title = model.name || '';
    const date = model.date || '';
    const startTime = model.startTime || '';
    const endTime = model.endTime || '';
    const id = model.id;
    const ownerID = model.ownerID;
    const building = model.building || '';
    const room = model.room || '';
    const description = model.description || '';

    const deleteButtonHTML = !model.isNJIT && (requesterID === ownerID) || isAdmin
                             ? `<input data-id="${id}" type="button" value="Del" class="button secondary-color warning-bg-color"></input>`
                             : '';

    const favoriteButtonHTML = (model.isFavorite)
                               ? `<input data-id="${id}" type="button" value="Fav" class="button secondary-color favorite-bg-color"></input>`
                               : `<input data-id="${id}" type="button" value="Fav" class="button favorite-color secondary-bg-color"></input>`

    const sourceButtonHTML = (model.isNJIT)
                             ? `<input data-id="${id}" type="button" value="Njit" class="button secondary-color njit-bg-color"></input>`
                             : `<input data-id="${id}" type="button" value="Usr" class="button secondary-color primary-bg-color"></input>`

    return `
      <article class="event">
        <section class="header">
          <h3>${title}</h3>
          <h5>${date}</h5>
          <h5>${startTime} to ${endTime}</h5>
        </section>
          <section>
            <p class="location">${building}, Room ${room}</p>
            <p>${description}</p>
            <section class="buttons">
            ${deleteButtonHTML}
            ${favoriteButtonHTML}
            ${sourceButtonHTML}
            </section>
          </section>
      </article>
    `
  };
}
