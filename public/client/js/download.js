$('#btn_getlink').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
    $.ajax({
        type:'POST',
        url: '/getlastversion',
        success: function(response, status, xhr, $form) {
            console.log(response);
            if (response.code == 200) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                if (response.result.version){
                    window.location.href = '/downloadfile';
                } else {
                    $('#noFileMessage').modal('show');
                }
            } else if (response.code == 403){
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                $('#noFileMessage').modal('show');
            } else {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            }
        },
        error: function(data){
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
        }
    });
});

$('#btn_ok').click(function(e) {
    e.preventDefault();
    $('#noFileMessage').modal('hide');
});