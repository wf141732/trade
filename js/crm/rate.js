/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="common.js" />

var urlHelp = "help/me/stockNone.htm";

$(function () {
    mCoRate.ini();
    iniTopMenu('CRM-供货商评审');
});

var mCoRate = $.extend({}, gPaginationModel, {
    fields: 'ID,全称,助记名,拼音码,库存真实性ID,星级,备注,主营数,web_site',
    tbl: 'co.vwCompany_rate',
    cmbArea: null,
    isNav: true,
    isEditDirty: true,
    ini: function () {
        var om = this;
        this.dv = $('#dvCoRate');
        this.oTbl = this.dv.find('table');
        this.bttnSearch = this.dv.find('.btnSearch');
        this.bttnSearch.click(function () { om.search(); });
        this.ini_after();
        this.cmbArea = this.dv.find('.cmbArea');
        gOption.option(this.cmbArea, 'up_option_coarea', ['-1'],'', { firstItem: ['', '全部'] });
        this.oTbl.find('tbody .stockdesc').live('blur', function () {
            if (G.aStockDesc[$(this).val()]) {
                $(this).attr('_id', $(this).val()).val(G.aStockDesc[$(this).val()]);
            }
        }).end().find('.btnAddMain').live('click', function () {
            mCompanyMain.show(this, $(this).parent().parent().attr('_id'), $(this).parent().parent().find('td:eq(1)').text());
        });

        this.dv.find('.btnSave').click(function () { // 更新
            var otr = om.getDirtyRows();
            var a = [], b = [], aId = [], o = null;
            otr.each(function () {
                $(this).find(':text').each(function (i) { b[i] = $(this).val(); });
                b[2] = $(this).find(':text:eq(2)').attr('_id');
                a.push(b);
                aId.push($(this).attr('_id'));
                b = [];
            });
            var btn = $(this).disable().val('正在保存');

            gf.updateBatch(aId, 'co.company', ['助记名', '拼音码', '库存真实性ID', '星级', '备注'], a, function () {
                btn.enable().val('保存');
                outputMsg('保存完毕');
            });
        });
        this.search();
    },
    fdata: function (a) {
        //ID,全称,助记名,拼音码,库存真实性ID,星级,备注,主营数,web_site
        var c = [];
        c.push(td(a[0]));
        c.push(td('<a target="_blank" href="details.aspx?id=' + a[0] + '" title="查看客户' + a[1] + '详细信息" class="external" >' + a[1] + '</a>'));  //全称
        c.push(td(f.text(a[2])));
        c.push(td(f.text(a[3])));
        c.push(td(f.text(G.aStockDesc[a[4]], '_id="' + a[4] + '" class="stockdesc"')));  //库存真实性ID
        c.push(td(f.text(a[5])));  //星级
        c.push(td('主营:' + a[7] + '<a href="javascript://" class="btnAddMain">添加</a>'));  // 主营数
        c.push(td(f.text(a[6], 'placeholder="输入简短评语"')));  // 备注
        c.push(td('点评'));
        return tr(c.join(""), '_id="' + a[0] + '"  onclick="selectRow(this);"');
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF.push('ID=r_r');
        aF.push("(全称 like '%r_r%')");
        aF.push("(助记名 like '%r_r%')");
        aF.push("(拼音码 like '%r_r%')");
        aF.push('库存真实性ID r_r');
        aF.push('星级r_r');
        aF.push("(areaID=r_r)");
        this.oTbl.find('thead').find(':text,select').each(function () { a.push($(this).val()); });
        a.push(this.cmbArea.val());
        return f.getWhere_root(aF, a);
    }
});