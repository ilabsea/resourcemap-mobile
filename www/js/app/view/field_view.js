FieldView = {
  display: function (templateURL, element, elementPrefixID, fieldData, update) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      FieldView.displayHierarchy(elementPrefixID, fieldData, update);

      element.trigger("create");
      FieldView.displayUiDisabled(elementPrefixID, fieldData);
    });
  },
  displayLocationField: function (templateURL, element, configData) {
    App.Template.process(templateURL, configData, function (content) {
      element.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
      element.listview("refresh");
      element.append(content);
      App.log("content : ", content);
      element.removeClass("ui-screen-hidden");
      element.listview("refresh");
      element.trigger("updatelayout");
    });
  },
  displayLayerMenu: function (path, element, layers_collection, current_page) {
    layers_collection.field_collections.current_page = current_page;
    App.Template.process(path, layers_collection, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayHierarchy: function (elementPrefixID, fieldData, update) {
    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
        if (fieldsInside.kind === "hierarchy") {
          var data = fieldsInside.configHierarchy;
          var id = fieldsInside.idfield;
          Hierarchy.renderDisplay(elementPrefixID + id, data);
          if (update)
            Hierarchy.selectedNode(elementPrefixID + id, fieldsInside._selected);
        }
      });
    });
  },
  displayUiDisabled: function (element, fieldData) {
    $.map(fieldData.field_collections, function (properties) {
      if (properties.layer_membership) {
        if (!properties.layer_membership.write) {
          var ele = "collapsable_" + element + properties.layer_membership.layer_id;
          $($("#" + ele).children()[1]).addClass("ui-disabled");
        }
      }
    });
  }
};