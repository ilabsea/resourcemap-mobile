FieldHelper = {
  buildLayerFields: function (cId, layer) {
    var newLayer = {
      cId: cId,
      userId: SessionHelper.currentUser().id,
      layer_name: layer.name,
      layer_id: layer.id ,
      fields: []
    }

    $.each(layer.fields, function (_, field) {
      var fieldForUI = FieldHelper.fieldForUI(field);
      newLayer.fields.push(fieldForUI);
    });

    return newLayer;
  },
  fieldForUI: function(field){
    fieldImpl = FieldParser.parse(field);
    fieldImpl.config = fieldImpl._buildConfig();
    return fieldImpl;
  },
  prepareFieldValue: function(field, isOnline){
    var properties = FieldController.site.properties;
    for(fieldId in properties) {
      if(fieldId == field.id){
        FieldHelper.setFieldValue(field, properties[fieldId], isOnline);
        break;
      }
    }
  },
  setFieldValue: function(field, value, isOnline){
    if(!value){
      field.__value = ''
      return;
    }

    switch (field.kind) {
      case "photo" :
        if (isOnline)
          field.__value = SiteCamera.imagePath(value);
        else {
          var imageData = FieldController.site.files[value];
          if (imageData){
            field.__value = SiteCamera.dataWithMimeType(imageData);
            field.__filename = value;
          }else {
            field.__value = '';
          }
        }
        break;
      case "select_many":
      case "select_one":
      case "yes_no":
        field.__value = value;
        $.each(field.config.options, function(k, option){
          if(typeof field.__value == "boolean"){
            if(option.id == field.__value || option.code == field.__value)
               field.config.options[k]["selected"] = "selected";
          }
          else if (field.__value instanceof Array) {
            $.each(field.__value, function(_, valueOption){
              if (option.id == valueOption || option.code == valueOption)
                field.config.options[k]["selected"] = "selected";
            })
          }

          else if(option.id == field.__value || option.code == field.__value) {
            field.config.options[k]["selected"] = "selected";
          }
        })
        break;

      case "location":
        field.__value = value;
        field.__valueLabel = '';
        $.each(field.config.locations, function(i, option){
          if (option.code == value) {
            field.__valueLabel = option.name;
            return;
          }
        });
        break;
      case "hierarchy":
        field.__value = value;
        Hierarchy.processSetSelected(field.config, value);
        field._selected = Hierarchy._selected;
        break;
      case "date":
        if (value) {
          var date = value.split("T")[0];
          field.__value = isOnline ? date : convertDateWidgetToParam(date);
        }
        break;
      case "site":
        field.__valueLabel = "";
        field.__value = value;
        var sitesByTerm = SitesByTerm.get();
        $.each(sitesByTerm, function(i, siteByTerm){
          if(siteByTerm.id == value ){
            field.__valueLabel = siteByTerm.name;
            return;
          }
        });
        break;
      case "numeric":
      case "calculation":
        field.__value = value;
        if (value && field.config && field.config.allows_decimals == "true" && field.config.digits_precision && !isNaN(parseFloat(value))){
          var floatValue = parseFloat(value);
          field.__value = Number(floatValue.toFixed(parseInt(field.config.digits_precision)));
        }
        break;
      default:
        field.__value = value;
    }
  }
};
