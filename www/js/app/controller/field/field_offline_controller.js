var FieldOfflineController = {
  renderByCollectionId: function (site) {
    var cId = CollectionController.getCurrentId();
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      var field_collections = [], location_fields_id = [];
      layers.forEach(function (layer) {
        $.map(layer.fields(), function (field) {
          if (field.kind === "location") {
            location_fields_id.push(field.idfield);

            Location.pageID[field.idfield] = 0;
          }
        });
        var item = FieldHelper.buildField(cId, layer._data, site, {fromServer: false});
        field_collections.push(item);
      });
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

      FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
          {field_collections: field_collections});
      FieldView.display("field/form.html", $('#div_field_collection'),
          {field_collections: field_collections});

      LayerController.set(layers);
      LayerController.handleLayerMembership();
      
      ViewBinding.setBusy(false);
    });
  },
  renderUpdate: function (site) {
    var cId = CollectionController.id;
    site.fromServer = false;
    FieldOfflineController.renderByCollectionId(site);
  }
};