{
  window.lib = window.lib || {};
  window.lib.views = {};
  const exports = window.lib.views;

  exports.optionList = (list) => list.map(item => `<option>${item}</option>`).join('\n');

  exports.recommendedEvent = model => {
    const title = model.name || '';
    const date = model.date || '';
    const startTime = model.startTime || '';
    const endTime = model.endTime || '';
    const building = model.building || '';
    const room = model.room || '';
    return `
    <article class="recommended-event primary-bg-color secondary-color">
      <h4>${title}</h4>
      <p>${date} ${startTime} to ${endTime}</p>
      <p>${building} ${room}</p>
    </article>
    `;
  };

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
                             ? `<input data-id="${id}" type="button" value="Del" class="button delete-button secondary-color warning-bg-color"></input>`
                             : '';

    const favoriteButtonHTML = (model.isFavorite)
                               ? `<input data-id="${id}" type="button" value="Fav" class="button favorited-button secondary-color favorite-bg-color"></input>`
                               : `<input data-id="${id}" type="button" value="Fav" class="button not-favorited-button favorite-color secondary-bg-color"></input>`

    const sourceButtonHTML = (model.isNJIT)
                             ? `<input data-id="${id}" type="button" value="Njit" class="button secondary-color njit-bg-color"></input>`
                             : `<input data-id="${id}" type="button" value="Usr" class="button secondary-color primary-bg-color"></input>`

    const editButtonHTML = !model.isNJIT && (requesterID === ownerID) || isAdmin
                             ? `<input data-id="${id}" type="button" value="Edit" class="button edit-button secondary-color primary-bg-color"></input>`
                             : '';

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
            ${editButtonHTML}
            </section>
          </section>
      </article>
    `;
  };
}
