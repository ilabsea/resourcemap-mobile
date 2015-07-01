FieldView = {
  displayDefaultLayer: function (templateURL, element, data) {
    App.Template.process(templateURL, data, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayUpdateDefaultLayer: function (templateURL, element, siteUpdateData) {
    App.Template.process(templateURL, siteUpdateData, function (content) {
      element.html(content);
      element.trigger("create");
      InvisibleLayer.invisibleNameLatLng("wrapSiteLocation",
          "wrapSiteName", function () {
          });
    });
  },
  display: function (templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      FieldView.displayHierarchy(fieldData);
      element.trigger("create");
      FieldView.displayUiDisabled(fieldData);
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
  displayLayerMenu: function (path, element, layers_collection) {
    App.Template.process(path, layers_collection, function (content) {
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
  displayUiDisabled: function (fieldData) {
    $.map(fieldData.field_collections, function (properties) {
      if (properties.layer_membership) {
        if (!properties.layer_membership.write) {
          var ele = "collapsable_" + properties.layer_membership.layer_id;
          $($("#" + ele).children()[1]).addClass("ui-disabled");
        }
      }
    });
  }
};