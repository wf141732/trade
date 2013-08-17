/// <reference path="../jquery-1.6.2.min.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="../common/aacdb.js" />

var gISelectCompany = {
    dv: null,
    dvRecent: null,
    dvSearchLst: null,
    txtKey: null,
    type: '0',
    selectCallback: function () { },
    btnRecent: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvISelectCompany');
            this.btnRecent = this.dv.find('.btnRecent').click(function () {
                om.recent();
            });
            this.dv.find('.btnSync').click(function () {// 同步
                if (confirm('真的要同步我司')) {
                    var btn = $(this).text('正在同步..');
                    aac.db.sync_icompany(function () {
                        btn.text('同步完毕!');
                    });
                }
            }).end().find('.btnSearch').click(function () {
                var btn = $(this).disable();
                gf.noPagination('up_co_get_companyForSel', [om.txtKey.val()], function (a) {
                    om.fsearch(a);
                    btn.enable();
                });
            }).end().find('.close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ cancel: '.tool,.lst' });
            this.dvRecent = this.dv.find('ul.recent');
            this.dvSearchLst = this.dv.find('ul.search');
            this.txtKey = this.dv.find('.txtKey').keyup(function () {
                // 实时查询本地我司的业务伙伴
                var isCus = '', isSu = '';
                if (om.type == G.recentType.so || om.type == G.recentType.rfq_sale) {
                    isCus = 'true';
                } else {
                    isSu = 'true';
                }
                aac.db.query_icompany(om.txtKey.val(), isCus, isCus, function (a) {
                    om.fsearch(a);
                });
            });
        }
    },
    select: function (t) {// 选择当前行
        this.selectCallback($(t).attr('_id'), $(t).find('.name').text(),$(t).attr('ptid'));
        this.dv.fadeOut();
    },
    recent: function () {
        // 获取最近记录
        var om = this;
        om.dvRecent.show();
        om.dvSearchLst.hide();
        this.btnRecent.addClass('on');
        gf.noPagination('up_co_get_iRecentCompany', [ur.user().id, this.type], function (a) {
            var b = [];
            for (var i = 0; i < a.length; i++) {
                //com.ID,com.shortName,com.py,com.name,ptid,r.LAST_UPDATE_DATE
                b = a[i];
                a[i] = '<li _id="' + b[0] + '" ptid="' + b[4] + '"><span class="name">' + b[1] + '</span>[' + b[2] + ']<span class="date"></span></li>';
            }
            om.dvRecent.html(a.join('')).find('li').click(function () {
                om.select(this);
            });
        });
    },
    fsearch: function (a) {
        var b = [];
        var om = this;
        this.btnRecent.removeClass('on');
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            a[i] = '<li _id="' + b[0] + '" ptid="' + b[4] + '"><span class="name">' + b[1] + '</span>[' + b[2] + ']</li>';
        }
        this.dvRecent.hide();
        this.dvSearchLst.show().html(a.join('')).find('li').click(function () {
            om.select(this);
        });
    },
    show: function (obj, type) {
        this.ini();
        this.type = type;
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
        this.recent();
    }
}

var gAddMyGroup = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            this.dv = $('#dvAddMyGroup');
        }
    },
    show: function (obj, type) {
        //type：0客户 1供货商
        //ID,组名
        var p = $(otrigger).offset();
        var a = gMyGroupData.get(type);
        for (var i = 0; i < a.length; i++) {
            a[i] = '<li _id="' + a[i][0] + '">' + a[i][1] + '</li>';
        }
        this.dv.find('ul').html(a.join(''));
    }
}

var mCaigouHis = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            $('body').append(ghq.sthml_caigouhis);
            this.dv = $('#dvCoCaigouHis');
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().draggable({ cancel: '.body' });
        }
    },
    show: function (obj, coid, coname) {
        this.ini();
        // 查看该供货商的最近采购记录
        var om = this;
        var id = coid;
        this.dv.find('.bar').text(coname + ' 最近采购记录');
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
        gf.noPagination('up_po_getLastBuyHis', [coid, ur.company().id], function (a) {
            if (a.length > 0) {
                //ID,型号,数量,售价,批号,作者,日期
                //ID,型号,数量,售价,芯片状态,批号,作者,日期
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(b[1])); //型号
                    c.push(td(b[2])); //数量
                    c.push(td(f.price(b[3], 2))); //进价
                    c.push(td(b[4])); //芯片状态
                    c.push(td(b[5])); //批号
                    c.push(td(b[6])); //经办人
                    c.push(td(f.date(b[7]))); //日期
                    a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                    c = [];
                }
                om.dv.find('tbody').html(a.join(''));
            } else {
                gf.outputMsgInTbl('该供货商无采购记录', om.dv.find('table'));
            }
        });
    }
}

var ghqewHover = {
    dv: null,
    crrntid: '',
    aCo: [],
    aways: [],
    aAddr: ['公司地址', '收/发货地址', '发票地址'],
    mouse_out: true,
    isHover: false,
    cmbGroup: null,
    tbls: null,
    btnDetails: null,
    foption: function (a, type) {
        var atype = ['客户', '供货商'];
        var b = [], c = [];
        c.push('<optgroup label="' + atype[type] + '">');
        for (var i = 0; i < a.length; i++) {//ID,组名,性质
            b = a[i];
            c.push('<option value="' + b[0] + '">' + b[1] + '</option>');
        }
        c.push('</optgroup>');
        return c.join('');
    },
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCompanyAuto');
            this.tbls = this.dv.find('.body table');
            this.cmbGroup = this.dv.find('.tit .cmbGroup');
            this.btnDetails = this.dv.find('.btnDetails');
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().find('.btnModify').click(function () {
                mCompanyUpdate.show(this, om.crrntid);
            }).end().find('.btnAddMyGroup').click(function () {
                if (om.cmbGroup.is(':hidden')) {
                    om.cmbGroup.show();
                    if (om.cmbGroup.find('option').size() < 1) {
                        var b = [];
                        gf.noPagination('up_co_get_igroups2', [ur.user().id], function (a) {
                            a = group_array(a, 2);
                            for (var i in a) a[i] = om.foption(a[i], i);
                            om.cmbGroup.html(a.join(''));
                        });
                    }
                } else {
                    gf.callProc('up_co_add_myMembers', [om.crrntid, om.cmbGroup.val()], function () {
                        outputMsg('添加成功');
                        om.cmbGroup.hide();
                    });
                }
            }).end().find('.btnAddr').click(function () { // 显示地址
                om.getAddr();
                om.tbls.hide().eq(1).show();
            }).end().find('.btnHis').click(function () {
                mCaigouHis.show(this, om.crrntid, om.dv.find('.tit b').text());
            }).end().hover(function () {
                om.isHover = true;
                $(this).show();
            }, function () {
                om.isHover = false;
                setTimeout(function () {// 延迟500毫秒关闭
                    if (!om.isHover) om.dv.hide();
                }, 300);
            }).draggable({ cancel: '.body,.tit' });
        }
    },
    getAddr: function () {
        var om = this;
        gf.noPagination('up_co_getAddressOfCo2', [this.crrntid], function (a) {
            var b = [], c = [];
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                c.push(td(b[3])); //addr
                c.push(td(om.aAddr[b[4]], '_id="' + b[4] + '"')); //type
                c.push(td(b[5])); //note
                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                c = [];
            }
            om.tbls.eq(1).find('tbody').html(a.join(''));
        });
    },
    bind_hover: function (txt) {
        var om = ghqewHover;
        txt.hover(function (e) {
            var p = $(this).offset();
            var id = $(this).attr("_id");
            om.mouse_out = false;
            om.dv.css({ 'top': p.top + $(this).height() - 5, 'left': p.left + $(this).width() - 5 });
            setTimeout('ghqewHover.show_delay(\'' + id + '\');', 500);
            om.btnDetails.attr('href', gurl.root + 'crm/details.aspx?id=' + id);
        }, function () {
            om.mouse_out = true;
            setTimeout(function () {
                if (!om.isHover) {
                    om.dv.hide();
                }
            }, 300);
        });
    },
    show_delay: function (id) {
        with (ghqewHover) {
            mouse_out ? dv.hide() : show(id);
        }
    },
    show: function (id) { // 显示供货商详细面板
        var om = this;
        this.dv.show();
        this.tbls.hide().eq(0).show();
        if (id && id != this.crrntid) {
            this.crrntid = id;
            if (this.aCo[id]) {
                om.fTit(this.aCo[id]);
                om.fways(this.aways[id]);
            } else {
                gf.getOneLine('up_co_getCompanyInfo', [id], function (a) {
                    om.aCo[id] = a;
                    om.fTit(a);
                });
                gf.noPagination('up_co_get_waysOfCoForTip', [id], function (a) {
                    //ID,联系人,类型,CC,AC,号码,默认,类型ID
                    om.aways[id] = a;
                    om.fways(a);
                });
            }
        }
    },
    fTit: function (a) {
        this.dv.find('.tit b').text(a[1]);
    },
    _fway: function (b) {
        //ID,类型ID,联系人,类型,CC,AC,号码,默认,conId
        num = b[6];
        var s = '';
        if (b[1] < 10) {
            var a = [];
            if (b[4] && b[4] != '86') a.push(b[4]);
            if (b[5]) a.push(b[5]);
            a.push(num);
            s = '<a href="skype:+' + b[4] + b[5] + b[6] + '?call" title="点击skype呼叫">' + a.join('-') + '</a><a  cc="' + b[4] + '" ac="' + b[5] + '" num="' + b[6] + '" class="btnDial" href="javascript://">拨号</a>';
        } else if (b[1] == 10) {// QQ
            s = '<a target="_blank" href="http://wpa.qq.com/msgrd?V=1&amp;Uin=' + num + '&amp;Exe=QQ&amp;Site=IC全能王(www.icprice.cn)&amp;Menu=Yes"><img border="0" src="http://wpa.qq.com/pa?p=1:' + num + ':1" alt="给我发消息"></a>';
        } else if (b[1] == 11) {//MSN
            s = '<a href="msnim:chat?contact=' + num + '" target="blank">' + num + '</a>';
        } else if (b[1] == 12) {//SKYPE
            s = '<a href="callto://' + num + '" title="' + num + '">skype聊天</a>';
        }
        return s;
    },
    fways: function (aways) {
        var b = [], c = [], num = '';
        var a = aways.concat();
        var aa = [];
        if (aways.length > 0) {
            var aContact = group_array(a, 8);
            for (var i in aContact) {
                aa.push('<tr>');
                aa.push(td(aContact[i][0][2], 'style="width:20%;"'));
                aa.push('<td style="width:80%;">')
                for (var j = 0; j < aContact[i].length; j++) {
                    aa.push(this._fway(aContact[i][j]));
                }
                aa.push('</td></tr>');
            }
        }
        this.tbls.eq(0).find('tbody').html(aa.join('')).find('.btnDial').click(function () {
            var btn = $(this).text('正在拨号请摘机');
            gExtHook.callto($(this).attr('ac'), $(this).attr('num'));
            setTimeout(function () { btn.text('拨号'); }, 5000);
        });
    }
}

var gMyGroupData = {
    ini: function () {
        if (!localStorage.myGroupData) {
            gf.noPagination('up_co_get_igroups2', [ur.user().id], function (a) {//ID,组名,性质
                localStorage.myGroupData = JSON.stringify(a);
            });
        }
    },
    get: function (type) {//type:0客户 1供货商
        this.ini();
        var a = JSON.parse(localStorage.myGroupData);
        var b = [];
        for (var i = 0; i < a.length; i++) {//ID,组名,性质
            if (a[i][2] == type) b.push([a[i][0], a[i][1]]);
        }
        return b;
    },
    refresh: function () {
        localStorage.myGroupData = '';
        this.ini();
    }
}

var mCompanyMain = {
    coid: '',
    aRank: ['低', '中', '高'],
    aType: ['封装', '厂牌', '功能'],
    dv: null,
    aPck: [],
    cmbType: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCompanyMain');
            this.cmbType = this.dv.find('.cmbType');
            gf.fSelect(this.aType, '', this.cmbType);
            this.dv.find('.close').click(function () {
                om.dv.hide();
            }).end().find('.btnAdd').click(function () { //添加
                var c = [];
                var type = om.cmbType.val();
                c.push(td('新增')); //ID
                c.push(td(om.aType[type])); //type
                if (type == 0) {//封装
                    c.push(td(gf.fSelect(om.aPck))); //rName
                } else if (type == '1') {//厂牌
                    c.push(td(f.text('', 'placeholder="输入厂牌" _id="" class="txtMfg" '))); //rName
                } else if (type == '2') {
                    c.push(td(''));
                }
                c.push(td(gf.fSelect(om.aRank))); //rank
                c.push(td(f.text(''))); //note
                c.push(td('')); //rId
                c.push(td(ur.user().name)); //LAST_UPDATED_BY,LAST_UPDATE_DATE,作者
                c.push(td('<a href="javascript://" class="btnDel">删除</a>')); //操作
                om.dv.find('tbody').prepend(tr(c.join(''), '_id="" class="edit" _type="' + type + '"'));
                gAuto.mfg(om.dv.find('tbody .txtMfg'));
            }).end().find('.btnSave').click(function () {
                om.update(this);
            }).end().find('.btnDel').live('click', function () {
                var otr = $(this).parent().parent();
                var id = otr.attr('_id');
                if (id && confirm('真的要删除该行吗？')) {
                    gf.callProc('up_co_delMain', [id, ur.user().id], function () { otr.addClass('del').disable(); });
                } else {
                    otr.remove();
                }
            }).end().find('tbody .btnEdit').live('click', function () {
                if ($(this).text() == '编辑') {
                    var otr = $(this).parent().parent();
                    var o = otr.find('td');
                    var type = otr.attr('_type');
                    if (type == 0) {//封装
                        o.eq(2).html(gf.fSelect(om.aPck, o.eq(2).attr('_id')));
                    } else if (type == '1') {//厂牌
                        o.eq(2).html(f.text(o.eq(0).text(), 'placeholder="输入厂牌" _id="' + o.eq(2).attr('_id') + '" class="txtMfg" ')); //rName
                    }
                    o.eq(3).html(gf.fSelect(om.aRank, o.eq(3).attr('_id')));
                    o.eq(4).html(f.text(o.eq(4).text()));
                    otr.addClass('edit');
                    $(this).text('保存');
                } else {
                    om.update(this);
                }
            }).end().draggable({ cancel: '.body,:button' });
            var a = gls.icMainPackage();
            for (var i = 0; i < a.length; i++) {
                this.aPck.push([a[i][2], a[i][1]]);
            }
        }
    },
    show: function (obj, id,name) {
        this.ini();
        this.coid = id; // $(obj).parent().parent().attr('_id');
        gf.show(obj, this.dv, { x: 'center', y: 30 });
        this.dv.find('.coname').text(name);
        this.get();
    },
    update: function (btn) {
        // 保存
        var om = this;
        var a = [], b = [], o = null, type = '';
        om.dv.find('tbody tr.edit').each(function () {
            o = $(this).find(':text,select');
            type = $(this).attr('_type');
            b.push(ur.user().id);
            b.push(om.coid);
            b.push($(this).attr('_id'));
            b.push(type); // type
            if (type == 0) {//封装
                b.push(o.eq(0).find('option:selected').text());
                b.push(o.eq(0).val());
            } else if (type == 1) { //厂牌
                b.push(o.eq(0).val());
                b.push(o.eq(0).attr('_id'));
            }
            b.push(o.eq(1).val());
            b.push(o.eq(2).val());
            a.push(b);
            b = [];
        });
        $(btn).disable();
        gf.callProcBatch('up_co_updateMain', a, function () {
            outputMsg('保存成功');
            om.get();
            $(btn).enable();
        });
    },
    get: function () {
        var om = this;
        gf.noPagination('up_co_getMain', [this.coid], function (a) {
            var b = [], c = [];
            //ID,type,rName,rank,note,rId,LAST_UPDATED_BY,LAST_UPDATE_DATE,作者
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                c.push(td(b[0])); //ID
                c.push(td(om.aType[b[1]])); //type
                c.push(td(b[2], '_id="' + b[5] + '"')); //rName
                c.push(td(om.aRank[b[3]])); //rank
                c.push(td(b[4])); //note
                c.push(td(b[5])); //rId
                c.push(td(f.authorDate_(b[8], b[7]))); //LAST_UPDATED_BY,LAST_UPDATE_DATE,作者
                c.push(td('<a href="javascript://" class="btnEdit">编辑</a><a href="javascript://" class="btnDel">删除</a>', 'class="command"'));
                a[i] = tr(c.join(''), '_id="' + b[0] + '" _type="' + b[1] + '"');
                c = [];
            }
            om.dv.find('tbody').html(a.join(''));
        });
    }
}

var mCompanyUpdate = {
    id: '',
    dv: null,
    dvHead: null,
    tbl: null,
    aTitle: [],
    aScr: [[0, '私有'], [1, '公开']],
    aSex: [['u', '未定'], ['f', '女'], ['m', '男']],
    aAddr: ['联络地址', '收货地址', '发票地址'],
    aProGet: ['up_co_getContactsOfCompany', 'up_co_getAddressOfCo2', 'up_co_getExpressOfCo'],
    aProUpdate: ['up_co_update_contact2', 'up_co_upate_addr', 'up_co_update_exress'],
    aExpress: [],
    dvMsg: null,
    btnCheck: null,
    btnSave: null,
    btnUnlock: null,
    similar: null,
    index: 0,
    star: 0,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvCompanyUpdate');
            this.dv.find('.close').click(function () { om.dv.hide(); }).end().draggable({ cancel: '.content,:button' });
            this.dvHead = this.dv.find('.head');
            this.dvMsg = this.dv.find('.dvMsg');

            this.btnSave = this.dv.find('.toolbar .btnSave');
            this.btnCheck = this.dv.find('.toolbar .btnCheck').click(function () {
                om.check();
            });

            this.similar = this.dv.find('.similar');
            this.btnUnlock = this.dv.find('.btnUnlock');


            this.tbl = this.dv.find('.lst table').hide();

            this.dv.find('.toolbar').find('.btnSave').click(function () {
                om.updateHead(this);
            }).end().find('.btnUnlock').click(function () {
                om.unlock();
            });


            this.dv.find('.lst .bar .switch a').click(function () {
                om.index = $(this).attr('_t');
                $(this).parent().find('a').removeClass('on').end().end().addClass('on');
                om.tbl.hide().eq(om.index).show();
                om.searchByMode();
            }).eq(0).click().end().end().find('.btnNewLine').click(function () { //新增行
                om.newline();
            }).end().find('.btnRefresh').click(function () {
                om.searchByMode();
            }).end().find('tbody .ways').live('click', function () {
                mContactMethod.show(this);
            }).end().find('.btnAllWays').click(function () {
                mContactMethod.showAll(this);
            });

            gAreaCom.ini();

            this.dvHead.find('.cmbArea').html(gAreaCom.html).end().find('.txtId').enterpress(function () {
                om.id = $(this).val();
                om.getBase();
                om.unlock();
            });

            this.aTitle = gls.titles();
            this.aExpress = gls.express();

            this.similar.find('a.sel').live('click', function () {// 选择相似公司
                om.id = $(this).parent().parent().attr('_id');
                om.getBase();
                om.unlock();
                om.similar.hide();
            });

            this.tbl.find('tbody a.save').live('click', function () {
                // 保存
                var t = $(this).parent().parent();
                if ($(this).text() == '保存') {
                    var a = [];
                    a.push($(t).attr('_id'));
                    a.push(om.id);
                    a.push(ur.user().id);
                    t.find(':text,select,textarea').each(function () { a.push($(this).val()); });
                    if (om.id > 0) {
                        gf.callProc(om.aProUpdate[om.index], a, function () {
                            om.searchByMode();
                            outputMsg('保存成功');
                        });
                    } else {
                        alert('请先添加公司信息，并且按保存按钮');
                    }
                } else if ($(this).text() == '编辑') {
                    $(this).text('保存');
                    var o = t.find('td');
                    if (om.index == 0) {// contact
                        o.eq(0).html(gf.fSelect(om.aScr, o.eq(0).attr('_id')));
                        o.eq(4).html(gf.fSelect(om.aSex, o.eq(4).attr('_id')));
                        o.eq(5).html(gf.fSelect(om.aTitle, o.eq(5).attr('_id')));
                    } else if (om.index == 1) {// address
                        o.eq(1).html(f.text(o.eq(1).text()));
                        o.eq(2).html(f.text(o.eq(2).text()));
                        o.eq(3).html(gf.fSelect(om.aAddr, o.eq(3).attr('_id')));
                        o.eq(4).html(f.text(o.eq(4).text()));
                    } else if (om.index == 2) {//express
                        o.eq(0).html(gf.fSelect(om.aExpress, o.eq(0).attr('_id')));
                        o.eq(1).html(f.text(o.eq(1).text()));
                    }
                }
            });
        }
    },
    outputMsg: function (txt) {
        this.dvMsg.fadeIn(300).text(txt);
    },
    check: function () {
        var om = this;
        var o = this.dvHead.find(':text.check');
        this.outputMsg('正在检查系统中是否存在相似公司名');
        var aType = ['完全匹配', '公司名相似', '联系方式相似'];
        gf.noPagination('up_co_check_company_name', [o.eq(0).val(), o.eq(2).val()], function (a) {
            if (a.length > 0) {
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    //0,ID,全称,Web_Site,日期
                    b = a[i];
                    c[0] = td('<a href="javascript://" class="sel">选择</a>', 'style="text-align:center;"');
                    c[1] = td(aType[b[0]]);
                    c[2] = td(b[2]); // 公司名
                    c[3] = td(b[3]); // 网址
                    c[4] = td(f.date(b[4]));
                    a[i] = tr(c.join(''), '_id="' + b[1] + '"');
                }
                om.similar.show().find('tbody').html(a.join(''));
                om.outputMsg('有相似公司名，请仔细检查，确认无误后点击强制解锁按钮。');
            } else { // 未检测到相似的公司名可以直接添加
                om.outputMsg('无相似公司，您可以正常添加');
                om.similar.hide();
                om.unlock();
            }
        });
    },
    show: function (t, id) { // 显示更新面板
        this.ini();
        if (id) {
            this.id = id;
            this.dvHead.find(':text,textarea,select').enable();
            this.getBase();
            this.similar.hide();
            this.btnUnlock.disable();
            this.btnSave.enable();
        } else {
            this.id = '';
            this.tbl.hide().find('tbody').empty();
            this.dvHead.find(':text,textarea').val('').end().find(':text,textarea,select').disable();
            this.btnSave.disable();
            this.btnUnlock.enable();
            var o = this.dvHead.find(':text.check').enable();
            o.eq(2).attr('placeholder', '网址、邮件地址、电话、IM等联系方式').attr('title', '输入网址、邮件地址、电话、IM等用以确定公司的唯一性');
            this.outputMsg('先输入公司名和网址、联系方式对公司进行唯一性检查');
        }
        gf.show(t, this.dv, { x: 'center', y: 'center' });
    },
    unlock: function () {
        this.btnSave.enable();
        this.dvHead.find(':text,textarea,select').enable();
        this.dv.find('.lst').show();
    },
    updateHead: function (obj) {
        var a = [];
        var om = this;
        a.push(this.id);
        a.push(ur.user().id);
        this.dvHead.find(':text:not(.notinc),textarea,select').each(function () { a.push($(this).val()); });
        $(obj).disable();
        a = f.trim_array(a);
        gf.callProc_with_value('up_co_updateCompany2', a, function (id) {
            om.id = id;
            om.getBase();
            outputMsg('保存公司信息成功');
            $(obj).enable();
        });
    },
    newline: function () {
        var a = [];
        if (this.index == 0) {//contact
            a.push(td(gf.fSelect(this.aScr))); // 隐私
            a.push(td('自动')); //编号
            a.push(td(f.text('', 'placeholder="姓氏"'))); //姓
            a.push(td(f.text('', 'placeholder="名字"'))); //名
            a.push(td(gf.fSelect(this.aSex))); //性别
            a.push(td(gf.fSelect(this.aTitle))); //职务
            a.push(td(f.text('', 'placeholder="1980-08-08"'))); //出生日期
            a.push(td(f.text('', placeholder = "添加备注"))); //备注
            a.push(td('')); //备注
        } else if (this.index == 1) {//address
            a.push(td('新增')); //默认
            a.push(td('<textarea></textarea>')); //地址
            a.push(td(f.text(''))); //简称
            a.push(td(gf.fSelect(this.aAddr))); //类型
            a.push(td(f.text(''))); //备注
        } else if (this.index == 2) {//express
            a.push(td('新增')); //默认
            a.push(td(gf.fSelect(this.aExpress)));
            a.push(td(f.text(''))); //快递号
        }
        a.push(td('<a href="javascript://" class="save">保存</a>', 'text-align:center;'));
        this.tbl.eq(this.index).find('tbody').prepend(tr(a.join(''), '_id=""'));
    },
    getBase: function () {
        var om = this;
        gf.getOneLine('up_co_getCompany', [this.id], function (a) {
            //全称,ID,主营,助记名,拼音码,柜台,隐私,评语,Web_Site,areaID,星级
            om.dvHead.find(':text,select,textarea').each(function (i) { $(this).val(a[i]); });
            om.star = a[10];
            if (om.star == 6) { //会员，会员不能被外部修改信息
                om.dv.hide();
                alert('该公司是系统会员，您不能修改会员公司信息');
            }
        });
        this.dv.find('.lst .bar .switch a').eq(0).click();
    },
    searchByMode: function () {
        var om = this;
        gf.noPagination(this.aProGet[this.index], [this.id], function (a) {
            var b = [], c = [];
            //ID,隐私,lastName,firstName,gender,TitleID,职务中文,出生日期,备注
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                if (om.index == 0) {//contact
                    c.push(td(b[1] == 0 ? '私有' : '公开', '_id="' + b[1] + '"')); //隐私
                    c.push(td(b[0]));
                    c.push(td(f.text(b[2]))); //lastName
                    c.push(td(f.text(b[3]))); //firstName
                    c.push(td(b[4] == 'm' ? '男' : '女', '_id="' + b[4] + '"')); //gender
                    c.push(td(b[6], '_id="' + b[5] + '"', '_id="' + b[5] + '"')); //TitleID
                    c.push(td(f.text(f.dateOnly(b[7])))); //出生日期
                    c.push(td(f.text(b[8]))); //备注
                    c.push(td('<a href="javascript://" class="ways">联系方式</a>', 'class="command"')); // 保存
                } else if (om.index == 1) {//address
                    //ID,默认,addr,simpleAddr,type,note,CREATED_BY,CREATION_DATE
                    c.push(td(b[0])); //默认
                    c.push(td(b[2])); //简称
                    c.push(td(b[3])); //addr
                    c.push(td(om.aAddr[b[4]], '_id="' + b[4] + '"')); //type
                    c.push(td(b[5])); //note
                } else if (om.index == 2) {//express
                    //ID,快递号,expId,名称,created_by
                    c.push(td(b[0])); //默认
                    c.push(td(b[3], '_id="' + b[2] + '"')); //名称
                    c.push(td(b[1])); //快递号
                }
                c.push(td('<a href="javascript://" class="save">编辑</a>', 'class="command"')); // 保存
                a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                c = [];
            }
            om.tbl.eq(om.index).find('tbody').html(a.join(''));
        });
    }
}

var mContactMethod = {
    id: '', // 联系人ID
    dv: null,
    dvAll: null,
    aType: [],
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvContactMethod');
            this.dvAll = $('#dvContactMethodAll');
            this.dvAll.find('.close').click(function () {
                om.dvAll.hide();
            }).end().find('.btnSetDefault').live('click', function () {
                gf.callProc('up_co_set_contactway_default', [$(this).parent().parent().attr('_id')], function () {
                    om.searchAll();
                });
            }).end().draggable({ cancel: '.body' });

            this.aType = gls.contactWayType();
            this.dv.find('tbody .save').live('click', function () {
                var t = $(this).parent().parent();
                var btn = $(this);
                if ($(this).text() == '保存') {
                    var a = [];
                    a.push($(t).attr('_id'));
                    a.push(om.id);
                    a.push(ur.user().id);
                    a.push($(t).attr('numid'));
                    t.find(':text,select').each(function () { a.push($(this).val()); });
                    btn.disable().text('...');
                    gf.getOneLine('up_co_update_contact_way3', a, function (ar) {
                        btn.enable().text('保存');
                        outputMsg('保存成功，您可以继续修改');
                        t.attr({ _id: ar[0], numid: ar[1] });
                    });
                } else if ($(this).text() == '编辑') {
                    $(this).text('保存');
                    var o = t.find('td');
                    o.eq(0).html(gf.fSelect(om.aType, o.eq(0).attr('_id')));
                    o.eq(1).html(f.text(o.eq(1).text()));
                    o.eq(2).html(f.text(o.eq(2).text()));
                    o.eq(3).html(f.text(o.eq(3).text()));
                }
            }).end().find('.btnSetDefault').live('click', function () {
                // 设置为默认联系方式
                gf.callProc('up_co_set_contactway_default', [$(this).parent().parent().attr('_id')], function () {
                    om.search();
                });
            }).end().find('.bar .btnNewLine').click(function () { // 添加新行
                var a = [];
                a.push(td(gf.fSelect(om.aType))); //类型
                a.push(td(f.text('', 'maxlength="4" placeholder="86"'))); //CC
                a.push(td(f.text('', 'maxlength="4" placeholder="755"'))); //AC
                a.push(td(f.text('', 'placeholder="电话,传真,邮件,IM号" maxlength="60"'))); //号码
                a.push(td(''));
                a.push(td('<a href="javascript://" class="save">保存</a>', 'class="command"'));
                om.dv.find('tbody').append(tr(a.join(''), '_id="" numid=""'));
            }).end().find('.close').click(function () { om.dv.hide(); }).end().find('tbody select').live('change', function () {
                var v = $(this).val();
                var o = $(this).parent().parent().find(':text');
                if (v > 9) { o.eq(0).disable(); o.eq(1).disable(); }
                else { o.enable(); }
            }).end().find('.btnRefresh').click(function () { om.search(); }).end().draggable({ cancel: '.body' });
        }
    },
    show: function (obj) {
        this.ini();
        var otr = $(obj).parent().parent();
        var tds = otr.find(':text');
        this.id = otr.attr('_id');
        gf.show(obj, this.dv, { x: 'center', y: -100 });
        this.dv.find('.contact b').text(tds.eq(0).val() + ' ' + tds.eq(1).val());
        this.search();
    },
    showAll: function (obj) {// 显示所有联系方式
        this.ini();
        gf.show(obj, this.dvAll, { x: 'center', y: 'center' });
        this.searchAll();
    },
    searchAll: function (obj) {// 查询该公司的所有联系方式
        var om = this;
        //ID,联系人,类型,CC,AC,号码,默认
        gf.noPagination('up_co_get_waysOfCompany', [mCompanyUpdate.id], function (a) {
            if (a.length > 0) {
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(b[1])); //联系人
                    c.push(td(b[2])); //类型
                    c.push(td(b[3])); //CC
                    c.push(td(b[4])); //AC
                    c.push(td(b[5])); //号码
                    c.push(td(b[6] == '1' ? '默认' : '<a href="javascript://" class="btnSetDefault" title="一个公司只可以设置一个默认联系方式">设为默认</a>', 'class="command"')); //默认
                    c.push(td('<a href="javascript://" class="save">编辑</a>', 'class="command"'));
                    a[i] = tr(c.join(''), '_id="' + b[0] + '"');
                    c = [];
                }
                om.dvAll.find('tbody').html(a.join(''));
            }
        });
    },
    search: function () {
        var om = this;
        //ID,号码ID,类型ID,CC,AC,号码,类型EN,默认,隐私,uID,name,类型
        gf.noPagination('up_co_get_waysOfContact2', [this.id], function (a) {
            if (a.length > 0) {
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(b[11], '_id="' + b[2] + '"')); //类型
                    c.push(td(b[3])); //CC
                    c.push(td(b[4])); //AC
                    c.push(td(b[5])); //号码
                    c.push(td(b[7] == '1' ? '默认' : '<a href="javascript://" class="btnSetDefault" title="一个公司只可以设置一个默认联系方式">设为默认</a>', 'class="command"')); //默认
                    c.push(td('<a href="javascript://" class="save">编辑</a>', 'class="command"'));
                    a[i] = tr(c.join(''), '_id="' + b[0] + '" numid="' + b[1] + '"');
                    c = [];
                }
                om.dv.find('tbody').html(a.join(''));
            }
        });
    }
}

var gAreaCom = {
    html: '',
    ini: function () {
        var om = this;
        //ID,名称,parentID 
        var a = gls.coarea();
        var b = [], c = [], d = [], e = [];
        b = this.get(a, -1);
        for (var i = 0; i < b.length; i++) {
            c = b[i];
            d.push('<optgroup label="' + c[1] + '"><option value="' + c[0] + '">' + c[1] + '</option>');
            e = this.get(a, c[0]);
            d.push(om.fOption(e));
            d.push('</optgroup>');
        }
        this.html = d.join('');
    },
    fOption: function (a) {
        var b = [], c = [];
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            c.push('<option value="' + b[0] + '">' + b[1] + '</option>');
        }
        return c.join('');
    },
    get: function (a, v) {
        var b = [], c = [];
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            if (b[2] == v) c.push(a[i]);
        }
        return c;
    }
}