var SitesByTerm = {
  sites: [],
  get: function(){
    return SitesByTerm.sites;
  },
  set: function(sites){
    SitesByTerm.sites = sites;
  },
  fetchAll: function(success){
    var endpoint = getEndPoint();
    $.ajax({
      url: endpoint.URL_COLLECTION + CollectionController.id + "/sites_by_term.json",
      type: "GET",
      crossDomain: true,
      data: {
        "auth_token": App.Session.getAuthToken()
      },
      success: success
    });
  },
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