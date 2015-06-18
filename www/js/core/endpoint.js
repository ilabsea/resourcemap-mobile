function EndPoint(URL, END_POINT) {
  this.IMG_PATH = URL + "photo_field/";
  this.AUTH_URL = END_POINT + "/users/sign_in.json";
  this.LIST_COLLECTION = END_POINT + "/collections?auth_token=";
  this.URL_LOGOUT = END_POINT + "/users/sign_out.json?auth_token=";
  this.URL_FIELD = END_POINT + "/v1/collections/";
  this.URL_SITE = END_POINT + "/v1/collections/";
  this.URL_COLLECTION = END_POINT + "/collections/";
}

function getEndPoint() {
  var url = App.DataStore.get("URL");
  var endpoint = new EndPoint(url, url + "/api");
  return endpoint;
}