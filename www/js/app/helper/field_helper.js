FieldHelper = {
  buildField: function (fieldObj, options, layerMemberships) {
    options = options || {};
    var fromServer = options["fromServer"];
    var pf = null;
    var fieldsBuild = [];
    var fieldsWrapper = {
      cId: localStorage.getItem("cId"),
      userId: SessionHelper.currentUser().id,
      fields: fieldsBuild,
      name_wrapper: fromServer ? fieldObj.name : fieldObj.name_wrapper,
      id_wrapper: fromServer ? fieldObj.id : fieldObj.id_wrapper
    };
    if (fromServer) {
      fieldsWrapper.name_wrapper = fieldObj.name;
      fieldsWrapper.id_wrapper = fieldObj.id;
      if (layerMemberships)
        $.map(layerMemberships, function (layerMembership) {
          if (fieldObj.id === layerMembership.layer_id)
            fieldsWrapper.layer_membership = layerMembership;
        });
    }
    else {
      fieldsWrapper.name_wrapper = fieldObj.name_wrapper;
      fieldsWrapper.id_wrapper = fieldObj.id_wrapper;
      fieldsWrapper.layer_membership = fieldObj.layer_membership;
    }
    $.map(fieldObj.fields, function (fields) {
      pf = FieldHelper.buildFieldProperties(fields, fromServer);
      fieldsWrapper.fields.push(pf);
    });
    return fieldsWrapper;
  },
  buildFieldProperties: function (fields, fromServer) {
    var id = fromServer ? fields.id : fields.idfield;
    var kind = fields.kind;
    var widgetType = kind;
    var config = fields.config;
    var slider = "";
    var ctrue = "";
    var is_required = "";
    var is_mandatory = fields.is_mandatory;
    var is_enable_field_logic = fields.is_enable_field_logic;

    switch (widgetType) {
      case "numeric":
        widgetType = "number";
        if (config && config.field_logics) {
          App.DataStore.set("configNumberSkipLogic_" + id,
              JSON.stringify(config.field_logics));
        }
        break;
      case "select_one":
        if (is_enable_field_logic) {
          config = FieldHelper.buildFieldSelectOne(config);
          if (!config.field_logics)
            is_enable_field_logic = false;
        }
        break;
      case "select_many":
        if (is_enable_field_logic) {
          App.DataStore.set("configSelectManyForSkipLogic_" + id,
              JSON.stringify(fields));
        }
        break;
      case "yes_no":
        widgetType = "select_one";
        config = FieldHelper.buildFieldYesNo(config, fromServer);
        slider = "slider";
        ctrue = "true";
        break
      case "phone":
        widgetType = "tel";
        break;
      case "location":
        widgetType = "location";
        App.DataStore.set("configLocations_" + id,
            JSON.stringify(config));
        break;
      case "site":
      case "user":
        widgetType = "search";
        break;
      case "identifier":
        widgetType = "text";
        break;
    }

    if (is_mandatory)
      is_required = "required";

    var fieldProperties = {
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
  buildFieldYesNo: function (config, fromServer) {
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
          field_id: field_id0
        },
        {id: 1,
          label: "YES",
          code: "2",
          field_id: field_id1
        }]
    };

    return config;
  },
  buildFieldsUpdate: function (layers, site, fromServer, layerMemberships) {
    var location_fields_id = [];
    var field_collections = $.map(layers, function (layer) {
      var fields = fromServer ? layer.fields : layer.fields();
      $.map(fields, function (field) {
        if (field.kind === "location") {
          var fieldId = fromServer ? field.id : field.idfield;
          location_fields_id.push(fieldId);
          Location.pageID[fieldId] = 0;
        }
      });
      var item = FieldHelper.buildFieldsLayer(layer, site, fromServer, layerMemberships);
      return item;
    });
    App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

    return field_collections;
  },
  buildFieldsLayer: function (layer, site, fromServer, layerMemberships) {
    if (fromServer) {
      var itemLayer = FieldHelper.buildField(layer, {fromServer: fromServer}, layerMemberships);
      var p = site.properties;
    }
    else {
      var itemLayer = FieldHelper.buildField(layer._data, {fromServer: fromServer}, "");
      var p = site.properties();
    }

    for (var propertyCode in p) {
      $.map(itemLayer.fields, function (item) {
        var propertyValue = p[propertyCode];
        FieldHelper.setFieldsValue(item, propertyCode,
            propertyValue, site, fromServer);
      });
    }
    return itemLayer;
  },
  setFieldsValue: function (item, propertyCode, pValue, site, fromServer) {
    if (item.code === propertyCode || parseInt(item["idfield"])
        === parseInt(propertyCode)) {
      switch (item.kind) {
        case "photo" :
          FieldHelper.setFieldPhotoValue(item, pValue, site, fromServer);
          break;
        case "select_many":
        case "select_one":
        case "yes_no":
          FieldHelper.setFieldSelectValue(item, pValue);
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
            item.__value = convertDateWidgetToParam(date);
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
            if (item.config.allows_decimals == "true"
                && item.config.digits_precision
                && !isNaN(parseFloat(pValue))) {
              pValue = parseFloat(pValue);
              pValue = Number(pValue.toFixed(parseInt((item.config.digits_precision))));
            }
          }
          item.__value = pValue;
          break;
        default:
          item.__value = pValue;
      }
    }
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
  setFieldSelectValue: function (item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.options.length; k++) {
      item.config.options[k]["selected"] = "";
      if (typeof (item.__value) === "boolean") {
        if (item.config.options[k].id == item.__value
            || item.config.options[k].code == item.__value[j]) {
          item.config.options[k]["selected"] = "selected";
        }
      } else {
        if (item.__value instanceof Array) {
          for (var j = 0; j < item.__value.length; j++) {
            if (item.config.options[k].id == item.__value[j]
                || item.config.options[k].code == item.__value[j]) {
              item.config.options[k]["selected"] = "selected";
            }
          }
        } else {
          if (item.config.options[k].id == item.__value
              || item.config.options[k].code == item.__value) {
            item.config.options[k]["selected"] = "selected";
          }
        }
      }
    }
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