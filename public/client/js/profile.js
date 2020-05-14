$('#btn_download').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    window.location.href = '/download';
});

$('#btn_ok').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    window.location.href = '/dashboard';
});

$(document).ready(function(){
    $.ajax({
        url:'/getsubscriptioninfo',
        type: 'POST',
        success: function(response) {
            if(response.code==200){
                var card_number = response.result.card_number;
                card_number = card_number.substr(0,4) + " **** **** " + card_number.substr(15,4);
                document.getElementById("payment").innerHTML=card_number;
            }
        },
        error: function(error){
            window.location.href = '/download';
        }
    });
});