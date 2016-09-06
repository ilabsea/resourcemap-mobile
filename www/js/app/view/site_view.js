var SiteView = {
  display: function (element, siteData) {
    var content = App.Template.process("site_list", siteData)
    element.append(content);
    element.listview("refresh");
  },
  displayDefaultLayer: function (templateURL, element, siteData) {
    var content = App.Template.process(templateURL, siteData);
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
  },
  displayBtnSubmit: function (templateURL,element, btnData) {
    var content = App.Template.process(templateURL, btnData);
    element.html(content);
    element.trigger("create");
  },
  displayError: function (templateURL, element, fieldData) {
    var content = App.Template.process(templateURL, fieldData);
    element.html(content);
    setTimeout(function () {
      Dialog.showDialog("page-error-submit-site");
    }, 50);
    element.css("z-index", 200000);
  },
  displaySiteListMenu: function(templateURL, element, options){
    var content = App.Template.process(templateURL, options)
    element.html(content);
    element.trigger("create");
  }
};
