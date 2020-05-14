var DatatableDataLocalDemo = {
    init:function() {
        var e,a,i,event_log;
        $.ajax({
            url:'/admin/geteventlog',
            type: 'POST',
            data: {eventid:getUrlParameter('eventid')},
            success: function(response) {
                event_log = response.result;
                e = event_log
                ,a=$(".m_data_event_log").mDatatable({data:{type:"local",source:e,pageSize:10},
                layout:{theme:"default",class:"",scroll:!1,footer:!1},sortable:!0,pagination:!0,search:{input:$("#eventSearch")},
                columns:[{field:"RecordID",title:"#",width:50,sortable:!1,textAlign:"center",selector:{class:"m-checkbox--solid m-checkbox--brand"}},
                {field:"eventid",title:"EventID", width:100},
                {field:"os",title:"OS",responsive:{visible:"lg"},width:100},
                {field:"os_build_version",title:"OS Build Version",responsive:{visible:"lg"},width:100},
                {field:"message",title:"Message",responsive:{visible:"lg"},width:400},
                {field:"username",title:"User Name",responsive:{visible:"lg"},width:100},
                {field:"created",title:"Date",type:"date",format:"MM/DD/YYYY"}]}),
                i=a.getDataSourceQuery(),
                $("#m_form_status").on("change",function(){a.search($(this).val(),"Status")}).val(void 0!==i.Status?i.Status:""),$("#m_form_type").on("change",function(){a.search($(this).val(),"Type")}).val(void 0!==i.Type?i.Type:""),$("#m_form_status, #m_form_type").selectpicker()
            },
            error: function(error){
                console.log(response);
            }
        });
        $.ajax({
            type:'POST',
            url: '/admin/event_detail',
            data:{eventid:getUrlParameter('eventid')},
            success: function(response, status, xhr, $form) {
                if (response.code == 200) {
                    document.getElementById("eventid").innerHTML=response.result.eventid;
                    document.getElementById("log_name").innerHTML=response.result.log_name;
                    document.getElementById("source").innerHTML=response.result.source;
                    document.getElementById("task_category").innerHTML=response.result.task_category;
                    document.getElementById("level").innerHTML=response.result.level;
                    document.getElementById("exampleTextarea").value=response.result.script;
                }
            }
        });
    }
};
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
$('#m_script_save').click(function(e) {
    e.preventDefault();
    var btn = $(this);
    var form = $(this).closest('form');
    btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
    form.ajaxSubmit({
        type:'POST',
        url: '/admin/updateeventscript',
        data: {eventid:getUrlParameter('eventid'),script:document.getElementById("exampleTextarea").value},
        success: function(response, status, xhr, $form) {
           if ( response.code == 200) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            }
        }
    });
});
jQuery(document).ready(function(){DatatableDataLocalDemo.init()});