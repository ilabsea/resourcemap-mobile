$(function () {
  $(document).delegate('#page-map', 'pageshow', function () {
    if (App.isOnline())
      mapObject.render();
  });
});