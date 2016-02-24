(function() {
  window.lib = window.lib || {};
  window.lib.element = {};
  var root = window.lib.element;

  root.removeClass = (element, className) => {
    if (element.classList) element.classList.remove(className);
    else element.className = element.className.replace(className, '');
  };

  root.addClass = (element, className) => {
    if (element.classList) element.classList.add(className);
    else element.className += ` ${className}`;
  };

  root.replaceClass = (element, oldClass, newClass) => {
    root.removeClass(element, oldClass);
    root.addClass(element, newClass);
  };
})();
