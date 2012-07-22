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
    E.send(res, 'VALIDATION_EXCEPTION', {devices: params.devices});
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
