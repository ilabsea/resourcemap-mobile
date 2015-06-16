CollectionModel = {
  fetch: function(successCallback) {
    var endpoint = getEndPoint();
    $.ajax({
      type: "get",
      url: endpoint.LIST_COLLECTION + App.Session.getAuthToken(),
      dataType: "json",
      success: successCallback
    });
  },
  fetchOne: function(callback) {
    var endpoint = getEndPoint();
    $.ajax({
      type: "get",
      url: endpoint.URL_COLLECTION + App.DataStore.get("cId") + ".json?auth_token=" + App.Session.getAuthToken(),
      dataType: "json",
      success: callback
    });
  }
};