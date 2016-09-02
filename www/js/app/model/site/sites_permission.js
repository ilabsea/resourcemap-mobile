SitesPermission = {
  fetch: function(cId, successCallback) {
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + cId + "/site_permissions"),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  }
};
