FieldHelper = {
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
  buildFieldProperties: function (fields, site, fromServer) {
    var id = fromServer ? fields.id : fields.idfield;
    var kind = fields.kind;
    var widgetType = kind;
    var config = fields.config;
    var slider = "";
    var ctrue = "";
    var is_required = "";
    var is_mandatory = fields.is_mandatory;
    var is_enable_field_logic = fields.is_enable_field_logic;
    var value;

    switch (widgetType) {
      case "numeric":
        widgetType = "number";
        if (site) {
          value = site.properties ? site.properties[id] : ""
          value = FieldHelper.getFieldNumberValue(config, value);
        }
        if (config && config.field_logics) {
          App.DataStore.set("configNumberSkipLogic_" + id,
              JSON.stringify(config.field_logics));
        }
        break;
      case "select_one":
        if(site){
          value = site.properties[id];
          FieldHelper.setSelectedFieldSelectOne(config , value);
        }
        if (is_enable_field_logic) {
          config = FieldHelper.buildFieldSelectOne(config);
          if (!config.field_logics)
            is_enable_field_logic = false;
        }
        break;
      case "select_many":
        if(site){
          value = site.properties[id];
          FieldHelper.setSelectedFieldSelectMany(config , value);
        }
        if (is_enable_field_logic) {
          App.DataStore.set("configSelectManyForSkipLogic_" + id,
              JSON.stringify(fields));
        }
        break;
      case "yes_no":
        widgetType = "select_one";
        value = site.properties ? site.properties[id] : false
        config = FieldHelper.buildFieldYesNo(config, fromServer, value);
        slider = "slider";
        ctrue = "true";
        break
      case "phone":
        widgetType = "tel";
        value = site.properties ? site.properties[id] : ""
        break;
      case "location":
        widgetType = "location";
        App.DataStore.set("configLocations_" + id,
            JSON.stringify(config));
        break;
      case "site":
        widgetType = "search";
        if(site){
          value = site.properties ? site.properties[id] : ""
          if (value ){
            var siteData = SiteList.getSite(value);
            value = siteData.name;
          }
        }
        break;
      case "user":
        widgetType = "search";
        if(site){
          value = site.properties ? site.properties[id] : ""
          SearchList.add(new SearchField(id, value));
        }
        break;
      case "date":
        widgetType = "date";
        if (site) {
          value = site.properties ? site.properties[id] : ""
          if (value){
            App.log('value : ', value)
            var date = value.split("T")[0];
            // value = fromServer ? date : convertDateWidgetToParam(date)
            value = convertDateWidgetToParam(date);
          }
        }
        break;
      default:
        widgetType = "text";
        value = site.properties ? site.properties[id] : ""
        break
    }

    if (is_mandatory)
      is_required = "required";

    var fieldProperties = {
      __value: value,
      idfield: id,
      name: fields.name,
      kind: kind,
      code: fields.code,
      multiple: (kind === "select_many" ? "multiple" : ""),
      isPhoto: (kind === "photo" ? true : false),
      widgetType: widgetType,
      config: config,
      slider: slider,
      ctrue: ctrue,
      is_mandatory: is_mandatory,
      required: is_required,
      isHierarchy: (kind === "hierarchy" ? true : false),
      configHierarchy: (kind === "hierarchy" ?
          Hierarchy.generateField(fields.config, "", id) : ""),
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
          selected: value ? "" : "selected"
        },
        {id: 1,
          label: "YES",
          code: "2",
          field_id: field_id1,
          selected: value ? "selected" : ""
        }]
    };

    return config;
  },
  setFieldsValue: function (item, propertyCode, pValue, site, fromServer) {
    if (item.code === propertyCode || parseInt(item["idfield"])
        === parseInt(propertyCode)) {
      switch (item.kind) {
        case "photo" :
          FieldHelper.setFieldPhotoValue(item, pValue, site, fromServer);
          break;
        case "location":
          FieldHelper.buildFieldLocationUpdate(site, item, fromServer);
          FieldHelper.setFieldLocationValue(item, pValue);
          break;
        case "hierarchy":
          FieldHelper.setFieldHierarchyValue(item, pValue);
          break;
        case "date":
          if (pValue) {
            var date = pValue.split("T")[0];
            if (!fromServer)
              item.__value = convertDateWidgetToParam(date);
            else
              item.__value = date;
          }
          break;
        case "user":
          SearchList.add(new SearchField(item["idfield"], pValue));
          item.__value = pValue;
          break;
        case "site":
          if (pValue) {
            var site = SiteList.getSite(pValue);
            item.__value = site.name;
          }
          break;
        case "numeric":
          if (pValue) {
            if (item.config
                && item.config.allows_decimals == "true"
                && item.config.digits_precision
                && !isNaN(parseFloat(pValue))) {
              pValue = parseFloat(pValue);
              pValue = Number(pValue.toFixed(parseInt((item.config.digits_precision))));
            }
          }
          item.__value = pValue;
          break;
        default:
          App.log('pValue : ', pValue);
          item.__value = pValue;
      }
    }
  },
  getFieldNumberValue: function(config, value){
    if (config && config.allows_decimals == "true"
        && config.digits_precision && !isNaN(parseFloat(value))) {
      value = parseFloat(value);
      value = Number(value.toFixed(parseInt((config.digits_precision))));
    }
    return value;
  },
  setFieldPhotoValue: function (item, value, site, fromServer) {
    var sId = App.DataStore.get("sId");
    if (fromServer) {
      App.DataStore.set(sId + "_" + item["idfield"], value);
      item.__value = SiteCamera.imagePath(value);
    }
    else {
      var files = site.files();
      var imageData = files[value];
      if (imageData == null)
        item.__value = "";
      else {
        item.__value = SiteCamera.dataWithMimeType(imageData);
        var photo = new Photo(item["idfield"], imageData, SiteCamera.format);
        PhotoList.add(photo);
      }
    }
  },
  setFieldLocationValue: function (item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.locationOptions.length; k++) {
      if (item.config.locationOptions[k].code == item.__value) {
        item.__valueLabel = item.config.locationOptions[k].name;
        break;
      }
    }
  },
  setSelectedFieldSelectMany: function(config, value){
    $.map(config.options, function(option){
      option["selected"] = "";
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
  setFieldHierarchyValue: function (item, value) {
    item.__value = value;
    item.configHierarchy = Hierarchy.generateField(item.config, item.__value,
        item.idfield);
    item._selected = Hierarchy._selected;
  },
  buildFieldLocationUpdate: function (site, item, fromServer) {
    var lat = fromServer ? site.lat : site.lat();
    var lng = fromServer ? site.lng : site.lng();
    item.config.locationOptions = LocationHelper.getLocations(lat, lng, item.config);
  }
};