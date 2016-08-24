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
      element.trigger("create");
      FieldView.displayCalcAndHierarchyField(fieldData);

      DigitAllowance.prepareEventListenerOnKeyPress();
    });
  },
  displayCalcAndHierarchyField: function (fieldData) {
    $.each(fieldData.field_collections, function (_, properties) {
      $.each(properties.fields, function (_, field) {
        if (field.kind === "hierarchy") {
          Hierarchy.renderDisplay(field.id, field.config);
          Hierarchy.selectedNode(field.id, field._selected);
        }

        if (field.kind == "calculation" && field.config.dependent_fields) {
          $.each(field.config.dependent_fields, function (_, dependentField) {
            var $dependentField = $("#" + dependentField.id)
            $dependentField.addClass('calculation');
            var calculationIds = $dependentField.attr('data-calculation-ids') || "";
            calculationIds = calculationIds ? calculationIds.split(',') : [];
            calculationIds.push(field.id);
            $dependentField.attr('data-calculation-ids', calculationIds.join(","));
          });
        }
      });
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
  displayUiDisabled: function (layermembership) {
    if (layermembership) {
      if (!layermembership.write()) {
        var ele = "collapsable_" + layermembership.layer_id();
        $($("#" + ele).children()[1]).addClass("ui-disabled");
      }
    }
  }
};
