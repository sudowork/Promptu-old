$(document).ready(function () {
	var register = false,
		$signin = $('#signin'),
		$register = $('#register'),
		$finish = $('#finish'),
		$email = $('#email'),
		$emailcontainer = $('.email-container'),
		$password = $('#password'),
		$passwordcontainer = $('.password-container'),
		$passwordconf = $('#password-confirm');

	var checkEmail = function (email) {
		return (/^[_a-z0-9\-]+(\.[_a-z0-9\-]+)*@[a-z0-9\-]+(\.[a-z0-9\-]+)*(\.[a-z]{2,4})$/).test(email.toLowerCase());
	};

	$('body').on('blur', '#email', function () {
		if (checkEmail($email.val())) {
			$emailcontainer.removeClass('error');
		} else {
			$emailcontainer.addClass('error');
		}
	}).on('blur', '#password', function () {
		var password = $password.val();
		if (password && password.length) {
			$passwordcontainer.removeClass('error');
		} else {
			$passwordcontainer.addClass('error');
		}
	}).on('click', '#register', function (e) {
		$signin.hide();
		$register.hide();
		$finish.show();
		$passwordconf.show();
		register = true;
		e.preventDefault();
	}).on('submit', '.form-vertical', function (e) {
		var email = $email.val(),
			validemail = checkEmail(email),
			password = $password.val(),
			passwordconf = $passwordconf.val();
		if (!validemail) {
			$emailcontainer.addClass('error');
		} else if (!password || (register && password !== passwordconf)) {
			$password.addClass('error');
		} else {
			if (register) {
				console.log('register');
			} else {
				$.post('http://192.168.1.116:3000/auth', {
					email: email,
					password: password
				}, function (data) {
					if (data && data.token) {
						var authtoken = Sha1(data.token + secret);
						window.location = '/#login/' + authtoken;
					}
				});
			}
		}
		e.preventDefault();
	});
});