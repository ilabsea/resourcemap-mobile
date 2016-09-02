AppServerApi = {
  setUrl: function (url) {
    App.DataStore.set("URL", url);
  },
  getUrl: function(){
    return App.DataStore.get('URL');
  },
  getImagePath: function () {
    return AppServerApi.getUrl() + "/photo_field/";
  },
  getSignIn: function () {
    return AppServerApi.getUrl() + "/api/users/sign_in.json";
  },
  ajaxUrl: function (path) {
    return path + "?auth_token=" + App.Session.getAuthToken();
  },
  getSignOut: function () {
    return this.ajaxUrl(AppServerApi.getUrl() + "/api/users/sign_out.json");
  },
  getCollection: function () {
    return this.ajaxUrl(AppServerApi.getUrl() + "/api/v1/collections");
  },
  getV1Collection: function () {
    return AppServerApi.getUrl() + "/api/v1/collections/";
  }
}
