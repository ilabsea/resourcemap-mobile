var SiteOnlineController = {
  add: function (data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function () {
      ViewBinding.setAlert("Please send data again.");
    });
  },
  getByCollectionId: function () {
    var cId = CollectionController.id;
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
          collectionName: "",
          date: date,
          link: "#page-form-site"
        };
        siteOnlineData.push(item);
        SiteList.add(new SiteObj(item.id, item.name));
      });
      var hasMoreSites = false;
      var siteLength = response["sites"].length + offset;
      if (siteLength < response["total"]) {
        hasMoreSites = true;
      }
      var siteData = {
        hasMoreSites: hasMoreSites,
        state: "online",
        siteList: siteOnlineData};
      SiteView.display($('#site-list-online'), siteData);
    });
  },
  updateBySiteId: function () {
    var data = SiteHelper.buildDataForSite();
    App.log('data : ' , data);
    attr = {
      "_method": "put",
      "auth_token": App.Session.getAuthToken(),
      "site": data
    };
    SiteModel.update(attr, function () {
      PhotoList.clear();
      SearchList.clear();
      App.Cache.resetValue();
      App.DataStore.clearAllSiteFormData();
      App.redirectTo("#page-site-list");
    }, function (err) {
      if (err["responseJSON"]) {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data, false);
        SiteView.displayError("site/errorUpload.html", $('#page-error-submit-site'),
            error);
      }
    });
  },
  renderUpdateSiteForm: function () {
    SiteModel.fetchOne(function (response) {
      var siteData = {
        name: response.name,
        lat: response.lat,
        lng: response.lng
      };
      var btnData = {title: "global.update", isUpdateOffline: false};
      SiteView.displayDefaultLayer("site/form.html",
          $("#div_default_layer"), siteData);
      SiteView.displayBtnSubmit("site/submit.html", $("#btn_submit_site"), btnData);
      FieldOnlineController.renderUpdate(response);
    });
  }
};