var FieldImpl = function(field){
  // field = {"id": 1, ...}
  this.id = field.id;
  this.name = field.name;
  this.code = field.code;
  this.kind = field.kind;
  this.config = field.config;
  this.is_mandatory = field.is_mandatory;
  this.is_display_field = field.is_display_field;
  this.is_enable_field_logic = field.is_enable_field_logic;
  this.readonly = this.kind == "calculation" ? "readonly" : "";
  this.required = this.is_mandatory ? "required" : "";
  this.widgetType = (function(kind){
    kinds = {"phone": "input", "text": "input", "email":"input", "calculation": "input",
             "site": "search", "user": "search", "location": "nearby"}
    return kinds[kind] || kind;
  })(this.kind);

  this.type = (function(kind){
    kinds = {"numeric" : "tel", "phone": "tel", "calculation":"text"}
    return kinds[kind] || kind;
  })(this.kind);

  this.invisible = !field.is_display_field && field.kind == 'calculation' ? "invisible-div" : "" ;
  this.__value = "";
  this.__filename = "";
}

FieldImpl.prototype.parseValue = function(config, value){
  if (config && config.allows_decimals == "true"
      && config.digits_precision && !isNaN(parseFloat(value))) {
    value = parseInt(value * Math.pow(10, parseInt(config.digits_precision)))
               / Math.pow(10, parseInt(config.digits_precision));
  }
  return value;
}

FieldImpl.prototype._buildConfig = function(){
  if(this.kind == "yes_no")
    return this._buildConfigYesNo();
  else if(this.kind == "select_one")
    return this._buildConfigSelectOne();
  else if(this.kind == "hierarchy")
    return Hierarchy.generateField(this.config)
  else
    return this.config;
},

FieldImpl.prototype._buildConfigYesNo = function(){
  var field_logics = this.config ? this.config.field_logics : "";
  config = { options: [{id: 0, label: "NO", code: "1", field_id: field_logics ? field_logics[0].field_id : "" },
                       {id: 1, label: "YES", code: "2", field_id: field_logics ? field_logics[1].field_id : ""}]
  };
  return config;
}

FieldImpl.prototype._buildConfigSelectOne = function(){
  var config = this.config;
  $.each(config.options, function (_ ,option) {
    if (config.field_logics) {
      $.each(config.field_logics, function (_, fieldLogic) {
        if (option.id === fieldLogic.value && !option["field_id"])
          option["field_id"] = fieldLogic.field_id;
      });
    }
  });

  return config;
}
