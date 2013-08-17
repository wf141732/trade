/// <reference path="../jquery.aac.js" />
/// <reference path="../jquery-1.6.2.js" />

$(function () {
    gMenu.ini();
});

$.extend(gMenu, {
    index: 0,
    dvs: null,
    ini: function () {
        this.dvs = $('.target');
        this.index = gf.queryValue('i');
        if (!this.index) this.index = 0;
        this.addMenu('管理员');
        this.crrnt.page = 'admin/admin.aspx';
        this.subClick(this.index);
    },
    action: function (index, obj) {
        var om = this;
        if (index < 21) {
            this.dvs.hide().eq(index).show();
        }
        if (index == 0) {
            mErrLog.ini();
        } else if (index == 1) {
            mRobot.ini();
        } else if (index == 2) {
            mRefurbishFactory.ini();
        } else if (index == 3) {
            mPhoneNumber.ini();
        }
    }
});


var mPhoneNumber = $.extend({}, gPaginationModel, {
    fields: 'ID,CC,AC,号码,类型ID,类型EN',
    tbl: 'co.vw号码',
    isEditDirty: true,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvPhoneNumber .numlst');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch');
            this.bttnSearch.click(function () { om.search(); });
            this.ini_after();
            this.dv.find('.btnUpdate').click(function () { // 批量更新
                om.oTbl.find('tbody>tr.dirty').each(function () {
                    om.save_line_($(this));
                });
            });
            this.search();
        }
    },
    search_done: function () {
        var o = this.oTbl.find('tbody');
        o.find('tr').dblclick(function () {
            var id = $(this).attr('_id');
            var o = $(this).find(':text');
            var tr = $(this);
            gf.getOneLineSqlPara('AC IS NOT NULL and 号码ID=' + id, 'CC,AC', 'co.vw联系方式4', function (a) {
                o.eq(0).val(a[0]);
                o.eq(1).val(a[1]);
                tr.addClass('dirty');
            });
        });
    },
    fdata: function (a) {
        //id,CC,AC,号码,类型ID
        var ac = [];
        ac[0] = td(f.text(a[1], 'class="cc"'), 'class="' + a[5] + ' type"');   // 国家代号
        ac[1] = td(f.text(a[2], 'class="ac"'));  // 区号
        ac[2] = td(f.text(a[3]));  // 号码
        ac[3] = td('<input type="button" value="保存" onclick="mPhoneNumber.save_line(this);" title="保存本条修改" /><input class="notclone" type="button" value="+" onclick="mPhoneNumber.splitLine(this);" title="拆分号码，几个号码连在一起的要拆分开" /><input class="notclone" type="button" value="联系人" onclick="mPhoneNumber.show_contact(this);" />');
        return tr(ac.join(""), '_id="' + a[0] + '" typeid="' + a[4] + '"');
    },
    splitLine: function (obj) {
        // 从上面copy一条下来
        var tr = $(obj).parent().parent();
        var o = tr.clone();
        o.addClass('clone').find('.notclone').remove();
        tr.after(o);
    },
    save_line: function (obj) {
        var tr = $(obj).parent().parent();
        this.save_line_(tr);
        $(obj).disable();
    },
    save_line_: function (tr) {
        var a = [];
        tr.find(':text').each(function (i) {
            a[i + 1] = $(this).val();
        });
        a[0] = tr.attr('_id');
        if (tr.hasClass('clone')) {
            a[4] = $(tr).attr('typeid');
            gf.callProc_with_value('up_co_split_number', a, function (v) {
                outputMsg('更新成功！');
                tr.removeClass('clone');
            });
        } else {
            gf.callProc_with_value('up_co_update_number2', a, function (v) {
                outputMsg('更新成功！');
            });
        }
    },
    show_contact: function (obj) {// 显示添加该号码的联系人和联系人所在公司
        var id = $(obj).parent().parent().attr('_id');
        $(obj).disable();
        gf.noPaginationSqlPara('号码ID=' + id, 'coid asc', '联系人,公司名,地区', 'co.vw联系方式4', function (a) {
            if (a.length > 0) {
                var b = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    a[i] = '<li><b class="contact">' + b[0] + '</b><b class="company">' + b[1] + '</b><b class="area">' + b[2] + '</b></li>';
                }
            } else a[0] = '<li>未对应任何联系人</li>';
            $('#dvPhoneNumber .ulcontacts').html(a.join(''));
        });
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF[0] = "类型ID<6";
        aF[1] = "号码 like 'r_r%'";
        a[0] = '1';
        a[1] = this.dv.find('.txtNum').val();
        return f.getWhere_root(aF, a);
    }
});



var mRefurbishFactory = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvRefurbishFactory');
            gf.noPagination('up_co_get_refurbishFactory', [], function () {
                for (var i = 0; i < a.length; i++) {
                    //ID,公司名,负责人,电话,备注
                    var c = [];
                    c.push(td('<a href="company.aspx?id=' + a[0] + '" target="_blank">' + a[0] + '</a>'));
                    c.push(td(a[1]));  //TrueName
                    c.push(td(a[2]));
                    a[i] = tr(c.join(""), '_id="' + a[0] + '"');
                }
                om.dv.find('tbody').html(a.join(''));
            });
        }
    }
}

var mRobot = $.extend({}, gPaginationModel, {
    fields: 'ID,L日期,名称,网站ID,状态,型号计数,记录计数,控制位,备注名,间隔',
    tbl: 'robot.vwhandler',
    anet: ['', 'ICNET', '华强', '中发'],
    astate: [],
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.astate['0'] = '离线';
            this.astate['1'] = '在线,未开始抓取';
            this.astate['20'] = '开始,未检测到型号';
            this.astate['21'] = '正在抓取';
            this.dv = $('#dvRobots');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch').click(function () {
                om.search();
            });
            this.ini_after();
            this.search();
        }
    },
    fdata: function (a) {
        //ID,L日期,名称,网站ID,状态,型号计数,记录计数,控制位,备注名,间隔
        var ac = [];
        ac[0] = td(a[1]); //L日期
        ac[1] = td(a[2]); //名称
        ac[2] = td(this.anet[a[3]]); //网站ID
        ac[3] = td(this.astate[a[4]]); //状态
        ac[4] = td(a[5]); //型号计数
        ac[5] = td(a[6]); //记录计数
        ac[6] = td(a[7]); //控制位
        ac[7] = td(a[8]); //备注名
        ac[8] = td(a[9]); //间隔
        return tr(ac.join(""), '_id="' + a[0] + '"  ');
    },
    where: function () {
        // 获取查询子句
        var a = [], aF = [];
        this.dv.find('thead')
        aF[0] = "(型号 like 'r_r%')";
        aF[1] = "(库存ID=r_r)";
        return f.getWhere_root(aF, a);
    }
});



var mErrLog = $.extend({}, gPaginationModel, {
    fields: 'ID,内容,来源,作者,助记名,日期,uID,公司ID',
    tbl: 'vw错误报告',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvErrLog');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch').click(function () {
                om.search();
            });

            this.ini_after();
            this.dv.find('.btnDel').click(function () {
                if (confirm("真的要删除查询条件 " + om.where())) {
                    gf.execSql('delete from 错误报告 where ' + om.where(), function () {
                        alert("删除完毕！");
                    });
                }
            }).end().find('.btnClear').click(function () {
                if (confirm("次操作将清空所有错误日志，真的要清空吗")) {
                    gf.execSql("truncate table 错误报告", function () { outputMsg("错误日志已清空"); });
                }
            });

            gAuto.comember(this.oTbl.find('thead .txtCompany'));
            gAuto.colleague(this.oTbl.find('thead .txtUser'));

            this.oTbl.find('tbody .author').live('click', function () {
                om.oTbl.find('thead .txtUser').attr('_id', $(this).attr('uid')).val($(this).text());
                om.search();
            }).end().find('tbody .company').live('click', function () {
                om.oTbl.find('thead .txtCompany').attr('_id', $(this).attr('coid')).val($(this).text());
                om.search();
            }).end().find('tbody .del').live('click', function () {
                var btn = $(this);
                gf.execSql('delete from 错误报告 where ID=' + $(this).parent().attr('_id'), function () {
                    outputMsg("删除完毕！");
                    $(btn).parent().remove();
                });
            });
            this.search();
        }
    },
    fdata: function (a) {
        //ID,内容,来源,作者,助记名,日期
        var ac = [];
        ac[0] = td(a[1]); //内容
        ac[1] = td(a[2]); //来源
        ac[2] = td('<a href="javascript://" class="author" uid="' + a[6] + '">' + a[3] + '</a>'); // 作者
        ac[3] = td('<a href="javascript://" class="company" coid="' + a[7] + '">' + a[4] + '</a>'); // 助记名
        ac[4] = td(f.date(a[5]));
        ac[5] = td('', 'class="del"');
        return tr(ac.join(''), '_id="' + a[0] + '"');
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF[0] = "(内容 like 'r_r%')";
        aF[1] = "(来源 like 'r_r%')";
        aF[2] = "(uID=r_r)";
        aF[3] = "(公司ID=r_r)";
        var o = this.oTbl.find('thead :text');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        a.push(o.eq(2).attr('_id'));
        a.push(o.eq(3).attr('_id'));
        return getWhere_root(aF, a);
    }
});



