$(document).ready(function () {
	if (sessionStorage['promptutoken']) {
		window.location = '/#';
	}
	var register = false,
		$signin = $('#signin'),
		$register = $('#register'),
		$finish = $('#finish'),
		$email = $('#email'),
		$emailcontainer = $('.email-container'),
		$password = $('#password'),
		$passwordcontainer = $('.password-container'),
		$passwordconf = $('#password-confirm'),
		$alert = $('.alert');

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
	}).on('click', '.close', function (e) {
		$alert.hide();
	}).on('submit', '.form-vertical', function (e) {
		var email = $email.val(),
			validemail = checkEmail(email),
			password = $password.val(),
			passwordconf = $passwordconf.val();
		if (!validemail) {
			$emailcontainer.addClass('error');
			$alert.find('p').html('Invalid Email!').show();
		} else if (!password) {
			$alert.find('p').html('Invalid Password!').show();
			$passwordcontainer.addClass('error');
		} else if (register && password != passwordconf) {
			$alert.find('p').html('Passwords don\'t match').show();
			$passwordcontainer.addClass('error');
		} else {
			var auth = function () {
				$.ajax({
					url: 'http://promptuapp.com/auth',
					type: 'post',
					data: {
						email: email,
						password: password
					},
					success: function (data) {
						if (data && data.token) {
							var authtoken = Sha1.hash(data.token + secret);
							window.location = '/#login/' + authtoken;
						}
					},
					error: function (data) {
						$alert.find('p').html('Invalid Credentials! Please try again').show();
					}
				});
			};

			if (register) {
				$.ajax({
					url: 'http://promptuapp.com/signup',
					type: 'post',
					data: {
						email: email,
						password: password
					},
					success: function (data) {
						auth();
					},
					error: function (data) {
						$alert.find('p').html('Invalid Credentials! Please try again').show();
					}
				});
			} else {
				auth();
			}
		}
		e.preventDefault();
	});
});