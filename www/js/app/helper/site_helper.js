var SiteHelper = {
  buildSubmitError: function (error, site) {
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
      lat: error["lat"],
      lng: error["lng"],
      name: site["name"],
      properties: error["properties"],
      errorProperties: p
    };
    return result;
  }
};
