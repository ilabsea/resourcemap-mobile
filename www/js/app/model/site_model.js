SiteModel = {
  create: function(attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var endpoint = getEndPoint();
    var url = endpoint.URL_SITE + cId + "/sites?auth_token=" + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "POST",
      data: {site: attr},
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  },
  fetch: function(collectionID, successCallback) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_SITE + collectionID + "/sites.json?auth_token=" + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function(error) {
        App.log("Retriving sites from server : ", error);
      }
    });
  },
  fetchOne: function(successCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_SITE + cId + "/sites/" + sId + ".json",
      data: {"auth_token": App.Session.getAuthToken()},
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function(error, t) {
        if(t==="timeout" || t==="notmodified") {
          alert('Internet connection problem.');
          App.redirectTo('#page-site-list');
        } 
      },
      complete: function() {
        ViewBinding.setBusy(true);
      }
    });
  },
  update: function(data, successCallback, errorCallback) {
    var cId = localStorage.getItem("cId");
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

ViewBinding = {
  __busy: false,
  __msg: "",
  setBusy: function(status) {
    this.__busy = status;
    if (this.__busy) 
      Spinner.show();
    else
      Spinner.hide();
  },
  setAlert: function(msg) {
    this.__msg = msg;
    if (!this.__msg)
      alert(this.__msg);
  }
};

SiteMenu = {
  menu: function() {
    App.emptyHTML();
    var cId = App.DataStore.get("cId");
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();
    switch (value) {
      case "1":
        SiteController.getAllByCollectionId(cId);
        break;
      case "2":
        SiteOfflineController.getByCollectionId();
        $("#btn_sendToServer").show();
        break;
      case "3":
        SiteOnlineController.getByCollectionId();
        break;
      case "4":
        SessionController.logout();
    }
  }
};

