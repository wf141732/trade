/// <reference path="../jquery.aac.js" />
/// <reference path="../jquery-1.7.1.min.js" />

$(function () {
    gMenu.ini();
});

$.extend(gMenu, {
    dvs: null,
    ini: function () {
        this.dvs = $('.target');
        gMenu.crrnt.page = 'crm/crm.aspx';
        gMenu.addMenu('CRM');
        var index = gf.queryValue('i');
        if (!index) index = 0;
        gMenu.subClick(index);
    },
    action: function (index) {
        var om = this;
        this.dvs.hide().eq(index).show();
        if (index == 0) {//我司的客户
            mCoOfMyCompany.ini();
            mCoOfMyCompany.type = '0';
            mQuote.type = '0';
            mCoOfMyCompany.search();
        } else if (index == 1) {//我的联系人
            mMyContacts.ini();
        } else if (index == 2) {// 公司池
            mCoPool.ini();
        } else if (index == 3) {//拼音码
            mCoPoolPy.ini();
        } else if (index == 4) {//评审
            mCoRate.ini();
        }
    }
});


var mMyContacts = $.extend({}, {// 我的
    fields: 'ID,gender,nickname,comName,note,groupname,isCus,isSu,isFavorite,isMember,CREATION_DATE,conId,iGroupId',
    tbl: 'co.icontact_v',
    oTbl: null,
    groupId: '',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvMyContact');
            this.oTbl = this.dv.find('table');
            this.dv.find('.btnAddMyContact').click(function () {
                mAddMyContact.show(this);
            }).end().find('.btnAddMyGroup').click(function () {
                gf.callProc('up_co_update_iGroup', [ur.user().id, '-1', om.dv.find('.txtGroupName').val()], function () {
                    outputMsg('添加成功');
                    om.iniGroup();
                });
            });
            this.oTbl.find('tbody .setbit a').live('click', function () {
                var a = [];
                a.push(ur.user().id);
                a.push($(this).parent().parent().attr('_id'));
                a.push($(this).parent().attr('_type'));
                a.push($(this).attr('_val'));
                var btn=$(this).text('...');
                gf.callProc('up_co_set_icocntact_bit', a, function () {
                    outputMsg('设定成功');
                });
            });
            this.iniGroup();
        }
    },
    iniGroup: function () {
        var om = this;
        // 初始化组
        gf.noPagination('up_co_get_igroups', [ur.user().id], function (a) { 6
            //ID,name,memberCnt,note
            var b = [];
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                a[i] = '<li _id="' + b[0] + '">' + b[1] + '(' + b[2] + ')</li>';
            }
            om.dv.find('.igroup').html(a.join('')).find('li').click(function () {
                om.groupId = $(this).attr('_id');
                $(this).parent().find('.on').removeClass('on').end().end().addClass('on');
                om.search();
            });
        });
    },
    search: function () {
        var om = this;
        gf.noPaginationSqlPara(this.where(), 'iGroupId asc', this.fields, this.tbl, function (a) {
            if (a.length > 0) {
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    a[i] = om.fdata(a[i]);
                }
                om.oTbl.find('tbody').html(a.join(''));
            } else {
                gf.outputMsgInTbl('该分组未添加联系人', om.oTbl);
            }
        });
    },
    fdata: function (a) {
        var c = [];
        //ID,gender,nickname,comName,note,groupname,isCus,isSu,isFavorite,isMember,CREATION_DATE,conId,CREATED_BY,iGroupId
        c.push(td(f.checkbox()));
        c.push(td(a[2])); // 昵称
        c.push(td(a[3]));  //公司
        c.push(td(a[11]));  //帐号
        c.push(td(a[4]));  //备注
        c.push(td(a[5]));  //分组
        c.push(td(a[6] ? '<a href="javascript://" title="点击取消" _val="0">是</>' : '<a href="javascript://" title="点击设定为客户" _val="1">设定</a>', '_type="0" class="setbit"'));  //客户
        c.push(td(a[7] ? '<a href="javascript://" title="点击取消" _val="0">是</>' : '<a href="javascript://" title="点击设定为供货商" _val="1">设定</a>', '_type="1" class="setbit"'));  //供货商
        c.push(td(a[8] ? '<a href="javascript://" title="点击取消收藏" _val="0">已收藏</>' : '<a href="javascript://" title="点击加入我的收藏夹" _val="1">收藏</a>', '_type="2" class="setbit"'));  //收藏
        c.push(td(a[9] == 0 ? '' : '是'));  //会员
        c.push(td(f._date(a[10])));  //添加日期
        return tr(c.join(""), '_id="' + a[0] + '" coid="' + a[1] + '" mycompanyid="' + a[2] + '" onclick="selectRow(this);"');
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF.push('CREATED_BY=r_r');
        aF.push('iGroupId=r_r');
        a.push(ur.user().id);
        a.push(this.groupId);
        return f.getWhere_root(aF, a);
    }
});

var mAddMyContact = {
    dv: null,
    dvCompanylst: null,
    dvContactlst: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAddMyContact');
            this.dvContactlst = this.dv.find('.contactlst');
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().draggable({ cancel: '.body' });
            this.dvCompanylst = this.dv.find('.companylst');
            this.dvCompanylst.find('tbody tr').live('click', function () {
                om.searchCon($(this).attr('_id'), '');
            }).end().find('.btnSearch').click(function () {
                om.searchCom();
            }).end().find('.spn_type a').click(function () {
                if ($(this).attr('_val') == '1') $(this).attr('_val', '');
                else $(this).attr('_val', '1');
                $(this).toggleClass('on');
                om.searchCom();
            });
            this.dvContactlst.find('tbody .btnAdd').live('click', function () {
                var a = [];
                if (mMyContacts.groupId) {
                    var otr = $(this).parent().parent();
                    a.push(ur.user().id);
                    a.push(mMyContacts.groupId);
                    a.push(otr.attr('_id'));
                    a.push(otr.find(':text').val());
                    var btn = $(this).text('..');
                    gf.callProc('up_co_add_icontact', a, function () {
                        outputMsg('添加成功');
                        mMyContacts.search();
                        btn.text('添加成功');
                    });
                } else {
                    alert('您还未选择分组');
                }
            });
            this.searchCom();
        }
    },
    show: function (obj) {
        this.ini();
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
    },
    searchCon: function (coid, conid) {// 查询联系人
        var om = this;
        gf.noPagination('up_co_get_cocontacts_withme', [ur.user().id, coid, conid], function (a) {
            //ID,name_cn,gender,avatar,ISNULL(ic.conId,-1)
            if (a.length > 0) {
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(f.text(b[1]))); //昵称
                    c.push(td(b[0])); //帐号
                    c.push(b[4] > 0 ? td('已添加', 'class="done"') : td('<a href="javascript://" class="btnAdd">添加</a>')); //添加
                    a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                    c = [];
                }
                om.dvContactlst.find('tbody').html(a.join(''));
            } else {
                gf.outputMsgInTbl('该公司还未添加联系人', om.dvContactlst.find('table'));
            }
        });
    },
    searchCom: function () {
        var om = this;
        var aF = [], a = [];
        var n = this.dvCompanylst.find('.name').val();
        a.push(n);
        if ($.isNumeric(n)) {
            aF.push("coId=r_r");
        } else {
            aF.push("全称 like 'r_r%'");
        }
        aF.push('isCus=r_r');
        aF.push('isSu=r_r');
        this.dvCompanylst.find('.spn_type a').each(function () { a.push($(this).attr('_val')); });
        gf.noPaginationSqlPara(f.getWhere_root(aF, a), '全称 asc', 'top 15 coId,全称,isCus,isSu', 'co.vwicompany', function (a) {
            var b = [], c = [];
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                c.push(td(b[0])); //coId
                c.push(td(b[1])); //全称
                c.push(td(b[2] == 0 ? '' : '是')); //isCus
                c.push(td(b[3] == 0 ? '' : '是')); //isSu
                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                c = [];
            }
            om.dvCompanylst.find('tbody').html(a.join(''));
        });
    }
}

var mCoOfMyCompany = $.extend({}, gPaginationModel, {// 我司的贸易伙伴
    fields: 'ID,coId,全称,助记名,拼音码,星级,note,主营数,isCus,isSu,联系人数,作者,日期,uID',
    tbl: 'co.vwicompany',
    isEditDirty: true,
    isNav: true,
    type: '',
    code: '17',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCoOfMyCompany');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch').click(function () {
                om.search();
            });

            this.oTbl.find('tbody').find('.edit').live('click', function () {
                mCompanyUpdate.show(this, $(this).parent().attr('coid'));
            }).end().find('td.btnSetBit').live('click', function () {
                var otd = $(this);
                var v = $(this).text();
                var a = [];
                a.push(ur.user().id);
                a.push($(this).parent().attr('_id'));
                a.push($(this).attr('_type'));
                a.push(v == '是' ? '0' : '1');
                gf.callProc('up_co_set_icompany_bit', a, function () {
                    otd.text(v == '是' ? '否' : '是');
                });
            }).end().find('.del').live('click', function () {
                var otr = $(this).parent();
                gf.callProc('up_co_del_icompany', [otr.attr('_id'), 0], function () {
                    otr.addClass('del');
                });
            }).end().find('thead :checkbox').click(function () {
                om.oTbl.find('tbody :checkbox').attr("checked", $(this).is(":checked") ? 'checked' : '');
            });

            this.dv.find('.btnSave').click(function () {
                var otr = om.getDirtyRows();
                var a = [], b = [], aId = [], o = null;
                otr.each(function () {
                    $(this).find(':text').each(function (i) { b[i] = $(this).val(); });
                    a.push(b);
                    aId.push($(this).attr('_id'));
                    b = [];
                });

                var btn = $(this).disable().val('正在保存');
                gf.updateBatch(aId, 'co.icompany', ['星级', 'note'], a, function () {
                    btn.enable().val('保存');
                    outputMsg('保存完毕');
                });
            });
            this.ini_after();
            this.search();
        }
    },
    search_done: function () {
        this.oTbl.find('tbody tr').contextMenu('myMenu_icompany', {// 右键菜单
            bindings: {
                'menu_icompany_addmyfriend': function (t) {// 添加我的分组
                    mAddiContactSingle.show(t, $(t).attr('coid'));
                },
                'menu_main': function (t) {// 主营
                    mCompanyMain.show(t, $(t).attr('coid'), $(t).find('td:eq(2)').text());
                },
                'menu_icompany_edit': function (t) {// 修改
                    mCompanyUpdate.show(t, $(t).attr('coid'));
                },
                'menu_icompany_del': function (t) {// 删除
                    if (confirm('真的要从我司贸易伙伴中移除该公司吗？')) {
                        gf.callProc('up_co_del_icompany', [ur.user().id, $(t).attr('_id')], function () {
                            $(t).addClass('del');
                        });
                    }
                }
            }
        });
    },
    fdata: function (a) {
        var c = [];
        //ID,coId,全称,助记名,拼音码,星级,note,主营数,isCus,isSu,联系人数,作者,日期,uID
        c.push(td(f.checkbox('_id="' + a[0] + '"')));
        c.push(td(a[1]));
        c.push(td(a[2], 'title="' + a[2] + '" class="cuweb"'));  //全称
        c.push(td(a[3]));  //助记名
        c.push(td(a[4]));  //拼音码
        c.push(td(f.text(a[5])));  //星级
        c.push(td(f.text(a[6], 'placeholder="输入简短评语"')));  //note
        c.push(td(a[7]));
        c.push(td(a[8] == '0' ? '否' : '是', 'class="center btn btnSetBit" _type="0"'));  //是客户
        c.push(td(a[9] == '0' ? '否' : '是', 'class="center btn btnSetBit" _type="1"'));  //是供货商
        c.push(td('' + a[10])); //联系人数
        c.push(td(f.authorDate_(a[11], a[12])));
        return tr(c.join(""), '_id="' + a[0] + '" coid="' + a[1] + '"  onclick="selectRow(this);" uid="' + a[12] + '"');
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF.push('(公司ID=r_r)');
        aF.push((this.type == 0 ? 'isCus' : 'isSu') + '=r_r');
        aF.push('(coID=r_r)');
        aF.push("(全称 like 'r_r%')");
        aF.push("(助记名 like 'r_r%')");
        aF.push("(拼音码 like 'r_r%')");
        aF.push("(星级r_r)");
        a.push(ur.company().id);
        a.push('1');
        this.oTbl.find('thead').find(':text,select').each(function () { a.push($(this).val()); });
        return f.getWhere_root(aF, a);
    }
});

var mAddiContactSingle = {
    dv: null,
    cmbGroup: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAddiContactSingle');
            this.cmbGroup = this.dv.find('.group')
            this.searchGroup();
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().find('tbody .btnAdd').live('click', function () {
                var otr = $(this).parent().parent();
                var a = [];
                a.push(ur.user().id);
                a.push(om.cmbGroup.val());
                a.push(otr.attr('_id'));
                a.push(otr.find(':text').val());
                var btn = $(this).text('..');
                gf.callProc('up_co_add_icontact', a, function () {
                    outputMsg('添加成功');
                    btn.text('添加成功');
                });
            });
        }
    },
    searchGroup: function () {
        var om = this;
        gf.noPagination('up_co_get_igroups', [ur.user().id], function (a) {
            //ID,name,memberCnt
            var b = [];
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                a[i] = '<option value="' + b[0] + '">' + b[1] + '[' + b[2] + ']</option>';
            }
            om.dv.find('.group').html(a.join(''));
        });
    },
    show: function (t, coid) {
        this.ini();
        var om = this;
        gf.show(t, this.dv, { x: 'center', y: 'center' });
        gf.noPagination('up_co_get_cocontacts_withme', [ur.user().id, coid, 0], function (a) {
            //ID,name_cn,gender,avatar,ISNULL(ic.conId,-1)
            var b = [], c = [];
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                c.push(td(f.text(b[1]))); //昵称
                c.push(td(b[0])); //帐号
                c.push(b[4] > 0 ? td('已添加', 'class="done"') : td('<a href="javascript://" class="btnAdd">添加</a>')); //添加
                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                c = [];
            }
            om.dv.find('tbody').html(a.join(''));
        });
    }
}

var mCoRate = $.extend({}, gPaginationModel, {
    fields: 'ID,全称,助记名,拼音码,库存真实性ID,星级,备注,主营数,web_site',
    tbl: 'co.vwCompany_rate',
    cmbArea: null,
    isNav: true,
    isEditDirty: true,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCoRate');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch');
            this.bttnSearch.click(function () { om.search(); });
            this.ini_after();
            this.cmbArea = this.dv.find('.cmbArea');
            gOption.option(this.cmbArea, 'up_option_coarea', ['-1'], '', { firstItem: ['', '全部'] });
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
                gf.updateBatch(aId, 'co.company', ['shortname', 'py', 'instockDescID', 'star', 'note'], a, function () {
                    btn.enable().val('保存');
                    outputMsg('保存完毕');
                });
            });
            this.search();
        }
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

var mCoPoolPy = $.extend({}, gPaginationModel, {
    fields: 'ID,全称,助记名,拼音码,来自',
    tbl: 'co.vwCompany_addr',
    isNav: true, // 使用键盘导航
    isEditDirty: true,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCoPoolPy');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.btnSearch');
            this.bttnSearch.click(function () { om.search(); });
            this.ini_after();
            gcofrm.ini();
            gOption.foption(this.oTbl.find('thead .cmbCoFrom'), gcofrm.getData());
            this.oTbl.find('tbody :text').live('dblclick', function () {
                if (!$(this).val()) {
                    $(this).val($(this).parent().parent().find('td:eq(0)').text());
                }
            });
            this.dv.find('.btnSave').click(function () {
                om.update(this);
            });
            this.search();
        }
    },
    update: function (obj) {
        var om = this;
        var bttn = $(obj).disable();
        var aIds = [], a = [];
        var o = null;
        var valid = true;
        this.getDirtyRows().each(function () {
            o = $(this).find(':text');
            //数量,来价,供货商ID,批号,芯片状态ID,备注
            if (!myValidator.maxlen(o.eq(0), 20)) valid = false; // 助记名
            if (!myValidator.maxlen(o.eq(1), 15)) valid = false; //拼音码
            if (valid) {
                a.push([o.eq(0).val(), o.eq(1).val()]);
                aIds.push($(this).attr('_id'));
            }
        });

        if (valid) {
            gf.updateBatch(aIds, 'co.company', ['shortName', 'py'], a, function () {
                bttn.enable();
                outputMsg('保存成功');
                om.oTbl.find('tbody tr.dirty').remomveClass('dirty');
            });
        } else {
            alert('更新有错误，错误的地方已经用红色标注，请仔细检查，助记名不能超过20个字符，拼音码不能超过15个字符');
        }
    },
    fdata: function (a) {
        //ID,全称,助记名,拼音码,来自
        var ac = [];
        ac[0] = td('<a target="_blank" href="details.aspx?id=' + a[0] + '" title="查看客户' + a[1] + '详细信息" class="external" >' + a[1] + '</a>');  // 全称
        ac[1] = td(f.input(a[2], 'text', 'class="simple_name"')); //助记名
        ac[2] = td(f.input(a[3], 'text')); //拼音码
        ac[4] = td(a[4]); //来自
        return tr(ac.join(""), '_id="' + a[0] + '"');
    },
    where: function () {
        // 获取查询子句
        var aF = [], a = [];
        aF.push("(全称 like '%r_r%')");
        aF.push("(助记名 like 'r_r%')");
        aF.push("(拼音码 like 'r_r%')");
        aF.push("(来自ID=r_r)");
        this.oTbl.find('thead').find(':text,select').each(function () { a.push($(this).val()); });
        return f.getWhere_root(aF, a);
    }
});


var mCoPool = $.extend({}, gPaginationModel, {
    fields: 'ID,全称,助记名,拼音码,国家,Web_Site,联系人数,1,logo,作者,日期,uID,公司ID,来自ID',
    tbl: 'co.vwCompany',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCoPool');
            this.oTbl = this.dv.find('.main5');
            this.oTbl.find('thead :text').enterpress(function (e) {
                om.search(-1);
            });
            gAreaCom.ini();
            this.dv.find('thead').find('.cmbArea').html('<option value="" selected="selected">全部</option>' + gAreaCom.html);
            this.dv.find('.btnAdd').click(function () {//添加客户
                // 获取新ID
                mCompanyUpdate.show(this);
            });

            this.ini_after();
            this.bttnSearch = this.dv.find('.btnSearch').click(function () {
                om.search();
            }).click();
        }
    },
    addICompany: function (a) {
        gf.callProc_with_value('up_co_add_icompany', a, function (v) {
            if (v == '1') outputMsg('成功添加到我公司列表');
            else outputMsg('已经添加该公司，系统不会重复添加');
        });
    },
    search_done: function () {
        var om = this;
        this.oTbl.find('tbody tr').contextMenu('myMenu_pool', {// 右键菜单
            bindings: {
                'menu_addgroup_cu': function (t) {// 添加未客户
                    selectRow(t);
                    var a = [ur.user().id, $(t).attr('_id'), ur.company().id, 1, 0];
                    om.addICompany(a);
                },
                'menu_addgroup_su': function (t) {// 添加未客户
                    selectRow(t);
                    var a = [ur.user().id, $(t).attr('_id'), ur.company().id, 0, 1];
                    om.addICompany(a);
                },
                'menu_pool_addicontact': function (t) {
                    mAddiContactSingle.show(t, $(t).attr('_id'));
                },
                'menu_pool_edit': function (t) {
                    mCompanyUpdate.show(t, $(t).attr('_id'));
                },
                'menu_pool_del': function (t) {// 删除订单型号
                    if (gf.isAuthorOrSysAdmin($(t).attr('uid'))) {
                        // 删除 公司 删除存储过程要进行一系列的检查
                        if (confirm('真的要删除该公司吗？')) {
                            gf.callProc_with_value('up_co_del_company', [$(t).attr('_id'), ur.user().id], function (v) {
                                $(t).addClass('del');
                                outputMsg('删除成功');
                            });
                        }
                    } else {
                        alert($(t).find('td:eq(0)').text() + ' 不是您添加的,您只能删除您添加的公司');
                    }
                }
            }
        });
    },
    checkAll: function (obj) {
        this.oTbl.find('tbody :checkbox').attr("checked", $(obj).is(":checked") ? 'checked' : '');
    },
    fdata: function (a) {
        //ID,全称,助记名,拼音码,国家,Web_Site,联系人数,快递数,logo,作者,日期,uID,公司ID,来自ID
        var ac = [];
        ac.push(td('<a href="javascript://" class="" title="修改公司信息" onclick="mCompanyUpdate.show(this,\'' + a[0] + '\');">' + a[0] + '</a>')); //编码
        ac.push(this.fCompany(a[1], a[0], a[5]));   // 全称
        ac.push(td(a[2])); //助记名
        ac.push(td(a[3])); //拼音码
        ac.push(td(a[4])); //国家
        ac.push(td(f.div(a[6], 'class="cus_contact"'))); //联系人
        ac.push(td(f.date(a[10]), 'onclick="mwebs.show(this);"'));
        return tr(ac.join(""), '_id="' + a[0] + '" onclick="selectRow(this);" uid="' + a[11] + '" comid="' + a[12] + '" coid="' + a[0] + '"');
    },
    fCompany: function (name, id, website) {
        var s = website ? '<a target="_blank" href="' + website + '" title="查看客户' + name + '详细信息" >' + fixStr(name, 25) + '</a>' : name;
        return td(s);
    },
    where: function () {
        var aF = [], a = [];
        this.oTbl.find('thead').find(':text,select').each(function () { a.push($(this).val()); });
        aF.push("(ID=r_r)");
        aF.push("(全称 like '%r_r%')");
        aF.push("(助记名 like 'r_r%')");
        aF.push("(拼音码 like 'r_r%')");
        aF.push('areaID=r_r');
        aF.push("(联系人数r_r)");
        aF.push('(公司ID=r_r or 隐私=0)');
        var coid = '';
        if (!(a[0] || a[1] || a[2] || a[3])) coid = ur.company().id;
        a.push(coid);
        return getWhere_root(aF, a);
    }
});



var mwebs = {
    dv: null,
    ini: function () {
        var om = this;
        if (!this.dv) {
            $('body').append('<div id="dv_webs" class="gwin"><img src="../images/close3.gif" class="close" alt="关闭"  /><ul></ul></div>');
            this.dv = $('#dv_webs');
            this.dv.find('.close').click(function () { om.dv.hide(); }).end().draggable({ handle: this.dv });
        }
    },
    show: function (obj) {
        this.ini();
        var om = this;
        var id = $(obj).parent().attr('_id');
        var p = $(obj).offset();
        this.dv.css({ 'top': p.top, 'left': p.left - 120 }).show();
        gf.noPaginationSqlPara('coId=' + id, '网站ID asc', '网站ID,网站', 'co.webmap', function (a) {
            if (a.length > 0) {
                var b = [];
                var url = "";
                var web = "";
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    if (b[1] == "1") {// icnet
                        url = "http://" + b[0] + ".ic.net.cn/newhome/style14.asp";
                        web = "IC交易网"
                    } else { //hqew
                        url = "http://" + b[0] + ".hqew.com/contact.html";
                        web = "华强电子"
                    }
                    a[i] = '<li><a href="' + url + '" target="_blank">' + web + '</a></li>';
                }
            } else a[0] = '<li>无网址</li>';
            om.dv.find('ul').html(a.join(''));
        });
    }
}





var mshift = {
    dv: null,
    txtUser: null,
    ini: function () {
        var om = this;
        this.dv = $('#dvGroupShift');
        this.txtUser = this.dv.find('.txtUser');
        gAuto.colleague(this.txtUser);
        this.dv.find('.close').click(function () { om.dv.hide(); }).end().draggable({ handle: this.dv.find('.title') }).end().find('.bttnShift').click(function () { // 转移组公司
            gf.callProc('up_co_shift_igroup_company', [id, om.txtUser.attr('_id')], function () {
                a[i].addClass('done').find('span').text($(a[i]).attr('_name'))
            });
        });
        $('#bttnShowShift').click(function () {
            gf.show(this, om.dv, { x: -200, y: 100 });
        });
    }
}

var mQuote = {
    id: '',
    dv: null,
    isIni: false,
    cmbGroup: null,
    type: 0,
    aType: ['客户分组', '供货商分组'],
    ini: function () {
        if (!this.isIni) {
            var om = this;
            this.isIni = true;
            this.dv = $('#dvQuote');
            this.cmbGroup = this.dv.find('.cmbGroup');
            gOption.foption(this.cmbGroup, gMyGroupData.get(this.type));
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().find('.btnAdd').click(function () {
                //加入到我的客户供应商
                if (om.cmbGroup.val()) {
                    gf.callProc_with_value('up_co_addMyCompany', [om.id, om.cmbGroup.val()], function () {
                        om.get();
                    });
                } else { alert('请选择分组'); }
            }).end().draggable({ cancel: '.body' });
        }
    },
    show: function (obj) {
        this.ini();
        this.id = $(obj).parent().parent().attr('_id');
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
        this.get();
    },
    get: function () {
        var om = this;
        gf.noPagination('up_co_getMyQuote', [this.id], function (a) {
            var b = [], c = [];
            for (var i = 0; i < a.length; i++) {//ID,作者,组名,性质,日期
                b = a[i];
                c.push(td(b[0])); //ID
                c.push(td(b[1])); //作者
                c.push(td(b[2])); //组名
                c.push(td(om.aType[b[3]])); //性质
                c.push(td(f.date2str(b[4]))); //日期
                c.push(td('', 'class="del"')); //
                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                c = [];
            }
            om.dv.find('tbody').html(a.join(''));
        });
    }
}



//var mMyGroup = {
//    dv: null,
//    aType: ['客户', '供应商'],
//    isIni: false,
//    ini: function () {
//        if (!this.isIni) {
//            var om = this;
//            this.isIni = true;
//            this.dv = $('#dvMyGroup');
//            this.dv.find('.close').click(function () {
//                om.dv.hide();
//            }).end().find('.btnNewLine').click(function () {
//                var c = [];
//                c.push(td('新增')); //ID
//                c.push(td(f.text(''))); //组名
//                c.push(td(f.text())); //备注
//                c.push(td(gf.fSelect(om.aType))); //性质
//                c.push(td('')); //数量公司
//                c.push(td('')); //日期
//                c.push(td('<a href="javascript://" class="btnEdit">保存</a><a href="javascript://" class="btnDel">删除</a>', 'class="command"'));
//                om.dv.find('tbody').prepend(tr(c.join(''), '_id=""'));
//            }).end().find('tbody .btnEdit').live('click', function () {
//                var otr = $(this).parent().parent();
//                if ($(this).text() == '保存') {// 保存
//                    var a = [];
//                    a.push(ur.user().id);
//                    a.push(otr.attr('_id'));
//                    otr.find(':text,select').each(function () { a.push($(this).val()); });
//                    gf.callProc('up_co_update_igroup', a, function () {
//                        outputMsg('保存成功');
//                        gMyGroupData.refresh();
//                        om.get();
//                    });
//                } else { // 切换到编辑模式
//                    $(this).text('保存');
//                    var o = otr.find('td');
//                    o.eq(1).html(f.text(o.eq(1).text()));
//                    o.eq(2).html(f.text(o.eq(2).text()));
//                    o.eq(3).html(gf.fSelect(om.aType, o.eq(3).attr('_id')));
//                }
//            }).end().find('.btnDel').live('click', function () {
//                // 删除分组
//                if (confirm('添加到该分组的客户或者供货商的引用也会一起删除，客户供货商信息不会删除，真的要删除该分组吗')) {
//                    var otr = $(this).parent().parent();
//                    gf.callProc('up_co_del_igroup', [otr.attr('_id')], function () {
//                        otr.addClass('del');
//                    });
//                }
//            }).end().draggable({ cancel: '.body' });
//        }
//    },
//    show: function (obj) {
//        this.ini();
//        gf.show(obj, this.dv, { x: 'center', y: 30 });
//        this.get();
//    },
//    get: function () {
//        var om = this;
//        gf.noPagination('up_co_get_igroups', [ur.user().id], function (a) {
//            var b = [], c = [];
//            for (var i = 0; i < a.length; i++) {
//                //ID,组名,性质,数量公司,备注,日期
//                b = a[i];
//                c.push(td(b[0])); //ID
//                c.push(td(b[1])); //组名
//                c.push(td(b[4])); //备注
//                c.push(td(om.aType[b[2]], '_id="' + b[2] + '"')); //性质
//                c.push(td(b[3])); //数量公司
//                c.push(td(f._date(b[5]))); //日期
//                c.push(td('<a href="javascript://" class="btnEdit">编辑</a><a href="javascript://" class="btnDel">删除</a>', 'class="command"'));
//                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
//                c = [];
//            }
//            om.dv.find('tbody').html(a.join(''));
//        });
//    }
//}


//var mMyCompany = $.extend({}, gPaginationModel, {// 我的
//    fields: 'ID,coId,myCompanyId,全称,助记名,拼音码,星级,note,主营数,联系人数,组名,日期,询价数,性质,groupId',
//    tbl: 'co.icompany_my_v2',
//    isEditDirty: true,
//    isNav: true,
//    type: '',
//    ini: function () {
//        if (!this.dv) {
//            var om = this;
//            this.dv = $('#dvMyCompany');
//            this.oTbl = this.dv.find('table');

//            this.bttnSearch = this.dv.find('.btnSearch').click(function () {
//                om.search();
//            });

//            this.ini_after();
//            this.oTbl.find('tbody').find('.btnAddMain').live('click', function () {
//                mCompanyMain.show(this, $(this).parent().parent().attr('coid'), $(this).parent().parent().find('td:eq(1)').text());
//            }).end().find('.edit').live('click', function () {
//                mCompanyUpdate.show(this, $(this).parent().attr('coid'));
//            }).end().find('.btnViewContact').live('click', function () {
//                mCompanyUpdate.show(this, $(this).parent().parent().attr('coid'));
//            });
//            this.dv.find('.btnShowGroup').click(function () {
//                mMyGroup.show(this);
//            });
//            this.search();
//        }
//    },
//    setType: function (type) {
//        this.type = type;
//        gOption.foption(this.oTbl.find('thead .cmbGroup'), gMyGroupData.get(this.type), '', ['', '全部']);
//    },
//    search_done: function () {
//        this.oTbl.find('tbody tr').contextMenu('myMenu_mycompany', {// 右键菜单
//            bindings: {
//                'menu_mycompany_addgroup': function (t) {// 添加我的分组
//                },
//                'menu_mycompany_main': function (t) {// 主营
//                    mCompanyMain.show(t, $(t).attr('coid'), $(t).find('td:eq(2)').text());
//                },
//                'menu_mycompany_edit': function (t) {//修改
//                    mCompanyUpdate.show(t, $(t).attr('coid'));
//                },
//                'menu_mycompany_del': function (t) {// 删除
//                }
//            }
//        });
//    },
//    fdata: function (a) {
//        var c = [];
//        //ID,coId,myCompanyId,全称,助记名,拼音码,星级,note,主营数,联系人数,组名,日期,询价数,性质,groupId
//        c.push(td(a[1])); // 公司编号
//        c.push(td(a[3], 'title="' + a[2] + '" class="cuweb"'));  //全称
//        c.push(td(a[4]));  //助记名
//        c.push(td(a[5]));  //拼音码
//        c.push(td(f.text(a[6])));  //星级
//        c.push(td(f.text(a[7], 'placeholder="输入简短评语"')));  //note
//        c.push(td('主营:' + a[8] + '<a href="javascript://" class="btnAddMain">添加</a>'));  //主营
//        c.push(td('' + a[9] + '<a href="javascript://" class="btnViewContact">查看</a>')); //联系人数
//        c.push(td(a[10]));  //组名
//        c.push(td(f._date(a[11])));  //日期
//        return tr(c.join(""), '_id="' + a[0] + '" coid="' + a[1] + '" mycompanyid="' + a[2] + '" onclick="selectRow(this);"');
//    },
//    where: function () {
//        // 获取查询子句
//        var aF = [], a = [];
//        aF.push('用户ID=r_r');
//        aF.push('性质=r_r');
//        aF.push('coid=r_r');
//        aF.push("(全称 like 'r_r%')");
//        aF.push("(助记名 like 'r_r%')");
//        aF.push("(拼音码 like 'r_r%')");
//        aF.push("(星级r_r)");
//        aF.push('(groupId=r_r)');

//        a.push(ur.user().id);
//        a.push(this.type);

//        this.oTbl.find('thead').find(':text,select').each(function () { a.push($(this).val()); });
//        return f.getWhere_root(aF, a);
//    }
//});