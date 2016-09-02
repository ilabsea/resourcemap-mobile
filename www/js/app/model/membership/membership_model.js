MembershipModel = {
  fetch: function (cId, success) {
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + cId + "/memberships.json"),
      type: "get",
      datatype: 'json',
      success: success,
      error: function (error) {
        App.log("error: ", error);
      }
    });
  }
};
