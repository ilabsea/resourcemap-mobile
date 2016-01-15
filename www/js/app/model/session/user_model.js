UserModel = {
  create: function(url, attr, successCallback, errorCallback) {
    var email = attr["user"]["email"];
    var password = attr["user"]["password"];
    $.ajax({
      url: url,
      type: "POST",
      headers: {'Authorization': 'Basic ' + btoa(email + ":" + password)},
      complete: function(){
        ViewBinding.setBusy(false);
      },
      success: successCallback,
      error: errorCallback
    });
  },
  delete: function(callback) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_LOGOUT + App.Session.getAuthToken(),
      type: "POST",
      complete: function() {
        callback();
        ViewBinding.setBusy(false);
      }
    });
  }
};
