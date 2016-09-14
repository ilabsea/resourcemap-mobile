FieldView = {
  displayNoFields: function (templateName, element) {
    var content = App.Template.process(templateName, {});
    element.html(content);
    setTimeout(function () {
      Dialog.showDialog("page-pop-up-no-fields");
    }, 50);
    element.css("z-index", 200000);
  },
  display: function (templateName, element, fieldData) {
    var content = App.Template.process(templateName, fieldData);
    element.html(content);
    element.trigger("create");
  },
  displayLocationField: function (templateName, element, configData) {
    var content = App.Template.process(templateName, configData);
    element.append(content);
    element.removeClass("ui-screen-hidden");
    element.listview("refresh");
    element.trigger("updatelayout");
  },
  displayLayerMenu: function (templateName, element, layers_collection) {
    var content = App.Template.process(templateName, layers_collection);
    element.html(content);
    element.trigger("create");
  },
  displayUiDisabled: function (layermembership) {
    if (layermembership) {
      if (!layermembership.write()) {
        var ele = "collapsable_" + layermembership.layer_id();
        $($("#" + ele).children()[1]).addClass("ui-disabled");
      }
    }
  }
};
