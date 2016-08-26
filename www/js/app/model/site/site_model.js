SiteModel = {
  limit: 15,
  sitePage: 0,
  create: function (attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var url = AppServerApi.getV1Collection() + cId + "/sites?auth_token=" + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "POST",
      data: {site: attr},
      datatype: 'json',
      complete: function(){
        ViewBinding.setBusy(false);
      },
      success: successCallback,
      error: errorCallback
    });
  },
  fetch: function (collectionID, offset, successCallback) {
    var url = AppServerApi.getV1Collection() + collectionID
        + "/sites.json?offset=" + offset + "&limit=" +
        SiteModel.limit + "&auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "GET",
      datatype: 'json',
      success: successCallback,
      complete: function () {
        ViewBinding.setBusy(false);
      },
      error: function (error) {
        App.log("Retriving sites from server : ", error);
      }
    });
  },
  fetchOne: function (sId, successCallback) {
    var cId = CollectionController.id;
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/sites/" + sId + ".json",
      data: {"auth_token": App.Session.getAuthToken()},
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function (error, t) {
        if (t === "timeout" || t === "notmodified") {
          alert('Internet connection problem.');
          App.redirectTo('#page-site-list');
        }
      }
    });
  },
  update: function (data, successCallback, errorCallback) {
    var cId = CollectionController.id;
    var sId = SiteController.id;
    $.ajax({
      data: data,
      type: "post",
      url: AppServerApi.getV1Collection() + cId + "/sites/" + sId,
      dataType: "json",
      success: successCallback,
      error: errorCallback
    });
  }
};
