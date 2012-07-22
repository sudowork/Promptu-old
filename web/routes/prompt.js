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
  var prompt = new Models.Prompt(_.extend({}, params, {updated: Date.now()}));
  prompt.save(function (err) {
    if (err) {
      E.send(res, 'VALIDATION_EXCEPTION', err.errors);
    } else {
      res.send(201);
    }
  });
}
