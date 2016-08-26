var FieldModel = {
  fetch: function(cId, successCallback, errorCallback) {
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/fields?auth_token=" + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: errorCallback
    });
  },
  fetchOne: function(cId){
    return $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/fields?auth_token=" + App.Session.getAuthToken()
    });
  }
};
