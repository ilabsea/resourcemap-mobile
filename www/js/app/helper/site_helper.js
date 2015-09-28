var SiteHelper = {
  buildDataForSite: function () {
    var name = $('#name').val();
    var lat = $('#lat').val();
    var lng = $('#lng').val();
    var properties = {};
    var files = {};
    var layers = LayerController.get();
    layers.forEach(function(layer){
      layer.fields().forEach(function(field){
        var idfield = field.idfield;
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
            properties[idfield] = SearchList.getFieldValue(idfield);
            break;
          case "location":
            if ($field.val() == "")
              value = "";
            else
              value = $node.attr('data-code');
            properties[idfield] = value;
            break;
          default:
            var data = $field.val();
            if (data == null)
              data = "";
            properties[idfield] = data;
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
  buildSubmitError: function (error, site, state) {
    var p = [];
    if (error.properties) {
      $.map(error.properties, function (error) {
        $.each(error, function (key, err) {
          p.push({msg: err, id: key});
        });
      });
    }
    var result = {
      isLat: error["lat"] ? true : false,
      isLng: error["lng"] ? true : false,
      isSubmitSites: state,
      lat: error["lat"],
      lng: error["lng"],
      name: site["name"],
      properties: error["properties"],
      errorProperties: p
    };
    return result;
  },
  resetForm: function () {
    PhotoList.clear();
    SearchList.clear();
    App.DataStore.clearAllSiteFormData();
    $('#form_site')[0].reset();
    App.redirectTo("#page-site-list");
  }
};