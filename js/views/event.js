{
  window.views = window.views || {};
  const exports = window.views;

  exports.eventView = (model, requester, isAdmin) => {
    const title = model.title || '';
    const date = model.date || '';
    const startTime = model.startTime || '';
    const endTime = model.endTime || '';
    const location = model.location || '';
    const id = model.id;
    const creatorName = model.username;

    const deleteButtonHTML = ((requester === creatorName) || isAdmin)
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
          <p>hosted by ${creatorName}<p>
          ${deleteButtonHTML}
        </section>
      </article>
    `;
  };
}
