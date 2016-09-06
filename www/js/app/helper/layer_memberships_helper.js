LayerMembershipsHelper = {
  build: function (layers, write) {
    var layerMemberships = [];
    $.map(layers, function (layer) {
      layerMemberships.push({read: true, write: write, layer_id: layer.id});
    });
    return layerMemberships;
  },
  buildCustomerSitePermission: function (site, siteData) {
    if (site.write.some_sites.length !== 0)
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.write, true, siteData);
    else if (site.read.some_sites.length !== 0)
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.read, false, siteData);
    else if (site.none.some_sites.length !== 0)
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.none, "none", siteData);
  },
  buildCustomerSiteReadWrite: function (siteState, rw, siteData) {
    var cId = CollectionController.id;
    var sId = SiteController.id;
    $.map(siteState.some_sites, function (some_site) {
      if (some_site.id == sId)
        LayerMembershipsHelper.buildSiteWithVisibleLayers(siteData, rw);
      else {
        $('#div_update_field_online').show();
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      }
    });
  },
  buildSiteWithVisibleLayers: function (siteData, rw) {
    VisibleLayersFor.fetch(function (layers) {
      var layerMemberships = LayerMembershipsHelper.build(layers, rw);
      var field_collections = FieldHelper.buildFieldsUpdate(layers,
          siteData, true, layerMemberships);
      FieldView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update-online'),
          {field_collections: field_collections});
      FieldView.display("field_form",
          $('#div_field_collection'),
          {field_collections: field_collections});
      ViewBinding.setBusy(false);
      if (rw === 'none')
        $('#div_update_field_online').hide();
    });
  }
};
