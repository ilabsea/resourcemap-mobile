CollectionModel = {
  fetch: function (successCallback) {
    $.ajax({
      type: "get",
      url: AppServerApi.getCollection() + App.Session.getAuthToken(),
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
    $.ajax({
      type: "get",
      url: AppServerApi.getV1Collection() + CollectionController.id + ".json?auth_token=" + App.Session.getAuthToken(),
      dataType: "json",
      success: callback
    });
  }
};
