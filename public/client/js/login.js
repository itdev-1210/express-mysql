
var SnippetLogin = function() {
    var login = $('#m_login');
    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        mUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    $('#m_new_account').click(function(e) {
        e.preventDefault();
        $('#signinModal').modal('hide');
        $('#signupModal').modal('show');
    });
    $('#m_to_signin1').click(function(e) {
        e.preventDefault();
        $('#signupModal').modal('hide');
        $('#signinModal').modal('show');
    });
    $('#m_to_signin2').click(function(e) {
        e.preventDefault();
        $('#forgetpassModal').modal('hide');
        $('#signinModal').modal('show');
    });
    $('#m_login_forget_password').click(function(e) {
        e.preventDefault();
        $('#signinModal').modal('hide');
        $('#forgetpassModal').modal('show');
    });
    $('#btn_get_started').click(function(e) {
        e.preventDefault();
        $('#signinModal').modal('show');
    });
    $('#m_login_signin_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');
        form.validate({
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                }
            }
        });
        if (!form.valid()) {
            return;
        }
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
            type:'POST',
            url: '/login',
            success: function(response, status, xhr, $form) {
                if (response.code == 401) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
                } else if (response.code == 400) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
                } else if ( response.code == 200) {
                    if(response.result.expired){
                        window.location.href = '/download';
                    } else {
                        window.location.href = '/subscription';
                    }
                }
            },
            error: function(data){
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
            }
        });
    });
    $('#btn_forgetpassword_request').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');
        var email = $('#email').val();
        form.validate({
            rules: {
                email: {
                    required: true,
                    email: true
                }
            }
        });
        if (!form.valid()) {
            return;
        }
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
            type:'POST',
            url: '/userbyemail',
            success: function(response, status, xhr, $form) {
                if (response.code == 403) { // Email exist
                    $.ajax({
                        url:'/forgot',
                        type: 'POST',
                        data: {email:email},
                        success: function(response) {
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                            if(response.code==200){
                                showErrorMsg(form, 'success', 'An e-mail has been sent to ' + response.result + ' with further instructions.');
                            }else {
                                showErrorMsg(form, 'danger', 'Error Occures with'+ response.result +'. Please try again later.');
                            }
                        },
                        error: function(error){
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                            showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
                        }
                    });
                } else {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'This Email no Exist.');
                }
            },
            error: function(data){
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
            }
        });
    });

    $('#m_login_signup_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');
        form.validate({
            rules: {
                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                },
                rpassword: {
                    required: true
                },
            }
        });
        if (!form.valid()) {
            return;
        }
        if (form.find('[name=password]').val() != form.find('[name=rpassword]').val()) {
            showErrorMsg(form, 'danger', 'Password not matched. Please try again.');
            return;
        }
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
            type:'POST',
            url: '/signup',
            success: function(response, status, xhr, $form) {
                console.log(response);
                if (response.code == 200) {
                    showErrorMsg(form, 'success', 'Thank you. To complete your registration.');
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();
                } else if(response.code == 403) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Email already exist. Please try other.');
                } else {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
                }
            },
            error: function(data){
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
            }
        });
    });

    $('#btn_change_password').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
            rules: {
                old_password: {
                    required: true
                },
                new_password: {
                    required: true
                },
                new_rpassword: {
                    required: true
                },
            }
        });
        if (!form.valid()) {
            return;
        }
        if (form.find('[name=new_password]').val() != form.find('[name=new_rpassword]').val()) {
            showErrorMsg(form, 'danger', 'Password not matched. Please try again.');
            return;
        }
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
            type:'POST',
            url: '/changepassword',
            success: function(response, status, xhr, $form) {
                console.log(response);
                if (response.code == 200) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'success', 'Changed your password successfully!');
                } else if(response.code == 405) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Old password is incorrect. Please try other.');
                } else {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
                }
            },
            error: function(data){
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
            }
        });
    });

    //== Public Functions
    return {
        // public functions
        init: function() {
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetLogin.init();
});

$('#btn_download').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    window.location.href = '/download';
});


