$(function () {

  $(document).delegate('#page-site-list', 'pageshow', function () {
    $("#btn_sendToServer").hide();
    var cId = App.DataStore.get("cId");
    SiteOfflineController.countByCollectionId(cId);
    SiteController.getAllByCollectionId();
    $("#site-list-menu").get(0).selectedIndex = 0;
    PhotoList.clear();
    SearchList.clear();
    ValidList.clear();
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    FieldController.getByCollectionId();
    $('#form_create_site')[0].reset();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    requireReload(SiteOnlineController.renderUpdateSiteForm);
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = App.DataStore.get("sId");
    SiteOfflineController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.getByUserId(currentUser.id);
    PhotoList.clear();
    SearchList.clear();
    ValidList.clear();
  });

  $(document).delegate('#page-site-list-all', 'pageshow', function () {
    $("#offlinesite-list").show();
    $("#offlinesite-list").listview("refresh");
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").show();
    $("#btn_back_site_list").hide();
    requireReload(SiteOfflineController.renderUpdateSiteForm);
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

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").hide();
    $("#btn_back_site_list").show();
    requireReload(SiteOfflineController.renderUpdateSiteForm);
  });

  $(document).delegate("#page-create-site, \n\
#page-update-site, \n\
#page-update-site-online", "pageshow", function () {
    var cId = App.DataStore.get("cId");
    var members = [];
    MembershipOffline.fetchByCollectionId(cId, function (results) {
      results.forEach(function (result) {
        members.push({user_email: result.user_email()});
      });
    });

    $(document).delegate("#user_autocomplete", "filterablebeforefilter", function (e, data) {
      $(this).removeClass("ui-screen-hidden");
      UserFieldController.autoComplete(this, data, members);
    });

    $(document).delegate("#site_autocomplete", "filterablebeforefilter", function (e, data) {
      $(this).removeClass("ui-screen-hidden");
      SiteFieldController.autoComplete(this, data);
    });

    $(document).delegate("#user_autocomplete li", "click", function (e) {
      AutoCompleteList.getLi(this);
    });

    $(document).delegate("#site_autocomplete li", "click", function () {
      AutoCompleteList.getLi(this);
    });

    $(document).delegate("html", "click", function (e) {
      AutoCompleteList.hideLi(e);
    });

  });

  $(document).delegate('#updatelolat, #updatelolng', 'change', function () {
    FieldController.renderLocationField("#updatelolat", "#updatelolng", "update_");
  });

  $(document).delegate('#updatelolat_online, #updatelolng_online', 'change', function () {
    FieldController.renderLocationField("#updatelolat_online", "#updatelolng_online", "update_online_");
  });

  $(document).delegate('#lat, #lng', 'change', function () {
    FieldController.renderLocationField("#lat", "#lng", "");
  });
});