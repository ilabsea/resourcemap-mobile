var CollectionHelper = {
  dataCollection: function (collection, userId, count, fromServer) {
    var item = {
      name: collection.name,
      description: collection.description,
      is_visible_location: collection.is_visible_location,
      is_visible_name: collection.is_visible_name,
      linkpagesite: "#page-site-list",
      user_id: userId,
    };

    item.idcollection = collection.idcollection || collection.id;
    item.displayCount = count == 0 ? "" : count;
    return item;
  }
};
