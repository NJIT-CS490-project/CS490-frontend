{
  window.views = window.views || {};
  const exports = window.views;

  exports.eventView = (model, requesterID, isAdmin) => {
    const title = model.name || '';
    const date = model.date || '';
    const startTime = model.start || '';
    const endTime = model.end || '';
    const location = model.location || '';
    const id = model.id;
    const ownerID = model.ownerID;

    const deleteButtonHTML = ((requesterID === ownerID) || isAdmin)
                             ? `<input data-id="${id}" type="button" value="Delete" class="button secondary-color warning-bg-color"></input>`
                             : '';

    return `
      <article class="event">
        <img src="images/event.png"></img>
        <section>
          <h1>${title}</h1>
          <p>${date}</p>
          <p>${startTime} to ${endTime}</p>
          <p>${location}</p>
          ${deleteButtonHTML}
        </section>
      </article>
    `;
  };
}
