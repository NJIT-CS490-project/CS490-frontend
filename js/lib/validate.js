{
  window.lib = window.lib || {};
  const exports = window.lib.exports;

  exports.date = input => {
    const regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
    if (!regex.test(input)) return false;

    const tokens = input.split('-');
    const year = tokens[0];
    if (year < 2016) return false;

    const month = tokens[1];
    if (month < 1 || month > 12) return false;

    const day = tokens[2];
    if (day < 1 || day > 31) return false;

    return true;
  };
}
