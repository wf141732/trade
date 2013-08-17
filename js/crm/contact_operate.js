/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />

var gcontact = {
    coid: '',
    conid: '',
    numberid: '',
    dv: null,
    dv_contact: null,
    ini: function () {
        var om = this;
        this.dv = $('#cus_contact');
        this.dv_contact = $('#pnlUContact');
        this.dv_contact.find('.close').click(function () { om.dv_contact.hide(); }).end().find('.bttnsave').click(function () {
            // 修改联系人
            var bttn = $(this).disable();
            var a = [];
            var i;
            a[0] = om.conid;
            a[1] = om.coid; //coid 公司ID
            a[2] = ur.user().id;
            om.dv_contact.find('table td').find(":text").each(function (i) {
                a[i + 3] = $(this).val();
            }).end().find('select').each(function (i) {
                a[i + 6] = $(this).val();
            });
            a = f.trim_array(a);
            gf.callProc('up_co_update_contact', a, function () {
                bttn.enable();
                outputMsg('保存成功');
                om.dv_contact.hide();
                om.get_contacts();
            });
        }).end().draggable({ handle: this.dv_contact });

        this.dv.find('.close').click(function () { om.dv.hide(); }).end().find('.bttnAddcontact').click(function () {
            om.conid = '';
            om.show_contact(this);
        }).end().draggable({ handle: this.dv.find('.title') });

        $("#cmbTitle").foption2(gls.titles());
        gways.ini();
    },
    del: function (obj) {
        var id = $(obj).parent().attr('_id');
        var uid = $(obj).parent().attr('uid');
        if (gf.isAuthorOrSysAdmin(uid)) {
            if (confirm('真的要删除 ' + $(obj).parent().find("td:eq(0)").text() + ' 吗？')) {
                if (uid == ur.user().id || ur.user().roleid == 1) {
                    gf.callProc('up_co_del_contact', [id], function () {
                        $(obj).parent().remove();
                        outputMsg('成功删除');
                    });
                } else {
                    alert('该联系人不是您添加的，您无权删除，如果确实要执行此操作，请与管理员联系。');
                }
            }
        } else alert('您不能删除其他人添加的联系方式！');
    },
    show_contact: function (obj) {
        var o = this.dv_contact;
        var bttn = o.find('.bttnsave');
        if (this.conid) { // 修改
            gf.getOneLine('up_co_getContactDetails', [this.conid], function (a) {
                o.find(':text,select').each(function (i) { $(this).val(a[i]); });
            });
            bttn.val('修改');
        } else {
            bttn.val('添加');
            o.find(':text').val('');
        }
        gf.show(obj, o, { x: 'center', y: 30 });
    },
    show: function (obj) {
        var tr = $(obj).parent().parent();
        this.coid = tr.attr('coid');
        this.get_contacts();
        gf.show(obj, this.dv, { x: -400, y: 60 });
        var company = tr.find('td:eq(1)').text();
        this.dv.find('.title b').text(company);
    },
    showAtTr: function (t) {
        this.coid = $(t).attr('coid');
        this.get_contacts();
        gf.show(t, this.dv, { x: 200, y: 60 });
        var company = $(t).find('td:eq(1)').text();
        this.dv.find('.title b').text(company);
    },
    get_contacts: function () {
        var ag = ['女', '男', '未定']; //0 女 1 男 2 未定
        // 设置按钮
        // 清空联系方式面板
        var om = this;
        if (this.coid) {
            //id,gender,name,备注,职务中文,firstname,lastname,titleId,uID
            //id,name_cn,gender,职务中文,备注,firstname,lastname,titleId,uID
            gf.noPagination('up_co_get_cocontacts', [this.coid], function (a) {
                if (a.length > 0) {
                    var b = [], ac = [];
                    for (var i = 0; i < a.length; i++) {
                        b = a[i];
                        ac[0] = td(b[1], 'class="' + b[2] + ' username" style="text-align:left;"');
                        ac[1] = td(b[3], 'style="text-align:left;"');
                        ac[2] = td('', 'onclick="gcontact.del(this)" class="del"');
                        a[i] = tr(ac.join(''), '_id="' + b[0] + '"  uid="' + b[8] + '"');
                    }
                    om.dv.find('tbody').html(a.join('')).find("tr").dblclick(function () { om.conid = $(this).attr('_id'); om.show_contact(this); }).click(function () {
                        selectRow($(this));
                        om.conid = $(this).attr('_id');
                        gways.search(om.conid);
                    }).eq(0).click();
                } else gf.outputMsgInTbl('未添加联系人', om.dv.find('table'));
            });
        } else {
            alert('请选择公司！');
        }
    }
}

var gways = {// 联系方式
    id: '', // 联系方式ID
    conid: '', // 联系人ID
    numberid: '', // 号码ID
    dv: null,
    dv_modify: null, // 修改号码面板
    dv_add: null, // 添加号码面板
    txtNumber: null,
    ini: function () {
        var om = this;
        this.dv = $('#dv_ways');
        this.dv.append('<div class="dv_add"><select class="type" style="width:60px;"></select><input type="text" style="width:30px;" title="国家代号" id="txtcccode" class="ext" /><input type="text" style="width:30px;display:none;" title="区号" class="ext" /><input class="txtNumber" type="text" style="width:150px;"  /><select id="cmbPrivacy" style="display:none;"><option value="2" selected="selected" >公开</option><option value="1">不公开</option></select><input type="button" value="添加" class="bttnadd" title="添加联系方式" /></div><ul class="address" ></ul>');
        this.dv_add = this.dv.find('.dv_add');
        this.txtNumber = this.dv_add.find('.txtNumber');

        this.dv.find('.close').click(function () { om.dv.hide(); }).end().draggable({ handle: this.dv.find('.title') });

        this.dv_modify = $('<div id="dv_modify_number" class="gwin"><div class="number"><select class="type" style="width:60px;"></select><input type="text" style="width:35px;" class="ext" title="国家代号" /><input type="text" style="width:40px;"  class="ext" title="区号" /><input type="text" style="width:140px;" /></div><div class="toolbar"><input type="button" class="bttnsave"  value="确定修改" /><input type="button" value="离开" class="close" /></div></div>');
        this.dv_modify.appendTo($('body'));
        this.dv_modify.find('.close').click(function () { om.dv_modify.hide(); }).end().find('.bttnsave').click(function () {
            // 直接修改号码表
            var a = [om.numberid];
            var bttn = $(this).disable();
            om.dv_modify.find('.number :text').each(function (i) {
                a[i + 1] = $(this).val();
            });
            a = f.trim_array(a);
            gf.callProc('up_co_update_number2', a, function () {
                outputMsg('修改号码表成功');
                bttn.enable();
                om.dv_modify.hide();
            });
        });


        this.dv_modify.find('.type').change(function () {
            var v = $(this).val();
            var o = om.dv_modify.find('.ext').hide().val('');
            if (v == '1' || v == '3') {
                o.eq(0).show();
            } else if (v == '2' || v == '4') { //固话、传真
                o.show();
            }
        }).end().find('.ext').dblclick(function () {
            // 获取该联系人所在国家、地区的区号
            gf.getOneLine('up_co_get_CCAC', [om.conid], function (a) {
                var o = om.dv_modify.find('.ext');
                o.eq(0).val(a[0]);
                o.eq(1).val(a[1]);
            });
        });

        this.dv_add.find('.type').change(function () {
            var v = $(this).val();
            var o = om.dv_add.find('.ext').hide().val('');
            if (v == '1' || v == '3') {
                o.eq(0).show();
            } else if (v == '2' || v == '4') { //固话、传真
                o.show();
            }
        }).end().find('.bttnadd').click(function () {// 添加联系方式
            var a = [];
            om.dv_add.find(':text,select option:selected').each(function (i) {
                a[i] = $(this).val();
            });
            // 号码要去掉空格
            if (a[3] && om.conid) {
                a[4] = om.conid;
                a[5] = ur.user().id;
                a = f.trim_array(a);
                gf.callProc('up_co_add_contact_way', a, function () {
                    // 添加到列表框
                    outputMsg("操作成功");
                    om.search();
                });
            } else {
                alert("号码不能为空，并且要选定联系人"); return;
            }
        }).end().find('.ext').dblclick(function () {
            // 获取该联系人所在国家、地区的区号
            gf.getOneLine('up_co_get_CCAC', [om.conid], function (a) {
                var o = om.dv_add.find('.ext');
                o.eq(0).val(a[0]);
                o.eq(1).val(a[1]);
            });
        });

        gf.noPagination('up_option_optContactWayType', [], function (a) {
            om.dv_add.find('select').foption2(a);
            om.dv_modify.find('select').foption2(a);
        });

        if (this.txtNumber.size() > 0) gAuto.number_only(this.txtNumber);

    },
    del: function (obj) {
        // 删除联系方式
        // 只有添加者和系统管理员才有权限删除
        var otr = $(obj).parent();
        var id = otr.attr('_id');
        if (gf.isAuthorOrSysAdmin(otr.attr('uid'))) {
            gf.callProc_with_value('up_co_del_contactway', [id], function (v) {
                otr.addClass('del');
            });
        } else alert('您不能删除其他人添加的联系方式');
    },
    show: function (obj) {
        this.conid = $(obj).attr('_id');
        gf.show(obj, this.dv, { x: 30, y: 60 });
        this.dv.find('.title b').text($(obj).text());
        this.search(this.conid);
    },
    show_modify: function (obj) {// 显示修改面板
        gf.show(obj, this.dv_modify, { x: -100, y: 60 });
        var a = JSON.parse($(obj).parent().attr('data'));
        //ID,号码ID,类型ID,CC,AC,号码,类型EN,默认,隐私
        var o = this.dv_modify.find('.number .ext').hide();
        o.find('.number :text').each(function (i) { $(this).val(a[i + 3]); });
        this.numberid = a[1];
        var v = a[2];
        if (v == '1' || v == '3') {
            o.eq(0).show();
        } else if (v == '2' || v == '4') { //固话、传真
            o.show();
        }
    },
    search: function (conid) {
        var o = this.dv.find('.address');
        if (conid) this.conid = conid;
        //ID,号码ID,类型ID,CC,AC,号码,类型EN,默认,隐私,uID
        gf.noPagination('up_co_get_waysOfContact2', [this.conid], function (a) {
            if (a.length > 0) {
                var b = [], c = [], d = [];
                var defalut = '';
                var cnt = 0;
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c[0] = b[3]; c[1] = b[4]; c[2] = b[5];
                    d = [];
                    cnt = 0;
                    for (var j = 0; j < c.length; j++) {
                        if (c[j]) d[cnt++] = c[j];
                    }
                    b[5] = d.join('-');
                    if (b[8] == '1') {
                        b[5] += '(首选' + b[5] + ')';
                        defalut = ' default ';
                    } else {
                        defalut = '';
                    }
                    a[i] = '<li class="' + defalut + b[6] + '" data=\'' + JSON.stringify(a[i]) + '\' _id="' + b[0] + '" numid="' + b[1] + '" uid="' + b[9] + '" ><a href="javascript://" onclick="gways.show_modify(this);" >' + b[5] + '</a><a href="javascript://" onclick="gways.del(this);" class="del"><img src="../images/cross.gif" title="删除该联系方式" /></a></li>';
                }
                o.html(a.join('')).find('li').click(function () {
                    $(this).parent().find('li.selected').removeClass('selected').end().end().addClass('selected');
                });
            } else o.empty();
        });
    }
}
