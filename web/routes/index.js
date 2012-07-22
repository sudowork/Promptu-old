
/*
 * GET home page.
 */

var render = function (res, page, ctx) {
  res.render(page, _.extend(app.get('config'), ctx));
};

exports.index = function (req, res) {
  render(res, 'index', { title: 'Promptu App' });
};

exports.login = function (req, res) {
	render(res, 'login', { title: 'Promptu App' });
};