SiteController = {
  id: "",

  save: function () {
    ViewBinding.setBusy(true);
    ViewBinding.setMessage(i18n.t('global.validating'));
    var valid = SiteController.validateForm();

    if(!valid){
      ViewBinding.setBusy(false);
      return false;
    }

    ViewBinding.setMessage(i18n.t('global.saving'))
    var data = SiteController.params();

    if(this.id)
      App.isOnline() ? SiteOnlineController.update(data) : SiteOfflineController.update(data) ;
    else
      App.isOnline() ? SiteOnlineController.add(data) : SiteOfflineController.add(data);
  },

  validateForm: function(){
    var validSite = this.validate()
    var validLayer = FieldController.validateLayers()

    var valid = validSite && validLayer;

    if(!valid)
      ValidationHelper.showValidateMessage("#validation-save-site", i18n.t('validation.emailPsdConfirm'));

    return valid;
  },

  validate: function(){
    var items = ['name', 'lat', 'lng']
    var valid = true;
    $.each(items, function(_, item){
      var $elm = $("#" + item)
      var value = $.trim($elm.val())
      if(value == "")
        valid = false

      value == "" ? $elm.addClass('error') : $elm.removeClass("error");

    })
    return valid;
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
      "properties": params.properties,
      "files": params.files
    }

    return data;
  },

  paramsSiteList: function(site){
    var fullDate = dateToParam(site.created_at);
    var siteData = {
      id: site.id,
      name: site.name,
      collection_id: site.collection_id,
      collectionName: site.collection_name,
      date: fullDate,
      link: "#page-form-site"
    };

    return siteData;
  },

  getAllByCollectionId: function (cId) {
    SiteOfflineController.getByCollectionId(cId);
    if (App.isOnline())
      SiteOnlineController.getByCollectionId(cId);
  },

  renderNewSiteForm: function () {
    this.startEntryDate = new Date().toISOString();
    var data = {name: "", lat: "", lng: ""};
    SiteView.displayDefaultLayer("site_form", $('#div-site'), data);
    FieldController.renderNewSiteForm();
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
