$(function () {

  $(document).delegate('#page-site-list', 'pageshow', function () {
    App.emptyHTML();
    $("#btn_sendToServer").hide();
    var cId = App.DataStore.get("cId");
    SiteOfflineController.countByCollectionId(cId);
    SiteModel.sitePage = 0;
    SiteOffline.sitePage = 0;
    SiteController.getAllByCollectionId();
    $("#site-list-menu").get(0).selectedIndex = 0;
    PhotoList.clear();
    SearchList.clear();
    ValidList.clear();
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    FieldView.displayDefaultLayer("site/add.html", $("#div-default-layer"), "");
    FieldController.getByCollectionId();
    $('#form_create_site')[0].reset();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function () {
    var sId = this.id;
    if (sId == "load-more-site-online") {
      $("#" + sId).remove();
      SiteModel.sitePage++;
      SiteOnlineController.getByCollectionId();
    } else {
      App.DataStore.set("sId", sId);
      SiteOnlineController.renderUpdateSiteForm();
    }
  });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = this.id;
    if (sId == "load-more-site-offline") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteOfflineController.getByCollectionId();
    } else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").hide();
      $("#btn_back_site_list").show();
      requireReload(SiteOfflineController.renderUpdateSiteForm);
    }
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = this.id;
    var uId = SessionHelper.currentUser().id;
    if (sId == "load-more-site-all") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteOfflineController.getByUserId(uId);
    } else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").show();
      $("#btn_back_site_list").hide();
      requireReload(SiteOfflineController.renderUpdateSiteForm);
    }
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = App.DataStore.get("sId");
    SiteOfflineController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    var currentUser = SessionHelper.currentUser();
    SiteOffline.sitePage = 0;
    SiteOfflineController.getByUserId(currentUser.id);
    PhotoList.clear();
    SearchList.clear();
    ValidList.clear();
  });

  $(document).delegate('#page-site-list-all', 'pageshow', function () {
    $("#offlinesite-list").show();
    $("#offlinesite-list").listview("refresh");
  });

  $(document).delegate(
      '#btn_back_site_in_create , #btn_back_site_list_online , \n\
#btn_back_site_list_all , #btn_back_site_list', 'click', function () {
        if ($(this).attr("id") === "btn_back_site_in_create")
          ValidationHelper.resetFormValidate("#form_create_site");
        PhotoList.clear();
        SearchList.clear();
        App.DataStore.clearAllSiteFormData();
        App.Cache.resetValue();
      });

  $(document).delegate('#page-create-site', 'pagebeforeshow', function () {
    InvisibleLayer.invisibleNameLatLng("wrapSiteLocation", "wrapSiteName", function () {
      requireReload(function () {
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (lat == "" && lng == "") {
          LocationHelper.getCurrentLocation();
        }
      });
    });
  });
});