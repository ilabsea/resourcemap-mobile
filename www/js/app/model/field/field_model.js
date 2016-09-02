var FieldModel = {
  fetch: function(cId, successCallback, errorCallback) {
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + cId + "/fields"),
      type: "get",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: errorCallback
    });
  },
  fetchOne: function(cId){
    return $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + cId + "/fields")
    });
  }
};
