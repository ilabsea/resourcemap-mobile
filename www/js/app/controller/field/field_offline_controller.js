var FieldOfflineController = {
  renderNewSiteForm: function () {
    var cId = CollectionController.id;
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      if (layers.length == 0) {
        if(!App.isOnline())
          FieldView.displayNoFields("field_no_field_pop_up", $('#page-pop-up-no-fields'));
      } else {
        var cloneLayers = [];
        $.each(layers, function (i, layer) {
          cloneLayers[i] = $.extend(true, {}, layer._data);
          $.each(layer._data.fields, function (j,dbField) {
            var field = $.extend(true, {}, dbField);
             FieldHelper.prepareFieldValue(field, true);
             cloneLayers[i].fields[j] = field;
           });
         });
        FieldController.layers = cloneLayers;
        FieldView.displayLayerMenu("layer_menu", $('#ui-layer-menu'),
            {field_collections: cloneLayers});
        FieldView.display("layer_sets", $('#div_field_collection'),
            {field_collections: cloneLayers});

        FieldController.handleLayerMembership();
      }
      ViewBinding.setBusy(false);
    });
  }
};
