UserModel = {
  create: function(userParams, successCallback, errorCallback) {
    $.ajax({
      url: AppServerApi.getSignIn(),
      type: "POST",
      headers: {'Authorization': 'Basic ' + btoa(userParams.email + ":" + userParams.password)},
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
