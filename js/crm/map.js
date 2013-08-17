/// <reference path="../jquery.aac.js" />
/// <reference path="../jquery-1.3.2-vsdoc2.js" />

var urlHelp = "help/me/stockNone.htm";
var sets = null;
var atag = ['不常用', '常用'];
var _gtips_cu = null;
$(function () {
    sets = {
        fSearch: "ID,公司名,对应名,coid,频率",
        tblSearch: "co.vwcompany_map",
        oTbl: $("#main"),
        enterSearchBody: $("#main thead"),
        operateRight: 10,
        sort: new u_sort('公司名', 'asc')
    };

    $.aac.searchDone = function () {
        gAuto.co($('#main tbody :text'));
    }


    gIniCom_new(sets, { crrnt_menu: 'CRM-对应' });
});

function getWhere() {
    // 获取查询子句
    var aF = [], a = [];
    $('#main thead tr:eq(0)').find(':text').each(function (i) { a[i] = $(this).val(); });
    a[2] = $('#cmb1 option:selected').val();
    aF[0] = "公司名 like 'r_r%'";
    aF[1] = "对应名 like 'r_r%'";
    aF[2] = "(coid r_r)";
    return f.getWhere_root(aF, a);
}

function getRowWithData(a) {
    //ID,公司名,对应名,coid,频率
    var ac = [];
    ac[0] = td(a[1]);  // 公司名
    ac[1] = fCompany(a[3], a[2]);  // 对应名
    ac[2] = td(f.text(a[2], '_id="' + a[3] + '" _id2="' + a[0] + '"'));
    ac[3] = td(a[4]);
    return tr(ac.join(""), '_id="' + a[0] + '"');
}

function fCompany(id,name) {
    var s = '<a target="_blank" href="details.aspx?id=' + id + '" title="查看客户' + name + '详细信息" class="external" >' +name + '</a>';
    return td(s);
}