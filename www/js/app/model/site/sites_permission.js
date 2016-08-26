SitesPermission = {
  fetch: function(cId, successCallback) {
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/site_permissions?auth_token=" + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  }
};
