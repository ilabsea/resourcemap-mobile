var FieldOfflineController = {
  renderByCollectionId: function (site, cId ) {
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      if (layers.length == 0) {
        if(!App.isOnline())
          FieldView.displayNoFields("field/no_field_pop_up.html", $('#page-pop-up-no-fields'));
      }else{
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
      }
      ViewBinding.setBusy(false);
    });
  },
  renderUpdate: function (site) {
    var cId = site.collection_id();
    site.fromServer = false; 
    site.onUpdate = true;
    FieldOfflineController.renderByCollectionId(site, cId);
  }
};