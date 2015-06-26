var Location = {
  limit: 2,
  page: 0,
  config: "",
  setConfig: function(config){
    Location.config(config);
  },
  getConfig: function(){
    return Location.config;
  }
};