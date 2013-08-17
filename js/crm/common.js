/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
var gGroupType = ['一般分组', '客户分组', '供货商分组', '客户-供货商'];
var gcofrm = {
    afrm: [],
    data: [],
    map: function (v) {
        var name = this.afrm[v];
        if (name) return name;
        else return '';
    },
    ini: function () {
        this.data = gls.cofrm();
        this.data.unshift(['', '全部']);
        this.f(this.data);
    },
    f: function (a) {
        var b = [];
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            this.afrm[b[0]] = b[1];
        }
    },
    getData: function () {
        if (this.data.length>0) return this.data;
        else {
            this.ini();
            return '';
        }
    }
}

var mgroup = {
    groupid: 0,
    dv: null,
    cmbGroup: null,
    aType: ['', '客户', '供货商', '客-供'],
    ini: function () {
        var om = this;
        $('body').append('<div id="dv_group" class="gwin"><img src="../images/f/close.gif" class="close" alt="关闭" /><div class="title">添加分组</div><table class="update"><tr><th>组名</th> <td><input type="text" /> </td></tr><tr><th>性质</th> <td><select><option value="1" selected="selected" >客户</option><option value="2">供货商</option><option value="3">客-供</option></select></td></tr><tr><th>隐私</th> <td><select><option value="0" selected="selected" >私有</option><option value="1">公司内部</option><option value="2">外部分享</option></select></td></tr></table><div class="toolbar"><input class="bttnsave" type="button" value="保存" /><input type="button" class="close" value="取消" /></div></div>');
        this.dv = $('#dv_group');
        this.dv.find('.close').click(function () {
            om.dv.hide();
        }).end().find('.bttnsave').click(function () {
            // 更新组
            var a = [];
            a[0] = om.groupid;
            a[4] = '';
            a[5] = ur.user().id;
            om.dv.find('td').find(':text,select option:selected').each(function (i) {
                a[i + 1] = $(this).val();
            });
            gf.callProc('up_co_update_igroup', a, function () {
                om.dv.hide();
            });
        }).end().draggable({ handle: this.dv.find('.title') });

        this.cmbGroup = $('#cmbGroup').change(function () {
            om.groupid = $(this).val();
            if (om.groupid == -1) om.dv.show();
        });
        gf.noPagination('up_option_coIGroup', [ur.user().id], function (a) {
            if (a.length > 0) {
                a = group_array(a, 2);
                for (var t in a) a[t] = om.fone(a[t], t);
                om.cmbGroup.html('<option selected="-2">选择我的分组...</option>' + a.join('') + '<option disabled="disabled"  style="color: #ccc" value="-2">-----</option><option value="-1">&nbsp;&nbsp;新建组...</option>');
            }
        });
    },
    show: function (obj) {
        this.groupid = '';
        gf.show(obj, this.dv, { x: -400, y: 30 });
    },
    showModify: function (obj) {
        var om = this;
        gf.show(obj, this.dv, { x: -400, y: 30 });
        this.groupid = $(obj).parent().attr('_id');
        //组名,性质,隐私
        gf.getOneLine('up_co_get_igroupDetails', [this.groupid], function (a) {
            om.dv.find(':text,select').each(function (i) { $(this).val(a[i]); });
        });
    },
    fone: function (a, g) {
        var b = [];
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            a[i] = '<option value="' + b[0] + '">' + b[1] + '</option>';
        }
        return '<optgroup label="' + this.aType[g] + '">' + a.join('') + '</optgroup>';
    },
    addContact: function (obj) {// 添加我的联系人，如果所在公司还未添加到分组，则添加
        if (this.groupid > 0) {
            var conid = $(obj).parent().attr('_id');
            gf.callProc('up_co_update_icontact', [this.groupid, conid, ur.user().id], function () {
                $(obj).parent().addClass('done');
            });
        } else alert('请选择分组');
    }
}

var gmfgpck = {
    coid: '',
    dv: null,
    ini: function () {
        this.dv = $('#dv_mfgpck');
        pck_submenu($('#myslidemenu>ul li'));
        var txts = this.dv.find(':text.mfg');
        gAuto.mfg(txts);
        $('#bttnAddMfg2Search').click(function () {
            var t = find(':text');
            gadd2mfglst(t.attr('_id'), t.val());
        });
        gOption.option(this.dv.find('.highlevel'), 'up_option_mfgMfg', [1]);

        this.dv.find('.highlevel').dblclick(function () {
            var itm = $(this).find('option:selected');
            gadd2mfglst(itm.val(), itm.text());
        }).end().find('.target').dblclick(function () {
            var itm = $(this).find('option:selected');
            if (itm.length > 0) {
                // 删除厂牌
                gf.callProc('up_co_del_main_mfg',[itm.val()],function () {
                    itm.remove();
                });
            }
        }).end().draggable({ handle: this.dv });

        $('#cmbPck').dblclick(function () {
            var itm = $(this).find('option:selected');
            if (itm.length > 0) {
                // 删除封装
                gf.callProc('up_co_del_main_pck', [itm.val()], function () {
                    itm.remove();
                });
            }
        });
    },
    show: function (obj) {
        var om = this;
        this.coid = $(obj).parent().attr('_id');
        gf.show(obj, this.dv, { x: -120 });
        //ID,厂牌
        gOption.option(om.dv.find('.target'), 'up_co_get_mfgs', [this.coid]);
        gOption.option($('#cmbPck'), 'up_co_get_pcks', [this.coid]);
    }
}


function gadd2mfglst(mfgid,mfgname) {
    var a = [];
    if (mfgid) {
        a[0] = gIdCrrnt;
        a[1] = mfgid;
        a[2] = ur.user().id;
        gf.callProc_with_value('up_co_add_main_mfg',a,function (data) {
            if (data > 0) {
                $('#dv_mfgpck .target').append('<option value="' + data + '">' + mfgname + '</option>');
            }
        });
    }
}


function gf_star(id, v) {
    var a = [];
    for (var i = 1; i <= 5; i++) a[i] = fs('star_' + id, i.toString(), v);
    return a.join('');
    function fs(nm, cnt, v) {
        var chk = cnt == v ? 'checked="checked"' : '';
        return '<input name="' + nm + '" type="radio" value="' + cnt + '" ' + chk + ' _id="' + id + '" />';
    }
}