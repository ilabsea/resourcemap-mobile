MembershipModel = {
  fetch: function (cId, success) {
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/memberships.json?auth_token="
          + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: success,
      error: function (error) {
        App.log("error: ", error);
      }
    });
  }
};
