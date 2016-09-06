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
    FieldView.displayCalcAndHierarchyField(fieldData);

    DigitAllowance.prepareEventListenerOnKeyPress();
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
