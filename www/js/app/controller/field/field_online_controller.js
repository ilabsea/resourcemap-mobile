var FieldOnlineController = {
  renderByCollectionId: function(site){
    var cId = CollectionController.getCurrentId();
    //detect if collection's fields syn to local 
    if (!FieldController.hasFields){
      $.when(FieldModel.fetchOne(cId)).then(function(){
        FieldController.hasFields = true;
        FieldOfflineController.renderByCollectionId(site, cId);
      });
    } else
      FieldOfflineController.renderByCollectionId(site, cId);
  },
  getByCollectionId: function(cId){
    FieldModel.fetch(cId, function (layers) {
      var field_collections = $.map(layers, function (layer) {
        var site = {fromServer : true, onUpdate : false};
        return FieldHelper.buildField(cId, layer, site , {fromServer: true});
      });
      FieldController.synForCurrentCollection(cId, field_collections);
    }, function (error) {
      App.log('error : ', error);
    });
  },
  renderUpdate: function (siteData) {
    var cId = CollectionController.id;
    var sId = App.DataStore.get("sId");

    SitesPermission.fetch(cId, function (site) {
      if ((!site.read && !site.write && !site.none)
          || (site.read.all_sites && site.write.all_sites && site.none.all_sites))
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      else
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData, cId, sId);
    });
  }
};