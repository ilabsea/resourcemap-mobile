CollectionModel = {
  fetch: function (successCallback) {
    var endpoint = getEndPoint();
    $.ajax({
      type: "get",
      url: endpoint.LIST_COLLECTION + App.Session.getAuthToken(),
      dataType: "json",
      success: successCallback,
      complete: function () {
        ViewBinding.setBusy(false);
      },
      error: function (error, t) {
        if (t === "timeout" || t === "notmodified") {
          alert('Internet connection problem.');
        }
      }
    });
  },
  fetchOne: function (callback) {
    var endpoint = getEndPoint();
    $.ajax({
      type: "get",
      url: endpoint.URL_COLLECTION + App.DataStore.get("cId") + ".json?auth_token=" + App.Session.getAuthToken(),
      dataType: "json",
      success: callback
    });
  }
};