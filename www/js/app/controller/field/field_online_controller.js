var FieldOnlineController = {
  renderByCollectionId: function(){
    //detect if collection's fields syn to local
    if (!FieldController.hasFields){
      $.when(FieldModel.fetchOne(CollectionController.id)).then(function(){
        FieldController.hasFields = true;
        FieldOfflineController.renderByCollectionId();
      });
    } else
      FieldOfflineController.renderByCollectionId();
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
    var cId = CollectionController.id;

    SitesPermission.fetch(cId, function (site) {
      if ((!site.read && !site.write && !site.none)
          || (site.read.all_sites && site.write.all_sites && site.none.all_sites))
        FieldOnlineController.renderByCollectionId();
      else
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData);
    });
  }
};
