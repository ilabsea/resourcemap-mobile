function createTables() {
  Collection = persistence.define('collections', {
    idcollection: "INT",
    name: "TEXT",
    description: "TEXT",
    is_visible_location: "BOOL",
    is_visible_name: "BOOL",
    user_id: "INT"
  });

  User = persistence.define('users', {
    email: "TEXT",
    password: "TEXT"
  });

  Site = persistence.define('sites', {
    idsite: "INT",
    name: "TEXT",
    lat: "INT",
    lng: "INT",
    created_at: "DATE",
    collection_id: "INT",
    collection_name: "TEXT",
    user_id: "INT",
    device_id: "TEXT",
    properties: "JSON",
    files: "JSON"
  });

  Field = persistence.define('fields', {
    collection_id: "INT",
    user_id: "INT",
    name_wrapper: "TEXT",
    id_wrapper: "INT",
    fields: "JSON"
  });

  LayerMembership = persistence.define('layer_memberships', {
    collection_id: "INT",
    user_id: "INT",
    user_offline_id: "INT",
    layer_id: "INT",
    read: "BOOL",
    write: "BOOL"
  });

  Membership = persistence.define('memberships', {
    collection_id: "INT",
    user_id: "INT",
    user_email: "TEXT",
    admin: "BOOL"
  });
}