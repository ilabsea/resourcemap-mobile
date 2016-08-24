App = App || {};
App.DataStore = {
  set: function (key, value) {
    localStorage.setItem(key, value);
  },
  get: function (key) {
    return localStorage.getItem(key);
  },
  remove: function (key) {
    localStorage.removeItem(key);
  },
  clearAll: function () {
    localStorage.clear();
  },
  clearConfig: function (prefix) {
    for (var key in localStorage) {
      if (key.substr(0, key.indexOf('_')) === prefix)
        localStorage.removeItem(key);
    }
  }
};
