/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="common/makePy.js" />
/// <reference path="common.js" />
/// <reference path="common05.js" />
/// <reference path="common/capture.js" />
/// <reference path="jquery.treeTable.js" />

var member = member || window;

$(function(){
    if(ur.user().rank==1)
    {
        $('.toNew').click(function(){
            window.location="/agent.shtml";
        }).show();
    }
    else{
        $('.toNew').hide();
    }
if(ur.user().rank>1)
    {
        $('.toNew1').click(function(){
            window.location="/pos.shtml";
        }).show();
    }
    else{
        $('.toNew1').hide();
    }
if(ur.user().rank==0)
{	
	$('.toNew2').click(function(){
            window.location="/factory.shtml";
        }).show();
}
else{
        $('.toNew2').hide();
    }
})

member.mMarketing = (function () {
    var o = $.extend({}, gPaginationModel, { dv: null,
        tbl: 'member.marketing',
        fields: 'id,code,name,[desc],CONVERT(varchar(100), startdate, 23),CONVERT(varchar(100), enddate, 23),type,status',

    });
    var type={1:'送霜'};
    o.ini = function () {
        if (!this.dv) {
            this.dv = $('#dvMarketing');
            this.dv.find('.btnAdd').click(function () {
                mMarketingUpdate.show();
            });
            this.dv.find('.btnSearch').click(function () {
                o.search();
            });
            this.oTbl=this.dv.find('.table1');
            this.ini_after();
        }
    }
    o.fdata = function (a) {
        //id,code,name,[desc],startdate,enddate,type,status
        var c = [];
        c.push(td(a[1])); //
        c.push(td(a[2])); //
        c.push(td(a[3])); //
        c.push(td(a[4]+'~~'+a[5])); //
        c.push(td(type[a[6]])); //
        c.push(td(a[7]?'有效':'无效')); //
        c.push(td('')); //
        return tr(c.join(""), '_id="' + a[0] + '" DistrictCode="' + a[8] + '" rank="' + a[2] + '" code="' + a[1] + '"');
    }
    o.where = function () {
        return '';
    }
    return o;
})();

member.mMarketingUpdate = (function () {
    var o = { dv: null };
    o.ini = function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvMarketingUpdate');
        }
    }
    o.show = function (obj) {
        this.ini();
        gf.showSimple(obj, this.dv);
    }
    return o;
})();

member.mAgentSelector = (function () {
    var o = { dv: null, oTbl: null };
    o.ini = function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAgentSelector');
            this.oTbl = this.dv.find('.tblSelector');
//            this.dv.find('.icon_close').click(function () {
//                om.dv.fadeOut();
//            }).end().draggable({ handle: '.header_floatbox' });
        }
    };
    o.show = function (obj, selected) {
        this.ini();
        var om = this, c = [];
        gf.noPagination('up_member_getAgentTree', [ur.user().agentId], function (a) {
            for (var i = 0, b; b = a[i]; i++) {
                (function (a) {
                    var format = "<tr id={1} rank={4} class='{5}'><td><label data='{6}'>[{2}]{3}</label></td></tr>";
                    a[5] = (a[4] == a[5]) ? '' : ('child-of-' + a[0]);
                    a[2] = a[2] || '';
                    a[6] = JSON.stringify(a);
                    c.push(String.format.apply(null, [format].concat(a)));
                })(b)
            }
            om.oTbl.find('tbody').html(c.join(''));
            $(om.oTbl).treeTable({ indent: 19 });
            gf.showSimple(obj, om.dv);
        })
        this.oTbl.find('label').live('click', function () {
            selected ? selected(JSON.parse($(this).attr('data'))) : null;
            om.dv.fadeOut();
        }).end()
    };
    return o;
})();

member.mCode = (function () {
    var o = { dv: null };
    o.ini = function () {
        var om = this;
        this.dv = $('.dvcode').find(':button').click(function () {
            var btn = $(this);
            member.mAgentSelector.show(this, function (a) {
                var p=btn.prev().prev().text();
                btn.prev().val(p?a[2].split(p)[1]:a[2]);
            });
        });
    }
    return o;
})()

member.mDate = (function () {
    var o = { dv: null };
    o.ini = function () {
        $('.date :text').datepicker({ changeMonth: true, changeYear: true,dateFormat: "yy-mm-dd" });
    }
    return o;
})()

var objMain = { dv: null, tbl: null, pager: null, ps: 80, cpg: 0 }

member.mFloat = (function () {
    var o = { dv: null };
    o.ini = function () {
        var dv= $('.float_box').find('.icon_close').click(function () {
            dv.has(this).fadeOut();
        }).end().draggable({ handle: '.header_floatbox' });
    }
    return o;
})()

member.mYe = (function () { //代理商查看账户余额
    var o = $.extend(null, objMain, { tblMain: null });
    o.ini = function () {
        if (!this.dv) {
            if (ur.user().rank == 1) {
                $('#dvSide li[_index=16]').show();
            }
            this.dv = $('#dvYe');
            this.tbl = this.dv.find('.table1 tbody');
            this.dv.find('.btnSearch').click(function () {
                pgf.codeData('member.customer.ye', [ur.user().erpID], function (a) {
                    var trs = [];
                    for (var i = 0, b = []; b = a[i]; i++) {
                        trs.push(fdata(b));
                    }
                    o.tbl.html(trs.join(''));
                })
            });
            this.cmbAnalytic = this.dv.find('.cmbAnalytic');
            pgf.codeData('a-analytic', [], function (a) {
                fillAnalytic(a);
            });
        }
    }
    o.show = function () {

    }
    fillAnalytic = function (a) {
        var content = '<option data-discount="{3}" data-id="{0}" {2} value="{0}">{1}</option>', c = [], d=[];
        c.push(formatStr(content, ['', '', '', '']));
        for (var i = 0, b = []; b = a[i]; i++) {
            c.push(formatStr(content, b));
            d.push(b[0]);
        }
        c.push(formatStr(content, [d.join(','),'所有明细','selected']));
        o.cmbAnalytic.html(c.join(''));
    }
    var type = { 'invoice': '消费', 'voucher': '存入' };
    fdata = function (a) {
        //
        var c = [];
        c.push(td(type[a[0]])); //类型
        c.push(td(a[9])); //活动类型
        c.push(td(a[1])); //单号
        c.push(td(f.date(a[3]))); //日期
        c.push(td(a[5] || '')); //入账
        c.push(td(a[8]||'')); //赠送金额
        c.push(td(a[10])); //活动类型
        c.push(td(a[4])); //消费
        //c.push(td(f.date(a[6]))); //加入日期
        c.push(td(''));
        c.push(td(''));
        return tr(c.join(''));
    }

    return o;
})();

$(function () {
    member.mCode.ini();
    member.mDate.ini();
    member.mFloat.ini();
    member.mYe.ini();
})