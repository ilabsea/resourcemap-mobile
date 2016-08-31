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
      "start_entry_date": this.startEntryDate,
      "end_entry_date": new Date().toISOString(),
      "properties": JSON.stringify(params.properties),
      "files": JSON.stringify(params.files)
    }

    console.log('params : ', params);

    return data;
  },
  paramsSiteList: function(site){
    console.log('site : ', site);
    var fullDate = dateToParam(site.created_at());
    var siteData = {
      id: site.id,
      name: site.name(),
      collection_id: site.collection_id(),
      collectionName: site.collection_name(),
      date: fullDate,
      link: "#page-form-site"
    };

    return siteData;
  },
  getAllByCollectionId: function () {
    SiteOfflineController.getByCollectionId();
    if (App.isOnline())
      SiteOnlineController.getByCollectionId();
  },
  renderCreate: function () {
    this.startEntryDate = new Date().toISOString();
    console.log('this.startEntryDate : ', this.startEntryDate);
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
