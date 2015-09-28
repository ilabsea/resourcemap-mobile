var SitesByTerm = {
  fetch: function (value, success) {
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_COLLECTION + CollectionController.id + "/sites_by_term.json",
      type: "GET",
      crossDomain: true,
      data: {
        "auth_token": App.Session.getAuthToken(),
        "term": value
      },
      success: success
    });
  }
};