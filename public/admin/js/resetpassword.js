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
$('#btn_to_login').click(function(e) {
    e.preventDefault();
    window.location.href = '/admin/login';
});
$('#btn_update_password').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var form = $(this).closest('form');
    form.validate({
        rules: {
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
        url: '/admin/updatepassword',
        success: function(response, status, xhr, $form) {
            console.log(response);
            if (response.code == 200) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'success', 'updated your password successfully!');
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