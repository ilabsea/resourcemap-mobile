LayerMembership = {
  fetch: function (cId, successCallback) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_SITE + cId + "/layer_memberships?auth_token="
          + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function (error) {
        if (error.readyState == 0) {
          FieldOfflineController.renderByCollectionId();
        }
      }
    });
  }
};