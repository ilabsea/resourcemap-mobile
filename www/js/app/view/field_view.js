FieldView = {
  display: function (templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      FieldView.displayHierarchy(fieldData);
      element.trigger("create");
      
      DigitAllowance.prepareEventListenerOnKeyPress();
    });
  },
  displayLocationField: function (templateURL, element, configData) {
    App.Template.process(templateURL, configData, function (content) {
      element.append(content);
      element.removeClass("ui-screen-hidden");
      element.listview("refresh");
      element.trigger("updatelayout");
    });
  },
  displayLayerMenu: function (templateURL, element, layers_collection) {
    App.Template.process(templateURL, layers_collection, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayHierarchy: function (fieldData) {
    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
        if (fieldsInside.kind === "hierarchy") {
          var data = fieldsInside.configHierarchy;
          var id = fieldsInside.idfield;
          Hierarchy.renderDisplay(id, data);
          Hierarchy.selectedNode(id, fieldsInside._selected);
        }
      });
    });
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