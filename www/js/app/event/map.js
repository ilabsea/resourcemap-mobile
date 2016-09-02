$(function () {
  $(document).delegate('#page-map', 'pageshow', function () {
    if (App.isOnline()) {
      mapObject.render();
      $(window).on('resize', function () {
        if ($.mobile.activePage.is("#page-map"))
          mapObject.setHeightContent();
      });
    }
  });
});