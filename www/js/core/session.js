App = App || {};
App.Session = {
  setAuthToken: function(authToken) {
    App.DataStore.set("authToken", authToken);
  },
  getAuthToken: function() {
    return App.DataStore.get("authToken");
  },
  create: function(user) {
    var currentUser = {id: user.id, password: user.password(), email: user.email()};
    App.DataStore.set("currentUser", JSON.stringify(currentUser));
  },
  resetState: function() {
    App.DataStore.remove("authToken");
    App.DataStore.remove("currentUser");
  }
};
