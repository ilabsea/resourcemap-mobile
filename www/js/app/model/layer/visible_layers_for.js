VisibleLayersFor = {
  fetch: function (successCallback) {
    var cId = CollectionController.id;
    var sId = SiteController.id;
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_SITE + cId + "/sites/" + sId
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
