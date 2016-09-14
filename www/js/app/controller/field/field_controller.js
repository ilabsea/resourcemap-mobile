FieldController = {
  hasFields: false, //use to detect if collection has fields
  activeLayer: null,
  submitted: false,
  layers: [],
  site: { properties: {}, files: {} },
  reset: function(){
    this.activeLayer = null
    this.layers = []
    this.submited = false
    this.site = { properties: {}, files: {} }
    this.isOnline = true
  },

  renderNewSiteForm: function () {
    this.reset();
    if(App.isOnline())
      FieldOnlineController.renderNewSiteForm();
    else
      FieldOfflineController.renderNewSiteForm();
  },

  layerExpandFields: function($layerNode) {
    if(this.activeLayer) {
      var layerChanged = $layerNode.attr('data-id') != this.activeLayer.attr('data-id')
      if(layerChanged) {
        this.removeLayerContent(this.activeLayer);
        this.renderLayerNode($layerNode);
      }else{
        var layer = this.findLayerById($layerNode.attr('data-id'))
        $.each(layer.fields, function(_, field){
          var $fieldUI = $("#" + field.id)
          if(field.kind == "photo" || field.kind == 'select_one' || field.kind == 'select_many')
            field.invalid ?  $fieldUI.parent().addClass("error") : $fieldUI.parent().removeClass("error")
          else
            field.invalid ?  $fieldUI.addClass("error") : $fieldUI.removeClass("error")
        })
      }
    }
    else{
      this.renderLayerNode($layerNode);
    }
  },

  renderLayerNode: function($layerNode) {
    var layerId = $layerNode.attr('data-id');
    var $layerNodeBody = $layerNode.find(".ui-collapsible-content")
    var layer = this.findLayerById(layerId);

    this.activeLayer = $layerNode;
    this.renderLayer(layer, $layerNodeBody);

  },

  findLayerById: function(layerId) {
    for(var i=0; i<this.layers.length; i++){
      if(this.layers[i].layer_id == layerId)
        return this.layers[i];
    }
  },

  renderLayer: function(layer, $layerNodeContent){
    var content = App.Template.process('layer_fields', {fields: layer.fields});
    $layerNodeContent.html(content);

    $.each(layer.fields, function(_, field){
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

      if(field.kind == "numeric")
        DigitAllowance.prepareEventListenerOnKeyPress();

      $layerNodeContent.enhanceWithin();

      if(field.kind == 'select_one' || field.kind == 'select_many'){
        var $fieldUI = $("#" + field.id);
        field.invalid ?  $fieldUI.parent().addClass("error") : $fieldUI.parent().removeClass("error")
      }
    })
  },

  removeLayerContent: function($layerNode){
    $layerNode.find(".ui-collapsible-content").html("")
  },

  layerCollapseFields: function(){
    if(this.activeLayer){
      this.storeOldLayerFields(this.activeLayer);
      var layer = this.findLayerById(this.activeLayer.attr('data-id'));
      this.validateLayer(layer);
    }
  },

  storeOldLayerFields: function($layerNode){
    var layer = this.findLayerById($layerNode.attr('data-id'));

    $.each(layer.fields, function(i, field) {
      var value = FieldController.getFieldValueFromUI(field.id);
      FieldHelper.setFieldValue(field, value, App.isOnline());
    })
  },

  getFieldValueFromUI: function(fieldId) {
    var $field = $('#' + fieldId);
    if($field.length == 0)
      return '';

    if ($field[0].tagName.toLowerCase() == 'img') {
      return $field.attr('src');
    }

    if ($field.attr("type") == 'date')
      return $field.val();

    var value = $field.hasClass("tree") ? $field.tree('getSelectedNode').id : $field.val();
    return  value == null ? "" : value;
  },

  validateLayers: function(){
    this.closeLayer();
    var valid = true
    for(var i=0; i < this.layers.length; i++) {
      var layerValid = FieldController.validateLayer(this.layers[i]);
      if(layerValid == false)
        valid = false
    }
    return valid;
  },

  closeLayer: function() {
    if(this.activeLayer)
      this.activeLayer.collapsible( "collapse" )
  },

  validateLayer: function(layer){
    layer.valid = true
    for(var i=0; i<layer.fields.length; i++){
      var validField = FieldController.validateField(layer.fields[i]);
      if(!validField)
        layer.valid = false
    }
    var $layerNode = $("#collapsable_" + layer.layer_id);
    layer.valid ? $layerNode.removeClass("error") : $layerNode.addClass("error")
    return layer.valid;
  },

  validateField: function(field){
    if(field.kind == 'email' && field.__value) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(field.__value)){
        field.invalid = 'error'
        return false;
      }
      else {
        field.invalid = ''
        return true;
      }
    }

    if(field.required==""){
      field.invalid = '';
      return true
    }

    if(!field.__value){
      field.invalid = 'error'
      return false;
    }

    if(field.kind == 'numeric' && field.config && field.config.range) {
      if(field.__value >= field.config.range.minimum && field.__value <=field.config.range.maximum ){
        field.invalid = ''
        return true;
      }
      else {
        field.invalid = 'error'
        return false;
      }
    }
    field.invalid = ''
    return true;
  },

  synByCollectionId: function (cId, newLayers) {
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      FieldOffline.update(layers,newLayers);
    });
  },

  showNearbyOptions: function (id, isFocus) {
    var offset = Location.pageID[id] * Location.limit;
    var $ul = $("#autocomplete_" + id);
    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var field = this.findFieldById(id);
    var config = field.config;
    var locationOptions = LocationHelper.getLocations(lat, lng, config);

    if (offset == 0)
      $ul.html("");

    if ((offset == 0 && isFocus) || (offset != 0 && !isFocus)) {
      var hasMoreLocation = false;
      if (Location.limit + offset < locationOptions.length) {
        hasMoreLocation = true;
      }
      config.locationOptions = locationOptions.slice(offset, Location.limit + offset);

      FieldView.displayLocationField("field_location", $ul,
          {hasMoreLocation: hasMoreLocation, config: config});
    }
  },

  handleLayerMembership: function(){
    var uId = UserSession.getUser().id;
    $.each(this.layers, function (_ , layer) {
      LayerMembershipOffline.fetchByUserLayerId(uId, layer.layer_id, function(layermembership){
        FieldView.displayUiDisabled(layermembership);
      });
    });
  },

  params: function(){
    var properties = {};
    var files = {};
    this.layers.forEach(function(layer){
      $.each(layer.fields, function(_, field){
        if(field.__value){
          if(field.kind == 'photo'){
            if(field.__filename){
              properties[field.id] = field.__filename;
              files[field.__filename] = SiteCamera.dataWithoutMimeType(field.__value);
            }
            else
              properties[field.id] = FieldHelper.imageWithoutPath(field.__value);
          }else
            properties[field.id] = field.__value;
        }else
          properties[field.id] = field.__value;
      })
    });
    return {properties: properties, files: files};
  },

  findFieldById: function(idfield) {
    for(var i=0; i<this.layers.length; i++) {
      for(var j=0; j<this.layers[i].fields.length; j++){
        if(this.layers[i].fields[j].id == idfield)
          return this.layers[i].fields[j];
      }
    }
    return null;
  }
};
