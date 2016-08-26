var LayerMembershipModel = {
  fetch: function (cId, successCallback, errorCallback) {
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/layer_memberships?auth_token="
          + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  }
};
