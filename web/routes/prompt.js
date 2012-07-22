/**
 * POST /prompt/create
 */
exports.createPrompt = function (req, res) {
  var params = req.body;
  params = _(params).pick(
    'group',
    'author',
    'original',
    'header',
    'body',
    'priority',
    'attachment',
    'tags',
    'channels',
    'expiration',
    'sendtime',
    'duedate',
    'sent',
    'type'
  );
  // Convert times from seconds to milliseconds
  if (exists(params.duedate)) params.duedate = params.duedate*1000;
  if (exists(params.sendtime)) params.sendtime = params.sendtime*1000;
  if (exists(params.expiration)) params.expiration = params.expiration*1000;

  // Convert stringified arrays into arrays
  try {
    params.channels = JSON.parse(params.channels);
    if (exists(params.tags)) params.tags = JSON.parse(params.tags);
  } catch (err) {
    E.send(res, 'VALIDATION_EXCEPTION', params);
    return false;
  }
  var prompt = new Models.Prompt(_.extend({}, params, {updated: Date.now()}));
  prompt.save(function (err) {
    if (err) {
      E.send(res, 'VALIDATION_EXCEPTION', err.errors);
    } else {
      res.send(201);
    }
  });
}

/**
 * GET /prompt/sync
 */
exports.syncPrompts = function (req, res) {
  var userId = req.session.userId
    , userGroups = req.session.userGroups;
  // find all possible ancestor groups that user is a member of
  var ancestors = _.chain(userGroups)
    .map(function (group) {
      if (_.isEmpty(group.path)) {
        return [group._id];
      } else {
        return _.union([group._id], group.path.split(','));
      }
    })
    .flatten()
    .uniq()
    .value();
  Models.Prompt.find(
    {group: {$in: ancestors}
  }, function (err, prompts) {
    if (err) { E.sendE(res, err); return; }
    res.json(prompts);
  });
}
