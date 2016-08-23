FieldController = {
  hasFields: false, //use to detect if collection has fields
  layers: [],
  site: { properties: {}, files: {} },
  getByCollectionId: function () {
    if(App.isOnline())
      FieldOnlineController.renderByCollectionId();
    else
      FieldOfflineController.renderByCollectionId();
  },
  synForCurrentCollection: function (cId, newLayers) {
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      FieldOffline.update(layers,newLayers);
    });
  },
  renderLocationField: function (id, isFocus) {
    var offset = Location.pageID[id] * Location.limit;
    var $ul = $("#autocomplete_" + id);
    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var config = JSON.parse(App.DataStore.get("configLocations_" + id));
    var locationOptions = LocationHelper.getLocations(lat, lng, config);


    if (offset == 0)
      $ul.html("");

    if ((offset == 0 && isFocus) || (offset != 0 && !isFocus)) {
      var hasMoreLocation = false;
      if (Location.limit + offset < locationOptions.length) {
        hasMoreLocation = true;
      }
      config.locationOptions = locationOptions.slice(offset, Location.limit + offset);

      FieldView.displayLocationField("field/location.html", $ul,
          {hasMoreLocation: hasMoreLocation, config: config});
    }
  },
  handleLayerMembership: function(){
    var uId = SessionHelper.currentUser().id;
    $.each(FieldController.layers, function (_ , layer) {
      LayerMembershipOffline.fetchByUserLayerId(uId, layer.layer_id, function(layermembership){
        FieldView.displayUiDisabled(layermembership);
      });
    });
  },
  params: function(){
    var properties = {};
    var files = {};
    this.layers.forEach(function(layer){
      layer.fields().forEach(function(field){
        var idfield = field.id;
        var kind = field.kind;
        var $field = $('#' + idfield);
        switch(kind){
          case "photo":
            var lPhotoList = PhotoList.count();
            for (var p = 0; p < lPhotoList; p++) {
              if (PhotoList.getPhotos()[p].id == idfield) {
                var fileName = PhotoList.getPhotos()[p].name;
                properties[idfield] = fileName;
                files[fileName] = PhotoList.getPhotos()[p].data;
                break;
              }
            }
            break;
          case "date" :
            var date = $field.val();
            if (date)
              date = convertDateWidgetToParam(date);
            properties[idfield] = date;
            break;
          case "hierarchy":
            var node = $field.tree('getSelectedNode');
            var data = node.id;
            if (data === null)
              data = "";
            properties[idfield] = data;
            break;
          case "user":
          case "site":
          case "location":
            var value = $field.val();
            if (value)
              value = $field.attr('data-code');

            properties[idfield] = value;
            break;
          default:
            var value = $field.val();
            if (value == null)
              value = "";
            properties[idfield] = value;
            break;
        }
      })
    });

    var data = {
      collection_id: CollectionController.id,
      name: name,
      lat: lat,
      lng: lng,
      properties: properties,
      files: files
    };
    return data;
  }
};
