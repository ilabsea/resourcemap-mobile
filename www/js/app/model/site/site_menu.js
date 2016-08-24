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
        SiteOfflineController.getByCollectionId();
        $("#btn_sendToServer").show();
        break;
      case "2":
        SiteOnlineController.getByCollectionId();
        break;
      case "4":
        SessionController.logout();
    }
  }
};
