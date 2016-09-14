var FieldOnlineController = {
  renderNewSiteForm: function(){
    //detect if collection's fields syn to local
    if (!FieldController.hasFields){
      $.when(FieldModel.fetchOne(CollectionController.id)).then(function(){
        FieldController.hasFields = true;
        FieldOfflineController.renderNewSiteForm();
      });
    } else
      FieldOfflineController.renderNewSiteForm();
  },
  getByCollectionId: function(cId){
    FieldModel.fetch(cId, function (layers) {
      var field_collections = $.map(layers.fields, function (layer) {
        return FieldHelper.buildLayerFields(cId, layer);
      });
      FieldController.synByCollectionId(cId, field_collections);
    }, function (error) {
      App.log('error : ', error);
    });
  },
  renderUpdate: function (siteData) {
    FieldController.reset();
    var cId = CollectionController.id;
    FieldController.site = siteData;

    SitesPermission.fetch(cId, function (site) {
      if ((!site.read && !site.write && !site.none)
          || (site.read.all_sites && site.write.all_sites && site.none.all_sites))
        FieldOnlineController.renderNewSiteForm();
      else
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData);
    });
  }
};
