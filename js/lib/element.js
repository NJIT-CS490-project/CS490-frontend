(function() {
  window.lib = window.lib || {};
  window.lib.element = {};
  var root = window.lib.element;

  root.removeClass = (element, className) => {
    if (element.classList) element.classList.remove(className);
    else element.className = element.className.replace(className, '');
  };
})();
