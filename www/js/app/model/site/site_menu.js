SiteMenu = {
  menu: function () {
    App.emptyHTML();
    var cId = CollectionController.id;
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();
    switch (value) {
      case "1":
        SiteController.getAllByCollectionId(cId);
        break;
      case "3":
        SiteOfflineController.getByCollectionId(cId);
        $("#btn_sendToServer").show();
        break;
      case "2":
        SiteOnlineController.getByCollectionId(cId);
        break;
      case "4":
        SessionController.logout();
    }
  }
};
