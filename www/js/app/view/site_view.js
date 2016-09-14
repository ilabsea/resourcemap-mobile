var SiteView = {
  display: function (element, siteData) {
    var content = App.Template.process("site_list", siteData)
    element.append(content);
    element.listview("refresh");
  },
  displayDefaultLayer: function (templateName, element, siteData) {
    var content = App.Template.process(templateName, siteData);
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
  displayError: function (templateName, element, fieldData) {
    var content = App.Template.process(templateName, fieldData);
    element.html(content);
    setTimeout(function () {
      Dialog.showDialog("page-error-submit-site");
    }, 50);
    element.css("z-index", 200000);
  },
  displaySiteListMenu: function(templateName, element, options){
    var content = App.Template.process(templateName, options)
    element.html(content);
    element.trigger("create");
  }
};
