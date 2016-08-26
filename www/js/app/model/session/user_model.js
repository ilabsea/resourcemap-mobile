UserModel = {
  create: function(attr, successCallback, errorCallback) {
    var email = attr["user"]["email"];
    var password = attr["user"]["password"];
    $.ajax({
      url: AppServerApi.getSignIn(),
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
    $.ajax({
      url: AppServerApi.getSignOut() + App.Session.getAuthToken(),
      type: "POST",
      complete: function() {
        callback();
        ViewBinding.setBusy(false);
      }
    });
  }
};
