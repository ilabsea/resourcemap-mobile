var SiteView = {
  display: function (element, siteData) {
    App.Template.process("site/list.html", siteData, function (content) {
      element.append(content);
      element.listview("refresh");
    });
  },
  displayDefaultLayer: function (templateURL, element, siteData) {
    App.Template.process(templateURL, siteData, function (content) {
      element.html(content);
      element.trigger("create");
      InvisibleLayer.invisibleNameLatLng("wrapper_site_location", "wrapper_site_name", function () {
        requireReload(function () {
          var lat = $("#lat").val();
          var lng = $("#lng").val();
          if (lat == "" && lng == "" && SiteController.form == 'new') {
            LocationHelper.getCurrentLocation();
          }
        });
      });
    });
  },
  displayBtnSubmit: function (templateURL,element, btnData) {
    App.Template.process(templateURL, btnData, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayError: function (templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      setTimeout(function () {
        Dialog.showDialog("page-error-submit-site");
      }, 50);
      element.css("z-index", 200000);
    });
  }
};