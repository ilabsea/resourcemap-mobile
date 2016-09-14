var SiteOnlineController = {
  add: function (data) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, function(){
      ViewBinding.setBusy(false);
      App.redirectTo("#page-site-list");
    }, function () {
      ViewBinding.setAlert("Please send data again.");
    });
  },

  getByCollectionId: function (cId) {
    var offset = SiteModel.sitePage * SiteModel.limit;
    ViewBinding.setBusy(true);
    SiteModel.fetch(cId, offset, function (response) {
      var siteOnlineData = [];
      $.map(response["sites"], function (data) {
        var date = data.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: data.id,
          name: data.name ? data.name : "\u00A0",
          collection_id: data.collection_id,
          collectionName: "",
          date: date,
          link: "#page-form-site"
        };
        siteOnlineData.push(item);
      });
      var hasMoreSites = false;
      var siteLength = response["sites"].length + offset;
      if (siteLength < response["total"]) {
        hasMoreSites = true;
      }
      var siteData = {
        hasMoreSites: hasMoreSites,
        siteList: siteOnlineData};
      SiteView.display($('#site-list-online'), siteData);
    });
  },

  update: function (data) {
    ViewBinding.setBusy(true);
    attr = {
      "_method": "put",
      "site": data
    };
    SiteModel.update(attr, function () {
      App.redirectTo("#page-site-list");
    }, function (err) {
      if (err["responseJSON"]) {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data);
        SiteView.displayError("site_errorUpload", $('#page-error-submit-site'),
            error);
      }
    });
  },

  renderUpdateSiteForm: function () {
    var sId = SiteController.id;
    ViewBinding.setBusy(true);
    SiteModel.fetchOne(sId, function (site) {
      var siteData = {
        name: site.name,
        lat: site.lat,
        lng: site.lng
      };
      SiteView.displayDefaultLayer("site_form", $("#div-site"), siteData);
      FieldOnlineController.renderUpdate(site);
    });
  }
};
