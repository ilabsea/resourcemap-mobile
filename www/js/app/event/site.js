$(function () {

  $(document).delegate('#page-site-list', 'pageshow', function () {
    App.emptyHTML();
    $("#btn_sendToServer").hide();
    var cId = CollectionController.id;
    SiteModel.sitePage = 0;
    SiteOffline.sitePage = 0;
    SiteOfflineController.disabledOptionMenu(cId);
    SiteController.getAllByCollectionId(cId);
    SiteController.setSitesByTermForSiteField();
    FieldController.reset();
    ValidList.clear();
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    SiteController.form = "new";
    SiteController.id = null;
    $("#btn_save_site").text(i18n.t('global.save_site'));
    $("#btn_delete_site").hide();
    SiteController.renderNewSiteForm();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function () {
    var li = this;
    var sId = li.getAttribute('data-id');
    var cId = li.getAttribute('data-collection-id');
    if (sId == "load-more-site-list") {
      SiteModel.sitePage++;
      SiteOnlineController.getByCollectionId(cId);
      $(li).remove()
    }
    else {
      SiteController.id = sId;
      $("#btn_save_site").text(i18n.t('global.update'))
      $("#btn_delete_site").hide();

      SiteOnlineController.renderUpdateSiteForm();
    }
  });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr('data-id');
    if (sId == "load-more-site-offline") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteOfflineController.getByCollectionId();
    } else {
      SiteController.form = "update_offline";
      SiteController.id = sId;
      SiteOfflineController.renderUpdateSiteForm();
    }
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = $(this).attr('data-id');
    var uId = UserSession.getUser().id;
    if (sId == "load-more-site-all") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteOfflineController.getByUserId(uId);
    } else {
      SiteController.form = "update_offline_all";
      SiteController.id = sId;
      CollectionController.id = $(this).attr('data-collection-id');
      CollectionOfflineController.getOne();
      SiteOfflineController.renderUpdateSiteForm();
    }
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = SiteController.id;
    SiteOfflineController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pageshow', function () {
    App.emptyHTML();
    var currentUser = UserSession.getUser();
    SiteOffline.sitePage = 0;
    SiteOfflineController.getByUserId(currentUser.id);
    ValidList.clear();
  });

  $(document).delegate('#page-site-list', 'pagehide', function () {
    if ($.mobile.activePage.is("#page-form-site"))
      ViewBinding.setBusy(true);
  });

  $(document).delegate('#btn_save_site', 'click', function() {
    SiteController.save();
  });
});
