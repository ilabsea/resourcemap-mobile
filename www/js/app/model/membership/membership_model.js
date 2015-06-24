MembershipModel = {
  fetch: function(cId, success) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_FIELD + cId + "/memberships.json?auth_token=" + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: success,
      timeout: 600000,
      error: function(error) {
        App.log("error: ", error);
      }
    });
  }
};