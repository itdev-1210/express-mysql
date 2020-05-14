var DatatableDataLocalDemo={
    init:function() {
        var e,a,i,event_data;
        $.ajax({
            url:'/admin/getevents',
            type: 'POST',
            data: {eventtype:2},
            success: function(response) {
                event_data = response.result;
                e=event_data
                ,a=$(".m_data_events").mDatatable({data:{type:"local",source:e,pageSize:10},
                layout:{theme:"default",class:"",scroll:!1,footer:!1},sortable:!0,pagination:!0,search:{input:$("#generalSearch")},columns:[{field:"RecordID",title:"#",width:50,sortable:!1,textAlign:"center",selector:{class:"m-checkbox--solid m-checkbox--brand"}},
                {field:"eventid",title:"EventID"},
                {field:"log_name",title:"Log Name",responsive:{visible:"lg"}},
                {field:"source",title:"Source",responsive:{visible:"lg"}},
                {field:"level",title:"Level",responsive:{visible:"lg"}},
                {field:"task_category",title:"Task Category",responsive:{visible:"lg"}},
                {field:"script",title:"Script",responsive:{visible:"lg"}}]}),
                i=a.getDataSourceQuery(),
                $("#m_form_status").on("change",function(){a.search($(this).val(),"Status")}).val(void 0!==i.Status?i.Status:""),$("#m_form_type").on("change",function(){a.search($(this).val(),"Type")}).val(void 0!==i.Type?i.Type:""),$("#m_form_status, #m_form_type").selectpicker()
            },
            error: function(error){
                console.log(response);
            }
        });
    }
};

$(".m_data_events").on('click', 'tr', function() {
    if($(this).find('td:eq(1)').find('span').text()){
        window.location.href = '/admin/event_detail?eventid='+$(this).find('td:eq(1)').find('span').text();
        console.log($(this).find('td:eq(1)').find('span').text());
    }
});
jQuery(document).ready(function(){DatatableDataLocalDemo.init()});