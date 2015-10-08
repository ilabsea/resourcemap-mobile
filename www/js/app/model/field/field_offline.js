FieldOffline = {
  add: function (layer) {
    var fieldParams = {
      collection_id: layer.cId,
      user_id: layer.userId,
      name_wrapper: layer.name_wrapper,
      id_wrapper: layer.id_wrapper,
      fields: layer.fields
    };
    var fieldObj = new Field(fieldParams);
    persistence.add(fieldObj);
    persistence.flush();
  },
  update: function(oldLayers, newLayers){
    $.map(newLayers, function (layer) {
      var isNew = true;
      $.each(oldLayers , function(i, oldLayer){
        if(oldLayer.id_wrapper() == layer.id_wrapper){
          isNew = false;
          oldLayer.user_id(layer.userId);
          oldLayer.name_wrapper(layer.name_wrapper);
          oldLayer.id_wrapper(layer.id_wrapper);
          oldLayer.fields(layer.fields);
          return false;
        }else{
          isNew = true;
        }
      });
      if(isNew)
        FieldOffline.add(layer);
    });
    persistence.flush();
  },
  remove: function (fields) {
    fields.forEach(function (field) {
      persistence.remove(field);
    });
    persistence.flush();
  },
  fetchByCollectionId: function (cId, callback) {
    Field.all().filter('collection_id', '=', cId).list(callback);
  }
};