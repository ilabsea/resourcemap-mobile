SiteModel = {
  limit: 15,
  sitePage: 0,
  create: function (attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var endpoint = getEndPoint();
    var url = endpoint.URL_SITE + cId
        + "/sites?auth_token=" + App.Session.getAuthToken();
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
    var endpoint = getEndPoint();
    var url = endpoint.URL_SITE + collectionID
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
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_SITE + cId + "/sites/" + sId + ".json",
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
    var sId = localStorage.getItem("sId");
    var endpoint = getEndPoint();
    $.ajax({
      data: data,
      type: "post",
      url: endpoint.URL_SITE + cId + "/sites/" + sId,
      dataType: "json",
      success: successCallback,
      error: errorCallback
    });
  }
};

SiteMenu = {
  menu: function () {
    App.emptyHTML();
    var cId = CollectionController.id;
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();
    switch (value) {
      case "1":
        SiteController.getAllByCollectionId(cId);
        break;
      case "3":
        SiteOfflineController.getByCollectionId();
        $("#btn_sendToServer").show();
        break;
      case "2":
        SiteOnlineController.getByCollectionId();
        break;
      case "4":
        SessionController.logout();
    }
  }
};
