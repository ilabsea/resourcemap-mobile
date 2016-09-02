var SitesByTerm = {
  sites: [],
  get: function(){
    return SitesByTerm.sites;
  },
  set: function(sites){
    SitesByTerm.sites = sites;
  },
  fetchAll: function(success){
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + CollectionController.id + "/sites_by_term.json"),
      type: "GET",
      crossDomain: true,
      success: success
    });
  },
  fetch: function (value, success) {
    $.ajax({
      url: AppServerApi.ajaxUrl(AppServerApi.getV1Collection() + CollectionController.id + "/sites_by_term.json"),
      type: "GET",
      crossDomain: true,
      data: {
        "term": value
      },
      success: success
    });
  }
};
