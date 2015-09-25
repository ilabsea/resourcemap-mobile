var LayerController = {
  layers: [],
  set: function(layers){
    LayerController.layers = layers;
  },
  get: function(){
    return LayerController.layers;
  },
  handleLayerMembership: function(){
    var uId = SessionHelper.currentUser().id;
    LayerController.layers.forEach(function (layer) {
      LayerMembershipOffline.fetchByUserLayerId(uId, layer.id_wrapper(), function(layermembership){
        FieldView.displayUiDisabled(layermembership);
      });
    });
  }
};
