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
    ViewBinding.setBusy(true);
    var data = {name: "", lat: "", lng: ""};
    SiteView.displayDefaultLayer("site/form.html",
        $('#div_default_layer'), data);
    FieldController.getByCollectionId();
  }
};