var LayerMembershipModel = {
  fetch: function (cId, successCallback, errorCallback) {
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + cId + "/layer_memberships"),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  }
};
