var FieldOfflineController = {
  renderByCollectionId: function () {
    var cId = CollectionController.id;
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      if (layers.length == 0) {
        if(!App.isOnline())
          FieldView.displayNoFields("field/no_field_pop_up.html", $('#page-pop-up-no-fields'));
      } else{
        var field_collections = [];
        $.each(layers, function (i, layer) {
          field_collections[i] = $.extend(true, {}, layer._data);
          $.each(layer._data.fields, function (j,dbField) {
            var field = $.extend(true, {}, dbField);
            if (field.kind === "location")
              Location.pageID[field.id] = 0;
            FieldHelper.prepareFieldValue(field, true);
            field_collections[i].fields[j] = field;
          });
        });
        FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
            {field_collections: field_collections});
        FieldView.display("field/form.html", $('#div_field_collection'),
            {field_collections: field_collections});

        FieldController.layers = field_collections;
        FieldController.handleLayerMembership();
      }
      ViewBinding.setBusy(false);
    });
  }
};
