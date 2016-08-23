SiteController = {
  form: "",
  id: "",
  add: function () {
    var data = this.params();
    if (App.isOnline())
      SiteOnlineController.add(data, SiteHelper.resetForm);
    else
      SiteOfflineController.add(data);
  },
  params: function() {
    var params = FieldController.params();
    var data = {
      "name": $("#name").val(),
      "lat": $("#lat").val(),
      "lng": $("#lng").val(),
      "collection_id": CollectionController.id,
      "properties": params.properties,
      "files": params.files
    }

    return data;
  },
  getAllByCollectionId: function () {
    SiteOfflineController.getByCollectionId();
    if (App.isOnline())
      SiteOnlineController.getByCollectionId();
  },
  renderCreate: function () {
    var data = {name: "", lat: "", lng: ""};
    var btnData = {title: "global.save_site", isUpdateOffline: false};
    SiteView.displayDefaultLayer("site/form.html",
        $('#div_default_layer'), data);
    SiteView.displayBtnSubmit("site/submit.html", $("#btn_submit_site"), btnData);
    FieldController.getByCollectionId();
  },
  setSitesByTermForSiteField: function(){
    if(App.isOnline()){
      SitesByTerm.fetchAll(function(sites){
        SitesByTerm.set(sites);
      });
    }else{
      SitesByTerm.set([]);
    }
  }
};
