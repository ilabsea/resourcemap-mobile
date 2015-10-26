var FieldModel = {
  fetch: function(cId, successCallback, errorCallback) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_FIELD + cId + "/fields?auth_token=" + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: errorCallback
    });
  },
  fetchOne: function(cId){
    var endpoint = getEndPoint();
    return $.ajax({
      url: endpoint.URL_FIELD + cId + "/fields?auth_token=" + App.Session.getAuthToken()
    });
  }
};