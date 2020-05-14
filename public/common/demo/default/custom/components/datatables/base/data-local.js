var DatatableDataLocalDemo={
    init:function(){
        var e,a,i;e=JSON.parse('[{"fullname":"test","email":"mytest1@gmail.com","created":"2018-01-15","expire_date":"2019-12-10"}]')
        ,a=$(".m_datatable").mDatatable({data:{type:"local",source:e,pageSize:10},
        layout:{theme:"default",class:"",scroll:!1,footer:!1},sortable:!0,pagination:!0,search:{input:$("#generalSearch")},columns:[{field:"RecordID",title:"#",width:50,sortable:!1,textAlign:"center",selector:{class:"m-checkbox--solid m-checkbox--brand"}}
        ,{field:"fullname",title:"Full Name"},{field:"email",title:"Email",responsive:{visible:"lg"}},
        {field:"created",title:"Created Date",type:"date",format:"MM/DD/YYYY"},{field:"expire_date",title:"Expired Date",type:"date",format:"MM/DD/YYYY"}]}),
        i=a.getDataSourceQuery(),
        $("#m_form_status").on("change",function(){a.search($(this).val(),"Status")}).val(void 0!==i.Status?i.Status:""),$("#m_form_type").on("change",function(){a.search($(this).val(),"Type")}).val(void 0!==i.Type?i.Type:""),$("#m_form_status, #m_form_type").selectpicker()}};
        jQuery(document).ready(function(){DatatableDataLocalDemo.init()});