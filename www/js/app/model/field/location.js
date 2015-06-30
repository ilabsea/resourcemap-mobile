var Location = {
  limit: 2,
  page: 0
};

var LocationList = {
  locations: [],
  add: function (location) {
    LocationList.remove(location.id);
    LocationList.locations.push(location);
  },
  remove: function (code) {
    for (var i = 0; i < LocationList.count(); i++) {
      var location = LocationList.get()[i];
      if (location.code === code) {
        return LocationList.locations.splice(i, 1);
      }
    }
  },
  getSite: function (code) {
    for (var i = 0; i < LocationList.count(); i++) {
      var location = LocationList.get()[i];
      if (location.code == code) {
        return location;
      }
    }
  },
  get: function () {
    return LocationList.locations;
  },
  clear: function () {
    LocationList.locations = [];
  },
  count: function () {
    return LocationList.locations.length;
  }
};

function LocationObj(code, name) {
  this.code = code;
  this.name = name;
}