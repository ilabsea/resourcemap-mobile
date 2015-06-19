var SiteOnlineController = {
  add: function (data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function () {
      ViewBinding.setAlert("Please send data again.");
    });
  },
  getByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    ViewBinding.setBusy(true);
    SiteModel.fetch(cId, function (response) {
      var siteOnlineData = [];
      $.each(response["sites"], function (key, data) {
        var date = data.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: data.id,
          name: data.name ? data.name : "\u00A0",
          collectionName: "",
          date: date,
          link: "#page-update-site-online"
        };
        siteOnlineData.push(item);
        SiteList.add(new SiteObj(item.id, item.name));
        if (key === response["total"] - 1) {
          SiteView.display($('#site-list-online'), {siteList: siteOnlineData});
        }
      });
    });
  },
  updateBySiteId: function () {
    var data;
    ViewBinding.setBusy(true);
    VisibleLayersFor.fetch(function (fields) {
      var propertiesFile = {properties: {}, files: {}};
      $.map(fields, function (field) {
        propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_online_", true);
      });
      data = {
        "_method": "put",
        "auth_token": App.Session.getAuthToken(),
        "site": {
          "name": $("#updatesitename_online").val(),
          "lat": $("#updatelolat_online").val(),
          "lng": $("#updatelolng_online").val(),
          "properties": propertiesFile.properties,
          "files": propertiesFile.files
        }
      };
      SiteModel.update(data, function () {
        PhotoList.clear();
        SearchList.clear();
        App.Cache.resetValue();
        App.DataStore.clearAllSiteFormData();
        App.redirectTo("#page-site-list");
      }, function () {
        alert(i18n.t("global.please_reupdate_your_site"));
      });
    });
  },
  renderUpdateSiteForm: function () {
    ViewBinding.setBusy(true);
    SiteModel.fetchOne(function (response) {
      var siteOnlineUpdateData = {
        name: response.name,
        lat: response.lat,
        lng: response.lng
      };
      SiteView.displayUpdateLatLng("site/updateOnline.html",
          $('#div-site-update-name-online'), "_online", siteOnlineUpdateData);
      FieldOnlineController.renderUpdate(response);
    });
  }
};