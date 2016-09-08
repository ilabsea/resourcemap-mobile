SiteOffline = {
  limit: 5,
  sitePage: 0,
  add: function(data) {
    var collectionName = CollectionController.name;
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["collection_name"] = collectionName;
    siteParams["user_id"] = UserSession.getUser().id;
    siteParams["device_id"] = uuid.v1();
    siteParams["properties"] = JSON.stringify(siteParams.properties);
    siteParams["files"] = JSON.stringify(siteParams.files);
    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
  },
  fetchBySiteId: function(sId, callback) {
    Site.all().filter('id', "=", sId).one(null, callback);
  },

  fetchFieldsByUserId: function (userId, offset, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .list(null, callback)
        // .listFields(null, {name: "TEXT", collection_name: "TEXT", collection_id: "INT", created_at: "DATE"}, callback);
  },

  fetchFieldsByCollectionIdUserId: function (cId, userId, offset, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .list(null, callback)
        // .listFields(null, {name: "TEXT", created_at: "DATE"}, callback);
  },

  fetchOneByCollectionIdUserId: function (cId, userId, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .one(null, callback)
  },

  fetchOneByUserId: function (userId, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .one(null, callback);
  },
  deleteBySiteId: function(sId) {
    SiteOffline.fetchBySiteId(sId, function(site) {
      persistence.remove(site);
      persistence.flush();
      if (SiteController.form == 'update_offline'){
        App.redirectTo("#page-site-list");
      }
      else if(SiteController.form == 'update_offline_all'){
        App.redirectTo("#page-site-list-all");
      }
    });
  },
  countByCollectionIdUserId: function(idcollection, userId, callback) {
    Site.all()
        .filter('collection_id', "=", idcollection)
        .filter('user_id', '=', userId)
        .count(null, function(count) {
      callback(count);
    });
  },
  countByUserId: function(userId, callback) {
    Site.all().filter('user_id', "=", userId).count(null, function(count) {
      callback(count);
    });
  }
};
