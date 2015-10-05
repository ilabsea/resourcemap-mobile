var FieldHelper = {
  buildField: function (cId, fieldObj, site, options) {
    options = options || {};
    var fromServer = options["fromServer"];
    var pf = null;
    var fieldsBuild = [];
    var fieldsWrapper = {
      cId: cId,
      userId: SessionHelper.currentUser().id,
      fields: fieldsBuild,
      name_wrapper: fromServer ? fieldObj.name : fieldObj.name_wrapper,
      id_wrapper: fromServer ? fieldObj.id : fieldObj.id_wrapper
    };
    if (fromServer) {
      fieldsWrapper.name_wrapper = fieldObj.name;
      fieldsWrapper.id_wrapper = fieldObj.id;
    }
    else {
      fieldsWrapper.name_wrapper = fieldObj.name_wrapper;
      fieldsWrapper.id_wrapper = fieldObj.id_wrapper;
    }
    $.map(fieldObj.fields, function (fields) {
      pf = FieldHelper.buildFieldProperties(fields, site, fromServer);
      fieldsWrapper.fields.push(pf);
    });
    return fieldsWrapper;
  },
  buildFieldProperties: function (field, site, fromServer) {
    var id = fromServer ? field.id : field.idfield;
    var kind = field.kind;
    var widgetType = kind;
    var config = field.config;
    var slider = "", ctrue = "" , is_required = "";
    var is_mandatory = field.is_mandatory;
    var is_enable_field_logic = field.is_enable_field_logic;
    var value = "", configHierarchy = "", selected = "", valueLabel="";
    if(site.onUpdate){
      var properties = site.fromServer ? site.properties : site.properties();
      value = properties ? properties[id] : ""
    }

    switch (widgetType) {
      case "numeric":
        widgetType = "number";
        if(properties)
          value = FieldHelper.getFieldNumberValue(config, value);
        if (config && config.field_logics) {
          App.DataStore.set("configNumberSkipLogic_" + id,
              JSON.stringify(config.field_logics));
        }
        break;
      case "select_one":
        FieldHelper.setSelectedFieldSelectOne(config , value);
        if (is_enable_field_logic) {
          config = FieldHelper.buildFieldSelectOne(config);
          if (!config.field_logics)
            is_enable_field_logic = false;
        }
        break;
      case "select_many":
        FieldHelper.setSelectedFieldSelectMany(config , value);
        if (is_enable_field_logic) {
          App.DataStore.set("configSelectManyForSkipLogic_" + id,
              JSON.stringify(field));
        }
        break;
      case "yes_no":
        widgetType = "select_one";
        value = properties ? properties[id] : 0
        config = FieldHelper.buildFieldYesNo(config, site.fromServer, value);
        slider = "slider";
        ctrue = "true";
        break
      case "phone":
        widgetType = "tel";
        break;
      case "location":
        widgetType = "location";
        if(value){
          valueLabel = FieldHelper.getFieldLocationValue(config, value);
        }
        App.DataStore.set("configLocations_" + id,
            JSON.stringify(config));
        break;
      case "site":
        widgetType = "search";
        if(value){
          valueLabel = FieldHelper.getFieldSiteValue(value);
        }
        break;
      case "user":
        widgetType = "search";
        valueLabel = value
        break;
      case "date":
        widgetType = "date";
        if (value)
          value = FieldHelper.getFieldDateValue(site, id);
        break;
      case "hierarchy": 
        configHierarchy = Hierarchy.generateField(config, value,id);
        if ( value ) selected = Hierarchy._selected
        break;
      case "photo" :
        if(value){
          value = FieldHelper.getFieldPhotoValue(site, id);
        }
        break;
      default:
        widgetType = "text";
        break
    }

    if (is_mandatory)
      is_required = "required";

    var fieldProperties = {
      __value: value,
      __valueLabel: valueLabel,
      _selected: selected,
      idfield: id,
      name: field.name,
      kind: kind,
      code: field.code,
      multiple: (kind === "select_many" ? "multiple" : ""),
      isPhoto: (kind === "photo" ? true : false),
      widgetType: widgetType,
      config: config,
      slider: slider,
      ctrue: ctrue,
      is_mandatory: is_mandatory,
      required: is_required,
      isHierarchy: (kind === "hierarchy" ? true : false),
      configHierarchy: configHierarchy,
      is_enable_field_logic: is_enable_field_logic
    };
    return fieldProperties;
  },
  buildFieldSelectOne: function (config) {
    $.each(config.options, function (i, option) {
      if (config.field_logics) {
        $.map(config.field_logics, function (field_logic) {
          if (option.id === field_logic.value && !config.options[i]["field_id"])
            config.options[i]["field_id"] = field_logic.field_id;
        });
      }
    });
    return config;
  },
  buildFieldYesNo: function (config, fromServer, value) {
    var field_id0, field_id1;
    if (fromServer) {
      if (config) {
        var field_logics = config.field_logics;
        if (field_logics) {
          field_id0 = field_logics[0].field_id;
          field_id1 = field_logics[1].field_id;
        }
      }
    } else {
      field_id0 = config.options[0].field_id;
      field_id1 = config.options[1].field_id;
    }
    config = {
      options: [{
          id: 0,
          label: "NO",
          code: "1",
          field_id: field_id0,
          selected: (value == 0 || value == false) ? "" : "selected"
        },
        {id: 1,
          label: "YES",
          code: "2",
          field_id: field_id1,
          selected: (value == 1 || value == true) ? "selected" : ""
        }]
    };

    return config;
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
    value = site.properties ? site.properties[id] : ""
    var sId = App.DataStore.get("sId");
    var fromServer = site.fromServer;
    if (fromServer) {
      App.DataStore.set(sId + "_" + id, value);
      value = SiteCamera.imagePath(value);
    }
    else {
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
};