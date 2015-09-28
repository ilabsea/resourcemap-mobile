FieldController = {
  getByCollectionId: function () {
    var site = {fromServer : App.isOnline()};
    FieldOfflineController.renderByCollectionId(site);
  },
  synForCurrentCollection: function (cId, newFields) {
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },
  // updateFieldPhotoValue: function (item, propertiesFile, fromServer) {
  //   var idfield = item["idfield"];
  //   var lPhotoList = PhotoList.count();

  //   if (fromServer) {
  //     var sId = App.DataStore.get('sId');
  //     var filePath = App.DataStore.get(sId + "_" + item["idfield"]);
  //     propertiesFile.properties[idfield] = filePath;
  //   }

  //   for (var i = 0; i < lPhotoList; i++) {
  //     if (PhotoList.getPhotos()[i].id == idfield) {
  //       var fileName = PhotoList.getPhotos()[i].name;
  //       propertiesFile.properties[idfield] = fileName;
  //       propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
  //       break;
  //     }
  //   }
  // },
  renderLocationField: function (textLat, textLng, id, isFocus) {
    var offset = Location.pageID[id] * Location.limit;
    var $ul = $("#autocomplete_" + id);
    var lat = $(textLat).val();
    var lng = $(textLng).val();
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
  }
};