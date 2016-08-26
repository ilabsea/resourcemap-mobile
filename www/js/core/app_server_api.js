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
   getSignOut: function () {
     return AppServerApi.getUrl() + "/api/users/sign_out.json?auth_token=";
   },
   getCollection: function () {
     return AppServerApi.getUrl() + "/api/collections?auth_token=";
   },
   getV1Collection: function () {
     return AppServerApi.getUrl() + "/api/v1/collections/";
   }
}
