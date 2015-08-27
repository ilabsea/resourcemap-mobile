persistence.defineMigration(2, {
  up: function() {
    this.addColumn('Site', 'start_entry_date', 'TEXT');
    this.addColumn('Site', 'end_entry_date', 'TEXT');
    
    this.action(function(tx, nextAction){
      Site.list(tx, function(sites){
        sites.forEach(function(site){
          site.start_entry_date = "";
          site.end_entry_date = "";
          persistence.add(site);
        });
        persistence.flush(tx, function() {
          nextAction();
        });
      });
    });
  }
});