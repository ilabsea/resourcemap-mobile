$(function() {
  $.xhrPool = [];
  $.xhrPool.abortAll = function() {
    $(this).each(function(i, jqXHR) {   
        jqXHR.abort();  
        $.xhrPool.splice(i, 1); 
    });
  }
  $.ajaxSetup({
    beforeSend: function(jqXHR) { $.xhrPool.push(jqXHR); }, 
    complete: function(jqXHR) {
      var i = $.xhrPool.indexOf(jqXHR);   
      if (i > -1) $.xhrPool.splice(i, 1); 
    }
  });
});