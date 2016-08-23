FieldView = {
  displayNoFields: function (templateURL, element) {
    App.Template.process(templateURL, {}, function (content) {
      element.html(content);
      setTimeout(function () {
        Dialog.showDialog("page-pop-up-no-fields");
      }, 50);
      element.css("z-index", 200000);
    });
  },
  display: function (templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      FieldView.displayHierarchy(fieldData);
      element.trigger("create");
      FieldView.displayCalculationField(fieldData);

      DigitAllowance.prepareEventListenerOnKeyPress();
    });
  },
  displayCalculationField: function (fieldData) {
    var fieldCal = [];

    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (field) {
        if (field.kind === "calculation") {
          if (field.config.dependent_fields) {
            $.map(field.config.dependent_fields, function (dependent_field) {
              var e = "#" + dependent_field.id;
              $(e).addClass('calculation');
            });
          }
          fieldCal.push(field);
        }
      });
      App.DataStore.set('fields_cal', JSON.stringify(fieldCal));
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
      $.map(properties.fields, function (field) {
        if (field.kind === "hierarchy") {
          Hierarchy.renderDisplay(field.id, field.config);
          Hierarchy.selectedNode(field.id, field._selected);
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
