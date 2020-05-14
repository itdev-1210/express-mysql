var showErrorMsg = function(form, type, msg) {
    var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert" style="margin-left:30px;margin-right:30px;margin-top:10px">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
    </div>');
    form.find('.alert').remove();
    alert.prependTo(form);
    mUtil.animateClass(alert[0], 'fadeIn animated');
    alert.find('span').html(msg);
};

$(document).ready(function() {
    $.ajax({
        url:'/getlastversion',
        type: 'POST',
        success: function(response) {
            if(response.code==200){
                document.getElementById("last_version").value = response.result.version;
            }
        },
        error: function(error){
            
        }
    });

    $('#uploadForm').submit(function() {
        var form = $(this);
        var btn = $("#btn_upload")
        form.validate({
            rules: {
                fileupload: {
                    required: true
                },
                file_version: {
                    required: true,
                },
            }
        });
        if (!form.valid()) {
            return false;
        }
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
            // type:'POST',
            // url: '/admin/upload',
            success: function(response, status, xhr, $form) {
                console.log(response);
                if (response.code == 200) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    // form.clearForm();
                    // form.validate().resetForm();
                    showErrorMsg(form, 'success', 'Upload Success');
                } else if(response.code == 403) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'This version already exist. Please try other.');
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
        return false;
   });    
});