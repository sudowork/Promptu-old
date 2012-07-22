var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Mixed = Schema.Types.ObjectId;

/**
 * Mixins
 */
function toLower (v) {
  return v.toLowerCase();
}

/**
 * Custom Validators
 */
function permissionsValidator(v) {
  // enumeration of all possible permissions
  var permissionTypes = ['read', 'write', 'modify'];
  _(v).each(function (p) {
    if (!_(permissionTypes).include(p)) return false;
  });
  return true;
}

/**
 * User Schemas
 */
var DeviceSchema = new Schema(
  {
      _id: ObjectId
    , uuid: {type: String, index: true, required: true}
    , token: {type: String, index: true, required: true}
  }
  , {strict: true}
);

var UserSchema = new Schema(
  {
      _id:           ObjectId
    , email:         {type:    String, index:  {unique:  true}, required: true,
                      set: toLower, validate: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/}
    , password:      {type:    String, index:  true, required: true}
    , name:          {type:    String, index:  true}
    , phone:         {type:    String, index:  true}
    , devices:       [DeviceSchema]
    , preferences:   Mixed
    , grous:         Mixed
    , confirmed:     Boolean
    , needsreset:    Boolean
    , updated:       {type:    Date, required: true, index:    true}
    , session:       String
    , sessionExp:    Date
  }
  , {strict: true}
);

/**
 * Group Schemas
 */
var MemberSchema = new Schema(
  {
      _id:          ObjectId
    , user:         {type:    ObjectId, ref:       'User', required:  true}
    , permissions:  {type:    [String], required:  true, default:     ['read'], validate:  permissionsValidator}
  }
  , {strict: true}
)

var GroupSchema = new Schema(
  {
      _id:         ObjectId
    , path:        {type:    String,   index:        true}
    , name:        {type:    String,   index:        true, required:  true}
    , desc:        {type:    String}
    , owner:       {type:    ObjectId, ref:          'User', index:   true, required:         true}
    , members:     {type:    [MemberSchema], index:  true}
    , visibility:  {type:    String, index:          true, enum:      ['public', 'private']}
    , updated:     {type:    Date, required: true, index:            true}
  }
  , {strict: true}
);

/**
 * Prompt Schemas
 */
var PromptSchema = new Schema(
  {
      _id:         ObjectId
    , group:       {type:    ObjectId, ref:     'Group', required:                        true, index:  true}
    , author:      {type:    ObjectId, ref:     'User', required:                         true, index:  true}
    , original:    {type:    ObjectId, ref:     'Prompt', required:                       true, index:  true}
    , header:      {type:    String, required:  true}
    , body:        String
    , priority:    Number
    , tags:        {type:    [String], index:   true}
    , expiration:  {type:    Date, index:       true}
    , sendtime:    {type:    Date, index:       true}
    , due:         {type:    Date, index:       true}
    , sent:        {type:    Boolean, index:    true}
    , type:        {type:    String, enum:      ['original', 'edit', 'reminder'], index:  true}
    , updated:     {type:    Date, required:    true, index:                              true}
  }
  , {strict: true}
);

module.exports = {
  User: mongoose.model('User', UserSchema),
  Device: mongoose.model('Device', DeviceSchema),
  Member: mongoose.model('Member', MemberSchema),
  Group: mongoose.model('Group', GroupSchema),
  Prompt: mongoose.model('Prompt', PromptSchema)
}

