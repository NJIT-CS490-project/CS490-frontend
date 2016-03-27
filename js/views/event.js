{
  window.views = window.views || {};
  const exports = window.views;
  exports.eventView = model => {
    const name = model.name || 'NAME';
    const timeStart = model.timeStart || 'TIME_START';
    const timeEnd = model.timeEnd || 'TIME_END';
    const location = model.location || 'LOCATION';
    return `
      <article class="event">
        <img src="images/event.png"></img>
        <section>
          <h1>${name}</h1>
          <p>1970-01-01</p>
          <p>${timeStart} to ${timeEnd}</p>
          <p>${location}</p>
          <input type="button" value="Delete" class="button secondary-color warning-bg-color"></input>
        </section>
      </article>
    `;
  };
}
