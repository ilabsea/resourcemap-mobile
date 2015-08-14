var mapObject = {
  map: null,
  marker: null,
  heightMapCanvas: "",
  setHeightContent: function () {
    var $content = $("#map_canvas");
    var mapCanvasTop = $content.offset().top;
    this.heightMapCanvas = $(window).height() - mapCanvasTop;
    $content.height(this.heightMapCanvas);
    if (this.map) {
      this.map.setCenter(this.getLatLng());
      google.maps.event.trigger(map_canvas, 'resize');
    }
  },
  render: function () {
    this.setHeightContent();
    if (this.map == null) {
      this.loadMap();
    }
    else {
      this.setMarker(this.getLatLng());
    }
  },
  setMarker: function (location) {
    _self = this;
    if (this.marker) {
      this.marker.setPosition(location);
    }
    else {
      this.marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: location,
        draggable: true,
        map: _self.map
      });
    }
    var point = this.marker.getPosition();
    this.map.panTo(point);
    google.maps.event.trigger(map_canvas, 'resize');
  },
  getLatLng: function () {
    var lat = $("#lat").val();
    var lng = $("#lng").val();
    this.setMarkLatLng(lat, lng);
    var latlng = new google.maps.LatLng(lat, lng);
    return latlng;
  },
  loadMap: function () {
    var $content = $("#map_canvas");
    var mapCanvas = $content[0];
    var longpress = false;
    var start;

    var mapCanvasTop = $content.offset().top;
    $content.height(window.innerHeight - mapCanvasTop);

    var options = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(mapCanvas, options);

    this.setMarker(this.getLatLng());
    _self = this;

    google.maps.event.addListener(_self.marker, 'dragend', function () {
      var point = _self.marker.getPosition();
      var lat = point.lat();
      var lng = point.lng();
      mapObject.setLatLngToElement(lat, lng);
      _self.map.panTo(point);
    });

    google.maps.event.addListener(this.map, 'mousedown', function () {
      $content.find('*').addClass('needsclick');
      start = new Date().getTime();
    });

    google.maps.event.addListener(this.map, 'mouseup', function () {
      var end = new Date().getTime();
      longpress = (end - start < 800) ? false : true;
    });

    google.maps.event.addListener(this.map, 'click', function (event) {
      if (longpress) {
        var point = event.latLng;
        var lat = point.lat();
        var lng = point.lng();

        mapObject.setMarker(event.latLng);
        mapObject.setLatLngToElement(lat, lng);
      }
    });
    google.maps.event.trigger(map_canvas, 'resize');
  },
  setLatLngToElement: function (lat, lng) {
    $("#lat").val(lat);
    $("#lng").val(lng);
    $("#mark_lat").val(lat);
    $("#mark_lng").val(lng);
  },
  setMarkLatLng: function (lat, lng) {
    $("#mark_lat").val(lat);
    $("#mark_lng").val(lng);
  }
};