FieldController = {
  hasFields: false, //use to detect if collection has fields 
  getByCollectionId: function () {
    var site = {fromServer: App.isOnline(), onUpdate: false};
    if(App.isOnline()){
      FieldOnlineController.renderByCollectionId(site);
    }else{
      FieldOfflineController.renderByCollectionId(site);
    }
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
  }
};