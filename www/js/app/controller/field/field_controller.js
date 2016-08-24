FieldController = {
  hasFields: false, //use to detect if collection has fields
  layers: [],
  site: { properties: {}, files: {} },
  reset: function() {
    this.layers = [];
    this.site = { properties: {}, files: {} };
  },
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
  showNearbyOptions: function (id, isFocus) {
    var offset = Location.pageID[id] * Location.limit;
    var $ul = $("#autocomplete_" + id);
    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var field = this.findFieldById(id);
    var config = field.config;
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
    $.each(this.layers, function (_ , layer) {
      LayerMembershipOffline.fetchByUserLayerId(uId, layer.layer_id, function(layermembership){
        FieldView.displayUiDisabled(layermembership);
      });
    });
  },
  params: function(){
    var properties = {};
    var files = {};
    this.layers.forEach(function(layer){
      $.each(layer.fields, function(_, field){
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
  },
  findFieldById: function(idfield) {
    for(var i=0; i<this.layers.length; i++) {
      for(var j=0; j<this.layers[i].fields.length; j++){
        if(this.layers[i].fields[j].id == idfield)
          return this.layers[i].fields[j];
      }
    }
    return null;
  },
};
