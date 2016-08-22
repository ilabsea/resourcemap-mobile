FieldHelper = {
  buildLayerFields: function (layer, isOnline) {
    var newLayer = {
      cId: CollectionController.id,
      userId: SessionHelper.currentUser().id,
      layer_name: isOnline ?  layer.name : layer.layer_name,
      layer_id: isOnline ? layer.id : layer.layer_id,
      fields: []
    }

    $.each(layer.fields, function (_, field) {
      var fieldForUI = FieldHelper.fieldForUI(field);
      
      newLayer.fields.push(fieldForUI);
    });

    return newLayer;
  },
  fieldForUI: function(field, isOnline){
    fieldImpl = FieldParser.parse(field);
    fieldImpl.config = fieldImpl._buildConfig();
    return fieldImpl;
  },
  getFieldSiteValue: function(value){
    valueLabel = "";
    sitesByTerm = SitesByTerm.get();
    $.each(sitesByTerm, function(i, siteByTerm){
      if(siteByTerm.id == value ){
        valueLabel = siteByTerm.name;
        return;
      }
    });
    return valueLabel;
  },
  getFieldDateValue: function(site, idfield){
    var properties = site.fromServer ? site.properties : site.properties();
    var value = properties ? properties[idfield] : "";
    if (value){
      var date = value.split("T")[0];
      value = site.fromServer ? date : convertDateWidgetToParam(date);
    }
    return value;
  },
  getFieldNumberValue: function(config, value){
    if (config && config.allows_decimals == "true"
        && config.digits_precision && !isNaN(parseFloat(value))) {
      value = parseFloat(value);
      value = Number(value.toFixed(parseInt((config.digits_precision))));
    }
    return value;
  },
  getFieldPhotoValue: function (site, id) {
    if (site.fromServer) {
      value = site.properties ? site.properties[id] : ""
      value = SiteCamera.imagePath(value);
    }
    else {
      value = site.properties() ? site.properties()[id] : ""
      var files = site.files();
      var imageData = files[value];
      if (imageData == null)
        value = "";
      else {
        value = SiteCamera.dataWithMimeType(imageData);
        var photo = new Photo(id, imageData, SiteCamera.format);
        PhotoList.add(photo);
      }
    }
    return value;
  },
  getFieldLocationValue: function (config, value) {
    var valueLabel = "";
    $.each(config.locations, function(i, option){
      if (option.code == value) {
        valueLabel = option.name;
        return;
      }
    });
    return valueLabel
  },
  setSelectedFieldSelectMany: function(config, value){
    $.map(config.options, function(option){
      option["selected"] = "";
      if(value)
        $.map(value , function(v){
          if (option.id == v || option.code == v) {
            option["selected"] = "selected";
          }
        });
    });
  },
  setSelectedFieldSelectOne: function (config, value) {
    $.map(config.options, function(option){
      option["selected"] = "";
      if (option.id == value || option.code == value)
        option["selected"] = "selected";
    });
  },
  imageWithPath: function(imgFileName) {
    return App.IMG_PATH + imgFileName;
  },

  imageWithoutPath: function(imageFullPath) {
    return imageFullPath.replace(App.IMG_PATH, '')
  }
};
