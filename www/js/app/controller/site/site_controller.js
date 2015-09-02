SiteController = {
  form: "",
  add: function () {
    var data = SiteHelper.buildDataForSite();
    if (App.isOnline())
      SiteOnlineController.add(data, SiteHelper.resetForm);
    else
      SiteOfflineController.add(data);
  },
  getAllByCollectionId: function () {
    SiteOfflineController.getByCollectionId();
    if (App.isOnline())
      SiteOnlineController.getByCollectionId();
  },
  renderForm: function () {
    var data = {name: "", lat: "", lng: ""};
    var btnData = {title: "global.save_site", isUpdateOffline: false};
    SiteView.displayDefaultLayer("site/form.html",
        $('#div_default_layer'), data);
    SiteView.displayBtnSubmit("site/submit.html", $("#btn_submit_site"), btnData);
    FieldController.getByCollectionId();
  }
};