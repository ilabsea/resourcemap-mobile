App = {
  DB_SIZE: 5 * 1024 * 1024,
  DB_NAME: 'resourcemap_db',
  DEBUG: true,
  log: function (text, data) {
    if (App.DEBUG)
      console.log(text, data);
  },
  initialize: function () {
    App.bindEvents();
    App.setUp();
    App.onBackPress();
  },
  resetDb: function () {
    persistence.reset();
    persistence.schemaSync();
  },
  resetCache: function () {
    App.Cache.clearAll();
  },
  bindEvents: function () {
    document.addEventListener('deviceready', App.onDeviceReady, false);
  },
  onDeviceReady: function () {
    connectionDB(App.DB_NAME, App.DB_SIZE);
    createTables();
    App.Cache.clearTemplate();
    App.initialPage();
    FastClick.attach(document.body);
  },
  initialPage: function () {
    var currentUser = JSON.parse(App.DataStore.get("currentUser"));
    if (currentUser) {
      var email = currentUser.email;
      var password = currentUser.password;
      $("#page-initial").prependTo("body");
      Spinner.spinner();
      SessionController.storeSessionLogin(email, password);
    }
  },
  onBackPress: function () {
    document.addEventListener("backbutton", function () {
      if ($.mobile.activePage.is("#page-login"))
        navigator.app.exitApp();
      else if ($.mobile.activePage.is("#page-collection-list"))
        navigator.Backbutton.goHome(function () {
        }, function () {
        });
      else
        navigator.app.backHistory();
    }, false);
  },
  emptyHTML: function () {
    $(".clearPreviousDisplay").html("");
  },
  setUp: function () {
    $.ajaxSetup({
      timeout: 120000,
      cache: true
    });
  },
  redirectTo: function (url) {
    $.mobile.changePage(url);
  },
  replacePage: function (url) {
    location.replace(url);
  },
  isOnline: function () {
    var online = false;
    if (navigator.connection) {
      online = (navigator.connection.type !== Connection.NONE);
      return online;
    }
    online = navigator.onLine;
    return online;
  },
  allBooleanTrue: function (arr) {
    for (var i in arr)
      if (!arr[i])
        return false;
    return true;
  }
};
