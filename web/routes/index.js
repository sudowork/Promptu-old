
/*
 * GET home page.
 */

var render = function (res, page, ctx) {
  res.render('index', _.extend(app.get('config'), ctx));
};

exports.index = function (req, res) {
  render(res, 'index', { title: 'Express' });
};