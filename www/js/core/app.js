App = {
  DB_SIZE: 5 * 1024 * 1024,
  DB_NAME: 'resourcemap_db',
  DEBUG: true,
  userId: "",
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

    App.setDefaultEndPoint();
    var url = App.DataStore.get("URL");
    EndPointView.display($("#page-about-release"), {url: url});
//    App.log('navigator : ', navigator.geolocation);
//    navigator.geolocation.getCurrentPosition(function (pos) {
//      App.log('pos : ', pos);
//    }, function (error) {
//      App.log('error : ', error);
//    }, {
//      enableHighAccuracy: true
//    });
  },
  setDefaultEndPoint: function () {
    var url = App.DataStore.get("URL");
    if (url == null || url == "" || url == "undefined") {
      url = "http://resourcemap-sea.instedd.org";
      App.DataStore.set("URL", url);
    }
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
