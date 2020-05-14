var showErrorMsg = function(form, type, msg) {
    var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert" style="margin-left:30px;margin-right:30px;margin-top:20px">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
    </div>');
    form.find('.alert').remove();
    alert.prependTo(form);
    mUtil.animateClass(alert[0], 'fadeIn animated');
    alert.find('span').html(msg);
}

$('#btn_add_app').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var form = $(this).closest('form');
    form.validate({
        rules: {
            name: {
                required: true,
            },
            version: {
                required: true
            },
            link: {
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
        url: '/admin/application_add',
        success: function(response, status, xhr, $form) {
            if (response.code == 403) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'The app of this version already exist.');
            } else if (response.code == 400) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
            } else if ( response.code == 200) {
                form.clearForm();
                form.validate().resetForm();
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'success', 'Add Success.');
            }
            // similate 30s delay
            // setTimeout(function() {
            //     btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            //     showErrorMsg(form, 'danger', 'Network not response. Please try again later.');
            // }, 30000);
        },
        error: function(data){
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
        }
    });
});
