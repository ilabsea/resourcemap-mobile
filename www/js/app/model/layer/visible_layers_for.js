VisibleLayersFor = {
  fetch: function (successCallback) {
    var cId = CollectionController.id;
    var sId = SiteController.id;
    $.ajax({
      url: AppServerApi.getV1Collection() + cId + "/sites/" + sId
          + "/visible_layers_for?auth_token="
          + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function (error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  }
};
