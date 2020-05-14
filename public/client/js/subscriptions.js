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
var subscriptions = function(type, btn, form){
    if(type=='monthly'){
        var email = $('#email_m').val();
        var card_number = $('#card_number_m').val();
        var expire_data = $('#expire_date_m').val();
        var cvc = $('#cvc_m').val();
    } else {
        var email = $('#email_y').val();
        var card_number = $('#card_number_y').val();
        var expire_data = $('#expire_date_y').val();
        var cvc = $('#cvc_y').val();
    }
    var exps = expire_data.split('/');
    // showErrorMsg(form, 'danger', 'Card is expired.'+type+cvc);
    // return;
    form.validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            card_number: {
                required: true
            },
            expire_date: {
                required: true
            },
            cvc: {
                required: true
            },
        }
    });
    if (!form.valid()) {
        return;
    }
    if (!Stripe.card.validateCardNumber(card_number)) {
        showErrorMsg(form, 'danger', 'Card Number is Invalid.');
        return;
    } else if (!Stripe.card.validateCVC(cvc)) {
        showErrorMsg(form, 'danger', 'CVC is Invalid.');
        return;
    } else if (!Stripe.card.validateExpiry(exps[0], exps[1])) {
        showErrorMsg(form, 'danger', 'Card is expired.');
        return;
    }
    btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
    Stripe.card.createToken({
        number:card_number,
        cvc:cvc,
        exp_month:exps[0],
        exp_year:exps[1],
        }, function(status, response) {
        // if there are errors, show them
        if (response.error) {
            showErrorMsg(form, 'danger', 'Invalid Card Infomation.');
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
        } else {
            form.ajaxSubmit({
                type:'POST',
                url: '/subscriptions',
                data: {
                    type: type,
                    tokenid: response.id
                },
                success: function(response, status, xhr, $form) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    if (response.code == 200) {
                        form.clearForm();
	                    form.validate().resetForm();
                        // showErrorMsg(form, 'success', 'Subscription created.');
                        window.location.href = '/download';
                    } else {
                        showErrorMsg(form, 'danger', 'Error Occures. Please try again later.');
                    } 
                },
                error: function(data){
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', '404 Error Occures. Please try again later.');
                }
            });
        }
      });
}
$(document).ready(function(){
    $('#card_number_m').mask('0000 0000 0000 0000');
    $('#expire_date_m').mask('00/00');
    $('#cvc_m').mask('0000');
    $('#card_number_y').mask('0000 0000 0000 0000');
    $('#expire_date_y').mask('00/00');
    $('#cvc_y').mask('0000');
    // Stripe.setPublishableKey('pk_test_bMu4AsQXXNvlzLY1oG9TdpBo');
    Stripe.setPublishableKey('pk_test_f1pqdjfJdCNgneQhc6QU2Ffk');
  });
  
$('#btn_monthly_subscription').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var form = $(this).closest('form');
    var type = 'monthly';
    subscriptions(type, btn, form);
});
$('#btn_yearly_subscription').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var form = $(this).closest('form');
    var type = 'yearly';
    subscriptions(type, btn, form);
});

$('#btn_download').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    window.location.href = '/download';
});