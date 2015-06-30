FieldController = {
  getByCollectionId: function () {
    if (App.isOnline())
      FieldOnlineController.renderByCollectionId();
    else
      FieldOfflineController.renderByCollectionId();
  },
  synForCurrentCollection: function (newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },
  updateFieldValueBySiteId: function (propertiesFile, field, fromServer) {
    var pf = propertiesFile;
    var itemLayer = fromServer ? FieldHelper.buildField(field, {fromServer: fromServer}, "") :
        FieldHelper.buildField(field._data, {fromServer: fromServer}, "");

    var items = itemLayer.fields;
    $.map(items, function (item) {
      switch (item.widgetType) {
        case "photo":
          FieldController.updateFieldPhotoValue(item, propertiesFile, fromServer);
          break;
        case "date":
          FieldController.updateFieldDateValue(item, propertiesFile);
          break;
        case "hierarchy":
          FieldController.updateFieldHierarchy(item, propertiesFile);
          break;
        case "number":
          FieldController.updateFieldNumberValue(item, propertiesFile);
          break;
        case 'search':
          FieldController.updateFieldSearchValue(item, propertiesFile);
          break;
        case 'location':
          FieldController.updateFieldLocationValue(item, propertiesFile);
          break;
        default:
          FieldController.updateFieldDefaultValue(item, propertiesFile);
      }
    });
    return pf;
  },
  updateFieldLocationValue: function (item, propertiesFile) {
    var $node = $("#" + item["idfield"]);
    var value = $node.attr('data-code');
    if (value == null)
      value = "";
    propertiesFile.properties[item["idfield"]] = value;

  },
  updateFieldSearchValue: function (item, propertiesFile) {
    propertiesFile.properties[item["idfield"]] = SearchList.getFieldValue(item["idfield"]);
  },
  updateFieldDefaultValue: function ( item, propertiesFile) {
    var $node = $("#" + item["idfield"]);
    var value = $node.val();
    if (value == null)
      value = "";
    propertiesFile.properties[item["idfield"]] = value;
  },
  updateFieldPhotoValue: function (item, propertiesFile, fromServer) {
    var idfield = item["idfield"];
    var lPhotoList = PhotoList.count();

    if (fromServer) {
      var sId = App.DataStore.get('sId');
      var filePath = App.DataStore.get(sId + "_" + item["idfield"]);
      propertiesFile.properties[idfield] = filePath;
    }

    for (var i = 0; i < lPhotoList; i++) {
      if (PhotoList.getPhotos()[i].id == idfield) {
        var fileName = PhotoList.getPhotos()[i].name;
        propertiesFile.properties[idfield] = fileName;
        propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
        break;
      }
    }
  },
  updateFieldHierarchy: function (item, propertiesFile) {
    var $node = $("#" + item["idfield"]);
    var node = $node.tree('getSelectedNode');
    var data = node.id;
    if (data == null)
      data = "";
    propertiesFile.properties[item["idfield"]] = data;
  },
  updateFieldDateValue: function (item, propertiesFile) {
    var $node = $("#" + item["idfield"]);
    var value = $node.val();
    if (value != "") {
      value = new Date(value);
      value = dateToParam(value);
    }
    propertiesFile.properties[item["idfield"]] = value;
  },
  updateFieldNumberValue: function (item, propertiesFile) {
    var config = JSON.parse(App.DataStore.get("configNumber_" + item["idfield"]));
    var $node = $("#" + item["idfield"]);
    var value = $node.val();
    if (config.digits_precision) {
      value = parseInt(value * Math.pow(10, parseInt(config.digits_precision)))
          / Math.pow(10, parseInt(config.digits_precision));
    }
    propertiesFile.properties[item["idfield"]] = value;
  },
  renderLocationField: function (textLat, textLng, id, isFocus) {
    var offset = Location.page * Location.limit;
    var $ul = $("#autocomplete_" + id);
    var lat = $(textLat).val();
    var lng = $(textLng).val();
    var config = JSON.parse(App.DataStore.get("configLocations_" + id));
    var locationOptions = LocationHelper.getLocations(lat, lng, config);

    if (offset == 0 || (offset != 0 && !isFocus)) {
      var hasMoreLocation = false;
      if (Location.limit + offset < locationOptions.length) {
        hasMoreLocation = true;
      }
      config.locationOptions = locationOptions.slice(offset, Location.limit + offset);
      FieldView.displayLocationField("field/location.html", $ul,
          {hasMoreLocation: hasMoreLocation, config: config});
    }
  }
};