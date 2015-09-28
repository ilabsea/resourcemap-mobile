var SiteOfflineController = {
  add: function (data) {
    SiteOffline.add(data);
    SiteHelper.resetForm();
  },
  getByCollectionId: function () {
    var cId = CollectionController.id;
    var uId = SessionHelper.currentUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByCollectionIdUserId(cId, uId, offset, function (sites) {
      var siteData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        siteData.push({
          id: site.id,
          name: site.name(),
          collectionName: "offline",
          date: fullDate,
          link: "#page-form-site"
        });
      });
      SiteOffline.countByCollectionIdUserId(cId, uId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "offline",
          siteList: siteData};
        SiteView.display($('#site-list'), sitesRender);
      });
    });
  },
  getByUserId: function (userId) {
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByUserId(userId, offset, function (sites) {
      var siteofflineData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        var item = {id: site.id,
          name: site.name(),
          collectionName: site.collection_name(),
          date: fullDate,
          link: "#page-form-site"
        };
        SiteList.add(new SiteObj(site.id, site.name()));
        siteofflineData.push(item);
      });
      SiteOffline.countByUserId(userId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "all",
          siteList: siteofflineData};
        SiteView.display($('#offlinesite-list'), sitesRender);
      });
    });
  },
  updateBySiteId: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      site.name($("#siteName").val());
      site.lat($("#lat").val());
      site.lng($("#lng").val());
      var cId = CollectionController.id;
      FieldOffline.fetchByCollectionId(cId, function (fields) {
        var propertiesFile = {properties: {}, files: {}};
        fields.forEach(function (field) {
          propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, false);
        });
        site.properties(propertiesFile.properties);
        site.files(propertiesFile.files);
        persistence.flush();
        PhotoList.clear();
        SearchList.clear();
        App.DataStore.clearAllSiteFormData();
        App.Cache.resetValue();
        App.redirectTo("index.html#page-site-list");
      });
    });
  },
  renderUpdateSiteForm: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      var siteData = {
        name: site.name(),
        lat: site.lat(),
        lng: site.lng()
      };
      var btnData = {title: "global.update", isUpdateOffline: true};
      SiteView.displayDefaultLayer("site/form.html",
          $('#div_default_layer'), siteData);
      SiteView.displayBtnSubmit("site/submit.html", $("#btn_submit_site"), btnData);
      FieldOfflineController.renderUpdate(site);
    });
  },
  deleteBySiteId: function (sId) {
    SiteOffline.deleteBySiteId(sId);
  },
  submitAllToServerByCollectionIdUserId: function () {
    var cId = CollectionController.id;
    var user = SessionHelper.currentUser();
    SiteOfflineController.processToServerByCollectionIdUserId(cId, user.id);
  },
  submitAllToServerByUserId: function () {
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.processToServerByUserId(currentUser.id);
  },
  processToServerByCollectionIdUserId: function (cId, uId) {
    if (App.isOnline()) {
      Site.all()
          .filter('collection_id', "=", cId)
          .filter('user_id', '=', uId).list(function (sites) {
        if (sites.length > 0)
          SiteOfflineController.processingToServer(sites);
      });
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processToServerByUserId: function (userId) {
    if (App.isOnline()) {
      Site.all().filter('user_id', '=', userId).list(function (sites) {
        if (sites.length > 0)
          SiteOfflineController.processingToServer(sites);
      });
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processingToServer: function (sites) {
    var site = sites[0];
    ViewBinding.setBusy(true);
    var data = {site: {
        device_id: site.device_id(),
        external_id: site.id,
        collection_id: site.collection_id(),
        name: site.name(),
        lat: site.lat(),
        lng: site.lng(),
        properties: site.properties(),
        files: site.files()
      }
    };
    SiteModel.create(data["site"], function () {
      persistence.remove(site);
      persistence.flush();
      $('#sendToServer').show();
      sites.splice(0, 1);
      if (sites.length === 0)
        App.redirectTo("#page-collection-list");
      else
        SiteOfflineController.processingToServer(sites);
    }, function (err) {
      if (err.statusText === "Unauthorized") {
        showElement($("#info_sign_in"));
        App.redirectTo("#page-login");
      } else {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], true);
        SiteView.displayError("site/errorUpload.html", $('#page-error-submit-site'),
            error);
      }
    });
  },
  countByUserId: function (userId) {
    SiteOffline.countByUserId(userId, function (count) {
      if (count == 0) {
        $('#btn_viewOfflineSite').hide();
      } else {
        $('#btn_viewOfflineSite').show();
      }
    });
  },
  disabledOptionMenu: function (cId) {
    var currentUser = SessionHelper.currentUser();
    SiteOffline.countByCollectionIdUserId(cId, currentUser.id, function (count) {
      var options = [];
      if (App.isOnline()) 
        options.push({value: 1, label: "View all", selected: "selected"}, {value: 2, label: "View online"});
      if (count > 0) {
        var optionHash = {value: 3, label: "View offline"};
        if(!App.isOnline()){
          optionHash.selected = "selected";
          $("#btn_sendToServer").show();
        }
        options.push(optionHash);
      }
      SiteView.displaySiteListMenu("site/menu.html", $("#div-site-list-menu"),{options: options});
    });
  }
};