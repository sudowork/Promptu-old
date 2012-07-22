$(document).ready(function () {
	var emailready = false,
		passready = false,
		passconfready = false,
		$signin = $('#signin'),
		$register = $('#register'),
		$finish = $('#finish'),
		$password = $('#password'),
		$passwordconf = $('#password-confirm');

	$('body').on('blur', '#email', function () {
		var $e = $(this),
			$p = $e.parents('.control-group'),
			email = $e.val();
		if (/^[_a-z0-9\-]+(\.[_a-z0-9\-]+)*@[a-z0-9\-]+(\.[a-z0-9\-]+)*(\.[a-z]{2,4})$/.test(email.toLowerCase())) {
			emailready = true;
			$p.removeClass('error');
		} else {
			emailready = false;
			$p.addClass('error');
		}
	}).on('blur', '#password', function () {
		var $e = $(this),
			password = $password.val(),
			$p = $e.parents('.control-group');
		if (password && password.length) {
			passready = true;
			$p.removeClass('error');
		} else {
			passready = false;
			$p.addClass('error');
		}

	}).on('blur', '#password-confirm', function () {
		var $e = $(this),
			password = $password.val(),
			$p = $e.parents('.control-group'),
			confirmation = $e.val();
		if (confirmation === password) {
			passconfready = true;
			$p.removeClass('error');
		} else {
			passconfready = false;
			$p.addClass('error');
		}
	}).on('click', '#register', function (e) {
		$signin.hide();
		$register.hide();
		$finish.show();
		$passwordconf.show();
		e.preventDefault();
	}).on('click', '#finish', function (e) {
		var email = $email.val(),
			password = $password.val();
		if (emailready && passconfready) {

		}
		e.preventDefault();
	}).on('click', '#signin', function (e) {
		var email = $('#email').val(),
			password = $('#password').val();
		if (emailready && passready) {
			$.post('http://192.168.1.116:3000/auth', {
				email: email,
				password: password
			}, function (data) {
				console.log(data);
			});
		}
		e.preventDefault();
	}).on('submit', '.form-vertical', function (e) {

	});
});