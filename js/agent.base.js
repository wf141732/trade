/// <reference path="jquery-1.8.0.js" />
/// <reference path="base.js" />
/// <reference path="base.lov.js" />
/// <reference path="jquery-ui-1.9.2.custom.js" />

var agent = agent || {},user = user || {};

agent.productLovMutil = (function () {
    var o = { dv: null, categUl: null }, callback = null, source = 'oe',
    iniAttrDefin = function () {
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.product) {
                var t = o.tbl.find('thead .' + k).show(), pa = ur.config().attributeDefin.product[k];
                t.show();
                t.find('a').text(pa.label);
            }
        }
    },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvProductMutil');
            o.categUl = o.dv.find('.sidebar ul');
            o.categUl.find('li a').live('click', function () {
                getProduct(this);
            });
            o.tbl = o.dv.find('.report-results table');
            o.tbl.find('tbody tr input:checkbox').live('change', function () {
                checkedProduct(this);
            });
            o.tbl.find('thead tr :checkbox').click(function () {
                checkedAll(this);
            })
            o.dv.find('.modal-footer .btn-success').click(function () {
                selected();
            });
            o.dv.find('.close').click(function () {
                callback([]);
            })
            iniAttrDefin();
        }
    },

    selected = function () { //点击确定选择后
        var a = [];
        o.tbl.find('tbody tr :checked').each(function () {
            var b = [];
            b.push($(this).val());
            var tds = $(this).parents('tr').find('td');
            b.push(tds.eq(1).text());
            b.push(tds.eq(2).text());
            b.push(tds.eq(3).text());
            b.push($(this).attr('data-barcode'));
            b.push('');
            b.push('');
            b.push(tds.eq(5).text());
            b.push(tds.eq(6).text());
            a.push(b);
        })
        o.dv.modal('hide');
        if (callback) callback(a);
    },
    checkedAll = function (obj) {
        var cc = o.tbl.find('tbody:visible tr :checkbox'),
            checked = o.tbl.find('tbody:visible :checkbox:checked'),
            all = o.tbl.find('tbody:visible :checkbox'),
            c = o.dv.find('.page-header c');
        if ($(obj).attr('checked')) {
            cc.attr('checked', 'checked');
            c.html(all.size() - checked.size() + parseInt(c.html()));
        }
        else {
            cc.removeAttr('checked');
            c.html(parseInt(c.html()) - checked.size());
        }
    },
    checkedProduct = function (obj) {
        var c = o.dv.find('.page-header c');
        if ($(obj).attr('checked')) c.html(parseInt(c.html()) + 1);
        else c.html(parseInt(c.html()) - 1);
    }
    fdataCategory = function (a) {
        var li = [], format = '<li><a href="#" data-id="{0}">{1}</a></li>';
        for (var i = 0, l = a.length; i < l; i++) {
            //li.push(String.format.apply(null, [format].concat(a[i])));
            li.push('<li><a href="#" data-id="' + a[i][0] + '">' + a[i][1] + '</a></li>');
        }
        o.categUl.html(li.join('')).find('li:eq(0) a').click();
    },
    fdataProduct = function (a, tbody) {
        var tr = [], b = [],
            format = '<tr><td><input type="checkbox" value="{0}" data-barcode="{8}"/></td><td>{1}</td><td>{2}</td><td><small>{4}</small></td><td></td><td class="number">{7}</td></tr>';
        for (var i = 0, l = a.length; i < l; i++) {
            //tr.push(String.format.apply(null, [format].concat(a[i])));
            //tr.push('<tr><td><input type="checkbox" value="' + a[i][0] + '" data-barcode="' + a[i][8] + '"/></td><td>' + a[i][1] + '</td><td>' + a[i][2] + '</td><td><small>' + a[i][4] + '</small></td><td></td><td class="number">' + a[i][7] + '</td></tr>');
            b = [];
            b.push(dom.td('<input type="checkbox" value="' + a[i][0] + '" data-barcode="' + a[i][8] + '"/>'));
            b.push(dom.td(a[i][1]));
            b.push(dom.td(a[i][2], 'class="number"'));
            b.push(dom.td('/<small>' + a[i][4] + '</small>'));
            b.push(dom.td(a[i][7]));

            if (o.tbl.find('thead th:eq(5)').css('display') != 'none') {
                b.push(dom.td(a[i][9]));
            }
            else {
                b.push(dom.td('', 'display:none'));
            }
            if (o.tbl.find('thead th:eq(6)').css('display') != 'none') {
                b.push(dom.td(a[i][10]));
            }
            else {
                b.push(dom.td('', 'display:none'));
            }
            tr.push(dom.tr(b.join('')));
            //tr.push('<tr><td><input value="' + a[i][0] + '" type="checkbox"/></td><td>' + a[i][1] + '</td><td class="number">' + a[i][2] + '</td><td><small>/' + a[i][4] + '</small></td><td class="number">' + (a[i][7] || '') + '</td><td></td></tr>');
        }
        tbody.html(tr.join(''));
        o.dv.find('.page-header').find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    }
    getCategory = function () {
        if (source == 'oe') {
            pgf.codeData('category', [ur.user().erpID], function (a) {
                fdataCategory(a);
            })
        }
        else {
            gf.noPagination('up_member_getProductCategory', [o.agentId], function (a) {
                fdataCategory(a);
            }, 1)
        }
    },
    getProduct = function (cat) {//获取产品列表
        o.categUl.find('.active').removeClass('active');
        o.tbl.find('thead tr :checkbox').removeAttr('checked');
        var id = $(cat).parent().addClass('active').end().attr('data-id');
        o.tbl.find('tbody').hide();
        var tbody = o.tbl.find('tbody[data-id=' + id + ']');
        if (tbody.size() > 0) {
            tbody.show();
        }
        else {
            tbody = $('<tbody data-id="' + id + '"></>').prependTo(o.tbl);
            if (source == 'oe') {
                pgf.codeData('product', [id], function (a) {
                    fdataProduct(a, tbody);
                });
            }
            else {
                gf.noPagination('up_member_getProduct', [id], function (a) {
                    fdataProduct(a, tbody);
                });
            }
        }
    };
    o.show = function (callbk, src, agentId) {
        ini();
        callback = callbk;
        source = src || 'oe';
        o.agentId = agentId || ur.user().agentId;
        o.dv.modal({ backdrop: 'static' });
        getCategory();
        o.tbl.find(':checkbox:checked').removeAttr('checked');
        o.dv.find('.page-header c').html(0);
    }
    return o;
})()

agent.productLov = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvProductLov' }), callback,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr').live('click', function () {
                selectedProduct($(this));
            })
        }
    },
    selectedProduct = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tr.attr('data-barcode');
        p.name = tds.eq(0).text();
        p.price = tds.eq(1).text();
        p.uom = tds.eq(2).text();
        o.dv.modal('hide');
        callback ? callback(p) : null;
    },
    getProduct = function (code) {
        gf.noPagination('up_member_getProductByName', [ur.user().agentId, code], function (a) {
            var li = [], format = '<tr data-id="{0}" data-barcode="{8}"><td>{1}</td><td>{2}</td><td><small>{4}</small></td><td>{7}</td></tr>';
            for (var i = 0, len = a.length; i < len; i++) {
                li.push(String.format.apply(null, [format].concat(a[i])));
            }
            if (a.length == 1) {
                selectedProduct($(li[0]));
            }
            else {
                o.tbl.find('tbody').html(li);
            }
        })
    };
    o.show = function (callbk, filter, type) {
        ini();
        callback = callbk;
        o.dv.modal({ backdrop: false });
        getProduct(filter || '');
    };
    return o;
})()

agent.memberLov = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvMemberLov' }), callback,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr').live('click', function () {
                selectedPartner($(this));
            })
        }
    },
    selectedPartner = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tds.eq(1).text();
        p.name = tds.eq(2).text();
        p.discount = tr.attr('data-discount');
        o.dv.modal('hide');
        callback ? callback(p) : null;
    },
    getPartner = function (type, code) {
        gf.noPagination('up_member_stroeMemeber2', [ur.user().agentId, code || ''], function (a) {
            var li = [], format = '<tr data-id="{0}" data-discount="{6}"><td></td><td>{1}</td><td>{2}</td><td>{5}</td><td>{3}</td><td></td></tr>';
            for (var i = 0, len = a.length; i < len; i++) {
                li.push(String.format.apply(null, [format].concat(a[i])));
            }
            if (a.length == 1) {
                selectedPartner($(li[0]));
            }
            else {
                o.tbl.find('tbody').html(li);
            }
        })
    };
    o.show = function (callbk, filter, type) {
        ini();
        callback = callbk;
        o.dv.modal({ backdrop: false });
        getPartner(type||'',filter || '');
    };
    return o;
})()

agent.partnerLov = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPartnerLov', proc: 'up_member_stroeCustomer1', procCus: 'up_member_stroeCustomer1',
        procVendor: 'up_member_stroeVendorLov'
    }), callback,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr').live('click', function () {
                selectedPartner($(this));
            })
        }
    },
    selectedPartner = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tds.eq(1).text();
        p.name = tds.eq(2).text();
        p.discount = tr.attr('data-discount');
        o.dv.modal('hide');
        callback ? callback(p) : null;
    },
    getPartner = function (type, code) {
        gf.noPagination(o.proc, [ur.user().agentId, code || ''], function (a) {
            var li = [], format = '<tr data-id="{0}" data-discount="{6}"><td></td><td>{1}</td><td>{2}</td><td>{5}</td><td>{3}</td><td></td></tr>';
            for (var i = 0, len = a.length; i < len; i++) {
                li.push(String.format.apply(null, [format].concat(a[i])));
            }
            if (a.length == 1) {
                selectedPartner($(li[0]));
            }
            else {
                o.tbl.find('tbody').html(li);
            }
        })
    };
    o.show = function (callbk, filter, type) {
        ini();
        callback = callbk;
        o.dv.modal({ backdrop: false });
        o.proc = o.procCus;
        if (type == 'vendor') {
            o.proc = o.procVendor;
        }
        getPartner(filter || '');
    };
    return o;
})()

agent.partnerMemberLov = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPartnerLov' }), callback,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr').live('click', function () {
                selectedPartner($(this));
            })
        }
    },
    selectedPartner = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tds.eq(1).text();
        p.name = tds.eq(2).text();
        p.discount = tr.attr('data-discount');
        o.dv.modal('hide');
        callback ? callback(p) : null;
    },
    getPartner = function (type, code) {
        gf.noPagination('up_member_stroeCustomerMember', [ur.user().agentId, code || ''], function (a) {
            var li = [], format = '<tr data-id="{0}" data-discount="{6}"><td></td><td>{1}</td><td>{2}</td><td>{5}</td><td>{3}</td><td></td></tr>';
            for (var i = 0, len = a.length; i < len; i++) {
                li.push(String.format.apply(null, [format].concat(a[i])));
            }
            if (a.length == 1) {
                selectedPartner($(li[0]));
            }
            else {
                o.tbl.find('tbody').html(li);
            }
        })
    };
    o.show = function (callbk, filter, type) {
        ini();
        callback = callbk;
        o.dv.modal({ backdrop: false });
        getPartner(filter || '',filter);
    };
    return o;
})()

agent.partnerLovTree = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPartnerLovTree' }), callback,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr l').live('click', function () {
                selectedPartner($(this));
            });
            o.dv.modal({ backdrop: false });
            o.dv.on('hidden', function () {
                callback ? callback() : null;
            });
        }
    },
    selectedPartner = function (l) {
        var data = JSON.parse($(l).attr('data'));
        var p = {};
        p.id = data[1];
        p.code = data[2];
        p.name = data[3];
        p.uname = data[6];
        p.mobile = data[7];
        callback ? callback(p) : null;
    },
    getPartner = function (code) {
        if (o.tbl.find('tbody tr').size() > 0)
            return;
        gf.noPagination('up_member_getAgentTree1', [ur.user().agentId, code || ''], function (b) {
            var li = [], format = "<tr id={1} rank={4} class='{5}'><td><l data='{8}'>[{2}]{3}</l></td></tr>";
            for (var i = 0, len = b.length; i < len; i++) {
                var a = b[i];
                a[5] = (a[4] == a[5]) ? '' : ('child-of-' + a[0]);
                a[2] = a[2] || '';
                a.push(JSON.stringify(a));
                li.push(String.format.apply(null, [format].concat(a)));
            }
            o.tbl.find('tbody').html(li.join(''));
            o.tbl.treeTable({ indent: 19 });
        })
    };
    o.show = function (callbk) {
        ini();
        callback = callbk;
        o.dv.modal('show');
        getPartner();
    };
    return o;
})()

agent.config = (function () {
    var o = { dv: null, dvId: 'dvConfig', fmPwd: null, fmInfo: null },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvConfig');
            o.fmPwd = o.dv.find('.pwd');
            o.fmInfo = o.dv.find('.info');
            o.pwdInputs = o.fmPwd.find('input');
            o.infoInputs = o.fmInfo.find('input');
            o.infoInputs.eq(1).click();
            o.fmPwd.find('button').click(function () {
                changpwd();
                return false;
            })
            o.fmInfo.find('button').click(function () {
                changInfo();
                return false;
            });
            gf.getOneLine('up_member_getInfo', [ur.user().agentId], function (a) {
                o.infoInputs.eq(0).val(a[0]);
                if (a[1] != 'SaleOut') {
                    o.infoInputs.eq(2).click();
                }
            });
            if (ur.user().role != 1) {
                o.fmInfo.hide();
            }
        }
    },
    changpwd = function () {
        if (o.pwdInputs.eq(1).val() != o.pwdInputs.eq(2).val()) {
            gtips.showNotice('两次密码输入不一致！');
            return;
        }
        gf.callProc_with_value('up_member_changPwd', [ur.user().id, o.pwdInputs.eq(0).val(), o.pwdInputs.eq(1).val()], function (o) {
            if (o === 0) {
                gtips.showNotice('原始密码');
            }
            else {
                alert('密码更改成功,将重新登陆！');
                //window.location = '/shop/my_account.shtml';
                window.location = base.STATIC.LOGIN_PATH;
            }
        });
    },
    changInfo = function () {
        var stocktype = o.fmInfo.find(':radio:checked').val();
        gf.callProc_with_value('up_member_updInfo', [ur.user().id, ur.user().agentId, o.infoInputs.eq(0).val(), stocktype], function (o) {
            alert('修改成功！');
        });
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
})();

agent.member = (function () {
    var o = $.extend({}, _cmbAddress, gobj, gpagination, {
        id: '',
        agentId: '',
        fields: 'ID,memberNo,name,companyName,address,mobile,total_point,consumed_point,IdCardNo,DistrictCode,memberDate,gender,role,CREATION_DATE,rank',
        ttbl: "member.users_v2",
        fileNamePrefix: 'memberlist', // 文件名前缀
        toexcel_fields: 'ID,memberNo,name,companyName,address,mobile,IdCardNo,memberDate,gender',
        dvUpdate: null,
        dvId: 'dvMembers'
    }),
    ini = function () {
        if (!o.dv) {
            var om = o;
            o.preIni();
            //o.dv = $('#dvMembers');
            o.dvUpdate = $('#dvUpdateMember');
            o.cmbAddress = o.dvUpdate.find('.address select');
            o.dvUpdate.find('.icon_close').click(function () { om.dvUpdate.fadeOut(); });
            o.oTbl = o.dv.find('table');
            o.bttnSearch = o.dv.find('.vehicle_search [name=query]').click(function () {
                o.search();
            });

            o.dvUpdate.find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(om.id);
                a.push(om.parentId);
                a.push(om.cmbAddress.eq(2).val());
                var btn = $(this).val('正在添加');
                om.dvUpdate.find('.content table td :text').each(function () {
                    a.push($(this).val());
                });

                gf.callProc('', a, function () {
                    gtips.showNotice('添加完毕!');
                    btn.val('确定保存');
                    om.dvUpdate.fadeOut();
                });
            });
            //this.ini_after();
            //this.iniChilrenAgent();

            //this.iniToExcel();
        }
    },
    show = function (obj, parentName, parentId, id) {
        this.iniAddr();
        var o = this.dvUpdate.find('table td');
        o.eq(0).text(parentName);
        gf.show(obj, this.dvUpdate, { x: 'center', y: 'center' });
        this.id = '';
        this.parentId = parentId;
        if (id) { // 修改
            this.id = id;
        }
    };
    o.fdata = function (a) {
        //ID,IdCardNo,name,companyName,address,mobile,total_point,consumed_point,DistrictCode,memberDate,gender,role,CREATION_DATE,rank
        var c = [];
        c.push(dom.td('')); //会员号
        c.push(dom.td(a[1])); //会员号
        c.push(dom.td(a[2])); //姓名
        c.push(dom.td(a[8].substr(0, a[8].length - 4) + '****')); //姓名
        c.push(dom.td(a[5])); //手机
        c.push(dom.td(a[6])); //总积分
        c.push(dom.td(a[7])); //已兑积分
        c.push(dom.td(Number(a[6]) - Number(a[7]))); //剩余积分
        c.push(dom.td(0)); //姓名
        c.push(dom.td(a[3])); //门店和门店号
        return dom.tr(c.join(""), '_id="' + a[0] + '"');
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('role in (r_r)');
        aF.push("code like 'r_r%'");
        aF.push("memberNo='r_r'");
        aF.push("IdCardNo='r_r'");
        aF.push("mobile='r_r'");
        aF.push("name like 'r_r%'");

        a.push(base.memberTypeValue());

        a.push(ur.user().code);
        this.dv.find('.vehicle_search').find(':text,select').each(function () {
            a.push($(this).val());
        });
        return f.getWhere_root(aF, a);
    };
    base.iniFunc[o.dvId] = { fun: ini };
})();

agent.memberSta = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvMemberSta' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            iniMonth();
        }
    },
    iniMonth = function () {
        var opt = [];
        opt.push('<option></option>');
        for (var i = 0; i < 12; i++) {
            opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
        }
        o.dv.find('.month').change(function () {
            var s = new Date().getFullYear() + '-' + $(this).val() + '-1',
                e = new Date().getFullYear() + '-' + (parseInt($(this).val()) + 1) + '-1';
            if ($(this).val() == 12) {
                e = (new Date().getFullYear() + 1) + '-1-1';
            }
            if (!$(this).val()) {
                s = '';
                e = '';
            }
            o.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
        }).html(opt.join(''));
    };
    o.search = function (idx,obj) {
        var a = [], format = "_id={0} id={0} rank={1} class='{2}'";
        var inputs = o.dv.find(':text');
        a[0] = inputs.eq(0).attr('_id');
        if (!a[0]) a[0] = ur.user().agentId;
        if (inputs.eq(0).val().indexOf(ur.user().code) != 0 || inputs.eq(0).val() == '') {
            a[1] = ur.user().code;
        }
        else {
            a[1] = inputs.eq(0).val();
        }
        a[2] = inputs.eq(1).val();
        a[3] = inputs.eq(2).val();
        if (a[2] && a[3]) {
            var btn = $(obj).disable().val('正在统计..');
            gtips.showAjax();
            gf.noPagination('up_member_staUser3', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(dom.td(b[0])); //
                    c.push(dom.td(b[1])); //
                    c.push(dom.td(b[2])); //
                    c.push(dom.td(gf.percent(b[1], b[2]))); // 入会比例
                    b[4] = b[5] == b[6] ? -1 : b[4];
                    a[i] = dom.tr(c.join(''), String.format(format, b[3], b[5], (b[4] < 0 ? '' : 'child-of-' + b[4])));
                    c = [];
                }
                o.tbl.find('tbody').html(a.join(''));
                o.tbl.treeTable({ indent: 19 });
                o.searchend(a.length);
                gtips.hideAjax();
            });
        }
        else {
            gtips.showNotice('请选择时间范围');
        }
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
    return o;
})()

agent.memberStaGroup = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvMemberStaGroup' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            iniMonth();
        }
    },
    iniMonth = function () {
        var opt = [];
        opt.push('<option></option>');
        for (var i = 0; i < 12; i++) {
            opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
        }
        o.dv.find('.month').change(function () {
            var s = new Date().getFullYear() + '-' + $(this).val() + '-1',
                e = new Date().getFullYear() + '-' + (parseInt($(this).val()) + 1) + '-1';
            if ($(this).val() == 12) {
                e = (new Date().getFullYear() + 1) + '-1-1';
            }
            if (!$(this).val()) {
                s = '';
                e = '';
            }
            o.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
        }).html(opt.join(''));
    };
    o.search = function (idx, obj) {
        var a = [], format = "data-id={0} id={0} rank={1} class='{2}'";
        var inputs = o.dv.find(':text');
        a[0] = inputs.eq(0).attr('_id');
        if (!a[0]) a[0] = ur.user().agentId;        
        a[1] = inputs.eq(1).val();
        a[2] = inputs.eq(2).val();
        if (a[1] && a[2]) {
            var btn = $(obj).disable().val('正在统计..');
            gtips.showAjax();
            gf.noPagination('up_member_getMemberActivityGroup', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(dom.td(b[0])); //
                    c.push(dom.td('['+b[1]+']'+b[2])); //
                    c.push(dom.td(b[3])); //
                    a[i] = dom.tr(c.join(''), String.format(format, b[4],1, (b[4] > 0 ? '' : 'child-of-' + b[5])));
                    c = [];
                }
                o.tbl.find('tbody').html(a.join(''));
                o.tbl.treeTable({ indent: 19 });
                o.searchend(a.length);
                gtips.hideAjax();
            });
        }
        else {
            gtips.showNotice('请选择时间范围');
        }
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
    return o;
})()

agent.saleAnaylyse = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoAnalyse' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            iniMonth();
        }
    },
    iniMonth = function () {
        var opt = [];
        opt.push('<option></option>');
        for (var i = 0; i < 12; i++) {
            opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
        }
        o.dv.find('.month').change(function () {
            var s = new Date().getFullYear() + '-' + $(this).val() + '-1',
                e = new Date().getFullYear() + '-' + (parseInt($(this).val()) + 1) + '-1';
            if ($(this).val() == 12) {
                e = (new Date().getFullYear() + 1) + '-1-1';
            }
            if (!$(this).val()) {
                s = '';
                e = '';
            }
            o.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
        }).html(opt.join(''));
    };
    o.search = function (idx, obj) {
        var a = [], format = "_id={0} id={0} rank={1} class='{2}'";
        var inputs = o.dv.find(':text');
        a[0] = ur.user().agentId;
        a[1] = inputs.eq(0).val();
        a[2] = inputs.eq(1).val();
        a[3] = o.dv.find('select:eq(1)').val();

        if (a[1] && a[2]) {
            var btn = $(obj).disable().val('正在分析..');
            gtips.showAjax();
            gf.query('agent.base.soAnalytic', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [], totalAmount = 0, totalQty=0;
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(dom.td(i + 1));
                    c.push(dom.td(b[0])); //
                    c.push(dom.td('<label class=number style="width:50%">' + f.price(b[1], 2) + '</label>')); //
                    c.push(dom.td(b[2])); //
                    a[i] = dom.tr(c.join(''));
                    totalAmount += b[1];
                    totalQty += b[2];
                    c = [];
                }
                o.tbl.find('tbody').html(a.join('')).end().find('tfoot').find('th').eq(1).html('<label class=number style="width:50%">' + f.price(totalAmount, 2) + '</label>').end().eq(2).text(totalQty);
                //o.tbl.treeTable({ indent: 19 });
                o.searchend(a.length);
                gtips.hideAjax();
            });
        }
        else {
            gtips.showNotice('请选择时间范围');
        }
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.soReturnAnaylyse = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoReturnAnalyse' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            iniMonth();
        }
    },
    iniMonth = function () {
        var opt = [];
        opt.push('<option></option>');
        for (var i = 0; i < 12; i++) {
            opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
        }
        o.dv.find('.month').change(function () {
            var s = new Date().getFullYear() + '-' + $(this).val() + '-1',
                e = new Date().getFullYear() + '-' + (parseInt($(this).val()) + 1) + '-1';
            if ($(this).val() == 12) {
                e = (new Date().getFullYear() + 1) + '-1-1';
            }
            if (!$(this).val()) {
                s = '';
                e = '';
            }
            o.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
        }).html(opt.join(''));
    };
    o.search = function (idx, obj) {
        var a = [], format = "_id={0} id={0} rank={1} class='{2}'";
        var inputs = o.dv.find(':text');
        a[0] = ur.user().agentId;
        a[1] = inputs.eq(0).val();
        a[2] = inputs.eq(1).val();
        a[3] = o.dv.find('select:eq(1)').val();

        if (a[1] && a[2]) {
            var btn = $(obj).disable().val('正在分析..');
            gtips.showAjax();
            gf.query('agent.base.soReturnAnalytic', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(dom.td(i + 1));
                    c.push(dom.td(b[0])); //
                    c.push(dom.td('<label class=number style="width:50%">' + f.price(b[1], 2) + '</label>')); //
                    c.push(dom.td(b[2])); //
                    a[i] = dom.tr(c.join(''));
                    c = [];
                }
                o.tbl.find('tbody').html(a.join(''));
                o.tbl.treeTable({ indent: 19 });
                o.searchend(a.length);
                gtips.hideAjax();
            });
        }
        else {
            gtips.showNotice('请选择时间范围');
        }
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.stockinAnalyse = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvStockinAnalyse' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            iniMonth();
        }
    },
    iniMonth = function () {
        var opt = [];
        opt.push('<option></option>');
        for (var i = 0; i < 12; i++) {
            opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
        }
        o.dv.find('.month').change(function () {
            var s = new Date().getFullYear() + '-' + $(this).val() + '-1',
                e = new Date().getFullYear() + '-' + (parseInt($(this).val()) + 1) + '-1';
            if ($(this).val() == 12) {
                e = (new Date().getFullYear() + 1) + '-1-1';
            }
            if (!$(this).val()) {
                s = '';
                e = '';
            }
            o.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
        }).html(opt.join(''));
    };
    o.search = function (idx, obj) {
        var a = [], format = "_id={0} id={0} rank={1} class='{2}'";
        var inputs = o.dv.find(':text');
        a[0] = ur.user().agentId;
        a[1] = inputs.eq(0).val();
        a[2] = inputs.eq(1).val();
        a[3] = o.dv.find('select:eq(1)').val();

        if (a[1] && a[2]) {
            var btn = $(obj).disable().val('正在分析..');
            gtips.showAjax();
            gf.query('agent.base.stockInSta', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(dom.td(i + 1));
                    c.push(dom.td(b[0])); //
                    c.push(dom.td('<label class=number style="width:50%">' + f.price(b[1], 2) + '</label>')); //
                    //c.push(dom.td(b[2])); //
                    a[i] = dom.tr(c.join(''));
                    c = [];
                }
                o.tbl.find('tbody').html(a.join(''));
                o.tbl.treeTable({ indent: 19 });
                o.searchend(a.length);
                gtips.hideAjax();
            });
        }
        else {
            gtips.showNotice('请选择时间范围');
        }
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.prodStock = (function () {
    var o = $.extend({}, gobj, gpagination, { fields: 'id,name,code,category,standPrice,price,qty,uom,description,storepid,attr1Text,attr2Text',
        ttbl: "member.storeProduct_v", dvId: 'dvProdStock'
    }), _displayStandPrice = true, _totalSubPrice = 0, _totalQty = 0,
    iniAttrDefin = function () {
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.product) {
                var t = o.tbl.find('thead .' + k).show(), pa = ur.config().attributeDefin.product[k];
                t.find('a').text(pa.label);
                //var i = t.find('input').attr({ 'data-ad-id': pa.id, 'placeholder': pa.desc, 'title': pa.desc });
                //suggest.attribute(i);
            }
        }
    },
    iniRole = function () {
        var st = o.tbl.find('thead th').eq(3), sf = o.tbl.find('tfoot th').eq(1);
        _displayStandPrice = false;
        if (ur.config().attributeDefin) {
            if (!ur.config().attributeDefin.role) {
                _displayStandPrice = true;
            }
            for (k in ur.config().attributeDefin.role) {
                if (ur.config().attributeDefin.role[k].id == base.STATIC.ROLE_BUYER ||
                        ur.config().attributeDefin.role[k].id == base.STATIC.ROLE_MANAGER) {
                    st.show().parent().prev().show();
                    sf.show().next().show();
                    _displayStandPrice = true;
                    break;
                }
                else {
                    st.hide().parent().prev().hide();
                    sf.hide().next().hide();
                }
            }
        }
        o.displayStandPrice = _displayStandPrice;
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.prodUpd.show();
            });
            base.categoryStore.fillCmb(function (a) {
                gOption.foption(o.dv.find('.cmbCategory').eq(0), a, -1, ['', '']);
                gOption.foption(o.dv.next().find('.cmbCategory').eq(0), a);
            });
            //gf.noPagination('up_member_getStoreCategoryForCmb', [1, ur.user().agentId], function (a) {
            //    gOption.foption(o.dv.find('.cmbCategory').eq(0), a, -1, ['', '']);
            //    gOption.foption(o.dv.next().find('.cmbCategory').eq(0), a);
            //});
            o.tbl.find('tbody tr a').live('click', function () {
                agent.prodUpd.show($(this).parents('tr').attr('data-id'));
            });
            iniAttrDefin();
            iniRole();
        }
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        aF.push("categoryID = 'r_r'");
        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('.well').find('input,select');
        a.push(inputs.eq(0).val());
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td('<a href="#">' + a[1] + '</a>'));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3]));
        if (_displayStandPrice) {
            c.push(dom.td('<label class=number style="width:50%">' + f.price(a[4], 2) + '</label>'));
        }
        else {
            c.push(dom.td('', 'style="display:none;"'));
        }
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        if (o.tbl.find('thead th:eq(5)').css('display') != 'none') {
            c.push(dom.td(a[10]));
        }
        else {
            c.push(dom.td('', 'style="display:none;"'));
        }
        if (o.tbl.find('thead th:eq(6)').css('display') != 'none') {
            c.push(dom.td(a[11]));
        }
        else {
            c.push(dom.td('', 'style="display:none;"'));
        }
        c.push(dom.td(a[6], 'class=number'));
        c.push(dom.td('<small>' + a[7] + '</small>'));
        c.push(dom.td(f.price(a[5] * a[6], 2), 'class="number"'));
        c.push(dom.td(a[8]));
        c.push(dom.td(''));
        _totalSubPrice += a[5] * a[6];
        _totalQty += a[6];
        return dom.tr(c.join(""), 'data-id="' + a[9] + '"');
    };
    o.ended = function () {
        o.tbl.find('tfoot th').eq(5).text(f.price(_totalSubPrice, 2)).end().eq(3).text(_totalQty);
        _totalQty = 0; _totalSubPrice = 0;
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.prodUpd = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvProdUpd', inputs: [], hasImg: false, parentObj: agent.prodStock }),
    iniAttrDefin = function () {
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.product) {
                var t = o.dv.find('.' + k).show(), pa = ur.config().attributeDefin.product[k];
                t.first().text(pa.label);
                var i = t.find('input').attr({ 'data-ad-id': pa.id, 'placeholder': pa.desc, 'title': pa.desc });
                suggest.attribute(i);
            }
        }
    },
    iniRole = function () {
        var st = o.inputs.eq(8);
        if (o.parentObj.displayStandPrice) {
            st.show().parent().prev().show();
        }
        else {
            st.hide().parent().prev().hide();
        }
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            var file = o.dv.find(':file').change(function () {
                aac.cam.getImg();
                o.hasImg = true;
            });
            o.inputs = o.dv.find('table input:not([type=file]),table textarea,table select');
            o.dv.find('.btnFile').click(function () {
                file.click();
            });
            aac.cam.ini({ canvas: 'c' });
            o.dv.find('.btnCam').click(function () {
                camClick(this);
            });

            o.inputs.eq(2).keyup(function () {//自动得到拼音码
                o.inputs.eq(3).val(aac.makePy($(this).val()));
            });

            o.dv.find('.close').click(function () {
                aac.cam.stopCam();
            })
            iniAttrDefin();
            iniRole();
        }
    },
    camClick = function (obj) {
        if (aac.cam.status == aac.cam.PLAYING) {
            aac.cam.parseCam();
            o.hasImg = true;
            $(obj).find('c').html("重新摄取");
        }
        else {
            aac.cam.startCam();
            $(obj).find('c').html("拍照");
        }
    },
    clear = function () {
        o.inputs.eq(0).val(-1);
        for (var i = 1; i < o.inputs.length; i++) {
            o.inputs.eq(i).val('');
        }
    },
    close = function () {
        o.dv.modal('hide');
        agent.prodStock.search();
    },
    save = function (a, success) {
        gf.callProc_with_value('up_member_updateProductAttr', a, function (v) {
            if (v < 0)
                gtips.showNotice("存在相同的产品");
            else {
                gtips.showNotice("保存成功");
                success ? success() : null;
                //mStock.search();
            }
        });
    },
    submit = function (success) {
        var a = [], inputs = o.inputs;

        //        a.push(inputs.eq(0).val()); //id
        //        a.push(inputs.eq(1).val()); //categoryid
        //        a.push(inputs.eq(2).val()); //name
        //        a.push(inputs.eq(3).val()); //code
        //        a.push(inputs.eq(4).val()); //barcode
        //        a.push(inputs.eq(5).val()); //qty
        //        a.push(inputs.eq(6).val()); //uom
        //        a.push(inputs.eq(8).val()); //standprice
        //        a.push(inputs.eq(9).val()); //price
        //        a.push(inputs.eq(10).val()); //desc
        for (var i = 0, b = null; b = inputs[i]; i++) {
            if ($(b).attr('data-ad-id')) {
                a.push($(b).attr('data-ad-id'));
            }
            a.push($(b).val());
        }
        a.push(ur.user().id);
        a.push(ur.user().agentId);

        if (o.hasImg) {
            aac.cam.upload(function (filePath) {
                a.push(filePath.substring(0, filePath.lastIndexOf("\\") + 1));
                a.push(filePath.substring(filePath.lastIndexOf("\\") + 1))
                save(a, success);
            })
        }
        else {
            a.push('');
            a.push('');
            save(a, success);
        }
    },
    getProduct = function (id) {
        gf.getOneLineSqlPara('storepid=' + id, 'storepid,categoryID,name,code,barcode,qty,uomid,price,standPrice,attr1text,attr2text,description,imgUrl', 'member.storeProduct_v', function (a) {
            var j = 0, inputs = o.inputs;
            for (var i = 0, b = null; b = inputs[i]; i++) {
                a.push($(b).val(a[i]));
            }
//            inputs.eq(0).val(a[0]);
//            inputs.eq(1).val(a[1]);
//            inputs.eq(2).val(a[2]);
//            inputs.eq(3).val(a[3]);
//            inputs.eq(4).val(a[4]);
//            inputs.eq(5).val(a[5]);
//            inputs.eq(6).val(a[6]);
//            inputs.eq(8).val(a[7]);
//            inputs.eq(9).val(a[8]);
//            inputs.eq(10).val(a[9]);
            if (a[12])
                aac.cam.getImg(a[12]);
        });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    o.saveClose = function () {
        submit(function () {
            clear();
            close();
        });
    };
    o.show = function (id) {
        ini();
        o.dv.modal({});
        var t = '';
        if (id) {
            t = '修改';
            getProduct(id);
        }
        else {
            t = '创建';
            clear();
        }
        o.dv.find('.modal-header c').html(t);
    }
    return o;
})()

agent.customer = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvCustomer', ttbl: "[user].[customer_v1]",
        fields: 'ID,code,rank,name,uname,mobile,street,note,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,storeId,discount,isVendor,isCustomer,isChain'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('button[name=add]').click(function () {
                agent.partnerUpd.show(null, null, 'customer');
            });
            o.dv.find('tbody').find('a').live('click', function () {
                agent.partnerUpd.show($(this).attr('data-id'), $(this).parents('tr').attr('data'), 'customer');
            })
        }
    };
    o.fdata = function (a) {
        //ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty
        var c = [], format = "_id={0} data-id={0} districtcode={1} rank={2} code='{3}' class='{4}' data='{4}'";
        c.push(dom.td(dom.a(a[1],'#','data-id='+a[0]))); //编码
        //c.push(dom.td(gaRank[a[2]])); //等级
        c.push(dom.td(a[3])); //名称
        c.push(dom.td(a[14])); //默认优惠
        c.push(dom.td(a[4])); //联系人
        c.push(dom.td(a[5])); //联系电话
        c.push(dom.td(a[6])); //上级
        //c.push(td());
        //c.push(td(a[7])); //会员数
        c.push(dom.td(a[7]));
        if (a[11] == a[2]) a[10] = -1;

        return dom.tr(c.join(""), String.format(format, a[0], a[8], a[2], a[1], encodeURI(JSON.stringify(a))));
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push("storeId=r_r");
        //aF.push("code like 'r_r%'");
        aF.push("rank=r_r");
        aF.push("DistrictCode like 'r_r%'");
        aF.push("hgift > r_r");
        a[0] = ur.user().agentId; //ur.user().code; //+ this.dvCode.find(':text').val();
        //a[1] = this.dv.find('.tool .cmbRank').val();
        //a[2] = this.cmbProvince.val();
        //a[3] = this.dv.find('.tool .hgift:checked').val();
        return f.getWhere_root(aF, a);
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
    return o;
})()

agent.partnerUpd = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null }),
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvPartnerUpd');
            o.dv.find('.btn-success').click(function () {
                save(function () {
                    o.dv.modal('hide');
                    clear();
                    agent.customer.search();
                });
            }).find('.btn-save-add').click(function () {
                save(function () {
                    clear();
                    agent[o.type].search();
                });
            });
            o.cmbAddress = o.dv.find('.address select');
            o.dv.find('.modal-body table td:eq(0)').find('input').blur(function () {
                if ($(this).val().length == 3) {
                    $(this).removeClass('error');
                }
                else {
                    $(this).addClass('error');
                }
            });
            o.iniAddr();
        }
    },
    clear = function () {
        o.id = null;
        o.dv.find('input').val('');
    },
    save = function (success) {
        var a = [], tds = o.dv.find('.modal-body table td');
        a.push(ur.user().id);
        a.push(o.id || 0);
        a.push(ur.user().agentId);
        var code = tds.eq(0).find('input');

        a.push(o.cmbAddress.eq(2).val()); //addr
        a.push(code.val()); //code
        tds.eq(1).find('label').each(function () {
            a.push($(this).find(':checked').size());
        })
        a.push(tds.eq(2).find('input').val()); //name
        //
        a.push(tds.eq(3).find('input').val()); //user
        a.push(tds.eq(4).find('input').val()); //discount
        a.push(tds.eq(5).find('input').val()); //mobile
        a.push(tds.eq(7).find('input').val()); //street
        gf.getOneLine('up_user_updatePartner', a, function (v) {
            if (v[0]) {
                alert('更新成功！请记住编号' + v[0]);
                if (success) success();
            }
            else {
                alert('更新成功！');
                if (success) success();
            }
        });
    },
    fdata = function (a) {
        //ID,code,rank,name,uname,mobile,street,note,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,storeId,discount,isVendor,isCustomer,isChain
        var tds = o.dv.find('td');
        tds.eq(0).find('input').val(a[1]);
        tds.eq(1).find('input').each(function (i) {
            if (a[15 + i] > 0) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
        })
        tds.eq(2).find('input').val(a[3]); //name
        // inputs.eq(2).val(a[14]);
        tds.eq(3).find('input').val(a[4]); //uname
        tds.eq(4).find('input').val(a[14]); //discount
        tds.eq(5).find('input').val(a[5]); //mobile
        tds.eq(7).find('input').val(a[6]); //mobile
        o.setDefault(a[11]);
    };
    o.show = function (id, a, type) {
        ini();
        o.dv.modal({});
        o.type = type;
        var tds = o.dv.find('.modal-body table td');
        //tds.eq(0).find('c').text(ur.user().code);
        o.dv.find('.modal-header c').text('添加');
        if (id) {
            o.id = id;
            fdata(JSON.parse(decodeURI(a)));
            o.dv.find('.modal-header c').text('修改');
        }
    };
    return o;
})()

agent.customerUpd = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null }),
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvCustomerUpd');
            o.dv.find('.btn-success').click(function () {
                save(function () {
                    o.dv.modal('hide');
                    clear();
                    agent.customer.search();
                });
            }).find('.btn-save-add').click(function () {
                save(function () {
                    clear();
                    agent.customer.search();
                });
            });
            o.cmbAddress = o.dv.find('.address select');
            o.dv.find('.modal-body table td:eq(0)').find('input').blur(function () {
                if ($(this).val().length == 3) {
                    $(this).removeClass('error');
                }
                else {
                    $(this).addClass('error');
                }
            });
            o.iniAddr();
        }
    },
    clear = function () {
        o.id = null;
        o.dv.find('input').val('');
    },
    save = function (success) {
        var a = [], tds = o.dv.find('.modal-body table td');
        a.push(ur.user().id);
        a.push(o.id||0);
        a.push(ur.user().agentId);
        var code = tds.eq(0).find('input');
        if (code.val().length != 3) {
            code.addClass('error');
            return;
        }
        a.push(o.cmbAddress.eq(2).val()); //addr
        a.push(ur.user().code + code.val()); //code
        a.push(tds.eq(1).find('input').val()); //name
        a.push(tds.eq(2).find('input').val()); //discount
        a.push(tds.eq(3).find('input').val()); //user
        a.push(tds.eq(4).find('input').val()); //mobile
        a.push(tds.eq(6).find('input').val()); //street
        gf.callProc_with_value('up_member_updateAgent2', a, function (v) {
            if (v == 0) {
                alert('编号存在！');
            }
            else {
                alert('更新成功！');
                if (success) success();
            }
        });
    },
    fdata = function (a) {
        var inputs = o.dv.find('input');
        inputs.eq(0).val(a[1].substr(ur.user().code.length));
        inputs.eq(1).val(a[3]);
        inputs.eq(2).val(a[14]);
        inputs.eq(3).val(a[4]);
        inputs.eq(4).val(a[5]);
        inputs.eq(5).val(a[6]);
        o.setDefault(a[11]);
    };
    o.show = function (id, a) {
        ini();
        o.dv.modal({});
        var tds = o.dv.find('.modal-body table td');
        tds.eq(0).find('c').text(ur.user().code);
        o.dv.find('.modal-header c').text('添加');
        if (id) {
            o.id = id;
            fdata(JSON.parse(decodeURI(a)));
            o.dv.find('.modal-header c').text('修改');
        }
    };
    return o;
})()

agent.vendor = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvVendor', ttbl: "[user].vendor_v",
        fields: 'ID,code,rank,name,uname,mobile,street,note,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,storeId,discount'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('button[name=add]').click(function () {
                agent.vendorUpd.show();
            });
            o.dv.find('tbody').find('a').live('click', function () {
                agent.vendorUpd.show($(this).attr('data-id'), $(this).parents('tr').attr('data'));
            })
        }
    };
    o.fdata = function (a) {
        //ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty
        var c = [], format = "_id={0} data-id={0} districtcode={1} rank={2} code='{3}' class='{4}' data='{4}'";
        c.push(dom.td(dom.a(a[1], '#', 'data-id=' + a[0]))); //编码
        //c.push(dom.td(gaRank[a[2]])); //等级
        c.push(dom.td(a[3])); //名称
        //c.push(dom.td(a[14])); //默认优惠
        c.push(dom.td(a[4])); //联系人
        c.push(dom.td(a[5])); //联系电话
        c.push(dom.td(a[6])); //上级
        //c.push(td());
        //c.push(td(a[7])); //会员数
        c.push(dom.td(a[7]));
        if (a[11] == a[2]) a[10] = -1;

        return dom.tr(c.join(""), String.format(format, a[0], a[8], a[2], a[1], encodeURI(JSON.stringify(a))));
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push("storeId=r_r");
        //aF.push("code like 'r_r%'");
        aF.push("rank=r_r");
        aF.push("DistrictCode like 'r_r%'");
        aF.push("hgift > r_r");
        a[0] = ur.user().agentId; //ur.user().code; //+ this.dvCode.find(':text').val();
        //a[1] = this.dv.find('.tool .cmbRank').val();
        //a[2] = this.cmbProvince.val();
        //a[3] = this.dv.find('.tool .hgift:checked').val();
        return f.getWhere_root(aF, a);
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
    return o;
})()

agent.vendorUpd = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null }),
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvVendorUpd');
            o.dv.find('.btn-success').click(function () {
                save(function () {
                    o.dv.modal('hide');
                    clear();
                    agent.customer.search();
                });
            }).find('.btn-save-add').click(function () {
                save(function () {
                    clear();
                    agent.vendor.search();
                });
            });
            o.cmbAddress = o.dv.find('.address select');
            o.dv.find('.modal-body table td:eq(0)').find('input').blur(function () {
                if ($(this).val().length == 3) {
                    $(this).removeClass('error');
                }
                else {
                    $(this).addClass('error');
                }
            });
            o.iniAddr();
        }
    },
    clear = function () {
        o.id = null;
        o.dv.find('input').val('');
    },
    save = function (success) {
        var a = [], tds = o.dv.find('.modal-body table td');
        a.push(ur.user().id);
        a.push(o.id || 0);
        a.push(ur.user().agentId);
        var code = tds.eq(0).find('input');

        a.push(o.cmbAddress.eq(2).val()); //addr
        a.push(code.val()); //code
        a.push(tds.eq(1).find('input').val()); //name
        //a.push(tds.eq(2).find('input').val()); //discount
        a.push(tds.eq(2).find('input').val()); //user
        a.push(tds.eq(3).find('input').val()); //mobile
        a.push(tds.eq(5).find('input').val()); //street
        gf.getOneLine('up_user_updateVendor', a, function (v) {
            if (v[0]) {
                alert('更新成功！请记住编号' + v[0]);
                if (success) success();
            }
            else {
                alert('更新成功！');
                if (success) success();
            }
        });
    },
    fdata = function (a) {
        var inputs = o.dv.find('input');
        inputs.eq(0).val(a[1]);
        inputs.eq(1).val(a[3]);
        // inputs.eq(2).val(a[14]);
        inputs.eq(2).val(a[4]);
        inputs.eq(3).val(a[5]);
        inputs.eq(4).val(a[6]);
        o.setDefault(a[11]);
    };
    o.show = function (id, a) {
        ini();
        o.dv.modal({});
        var tds = o.dv.find('.modal-body table td');
        tds.eq(0).find('c').text(ur.user().code);
        o.dv.find('.modal-header c').text('添加');
        if (id) {
            o.id = id;
            fdata(JSON.parse(decodeURI(a)));
            o.dv.find('.modal-header c').text('修改');
        }
    };
    return o;
})()


agent.poReturn = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.poReturnHead_v',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,rname",
        dvId: 'dvPoReturn'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.poReturnUpd.show();
            });

            o.tbl.find('tbody tr a').live('click', function () {
                agent.poReturnUpd.show($(this).parents('tr').attr('data-id'));
            });

        }
    },
    updateStatus = function (id, status) {
        gf.callProc_with_value('up_agent_updateSoStatus', [id, status, ur.user().id], function () {
            o.search();
        })
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddview':
                agent.soReturnUpd.show(id, 'view');
                break;
            case 'ddedit':
                agent.soReturnUpd.show(id, 'edit');
                break;
            case 'ddconfirm':
                updateStatus(id, 'confirm');
                break;
            case 'ddcancel':
                updateStatus(id, 'cancel');
                break;
        }
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    o.printSo = function (id) {
        var doc = $(frames['ptso'].document).find('div');
        doc.find('table:visible').remove();
        var tbl = doc.find('table').clone();
        tbl.show().appendTo(doc);
        var trs = tbl.find('tbody tr'),
            title = trs.eq(0),
            header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
            comment = trs.eq(4), line = trs.eq(6), xj = trs.eq(7), hj = trs.eq(8), dx = trs.eq(9), a = o.data[id];

        title.find('td').text(ur.user().coName);
        header.find('td').text('退货单');
        date.find('td c').eq(0).text(f.date(a[2])).end().eq(1).text(a[1]);
        customer.find('td c').eq(0).text(a[3]).end().eq(1).text(a[7]);
        comment.find('td c').text(a[8]), tqty = 0, tamount = 0, tdis = 0;

        gf.noPagination('up_member_getSoLine', [id], function (a) {
            var tds = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                if (i == 0) {
                    tds = line.find('td');
                }
                else {
                    var cl = line.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                b[4] = b[4] * -1;
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4]); //qty
                tqty += b[4];
                tds.eq(6).text(f.price(b[2] * b[4], 2)); //amount
                //tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (100 - b[5]) / 100, 2)); //折后
                tamount += b[2] * b[4] * (100 - b[5]) / 100;
            }
            xj.find('td').eq(1).text(tqty).end().eq(3).text(f.price(tamount, 2));
            hj.find('td c').eq(0).text(tqty).end().eq(1).text(f.price(tamount, 2)).end().eq(2).text(f.price(tdis, 2));
            dx.find('td c').text(f.chineseNumber(tamount));
            frames['ptso'].print();
        });
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("status = 'r_r'");

        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#')));
        c.push(dom.td(f.date(a[2])));
        c.push(dom.td(a[7] + '[' + a[3] + ']'));
        c.push(dom.td(a[4]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        c.push(dom.td(a[10]));
        var stat = '', stat2 = '', stat3 = '';
        if (a[9] == 'cancel') {
            stat = '已取消'
        }
        else {
            stat = a[6] && f.date(a[6]);
            if (a[9] == 'draft' || a[9] == '') {
                stat = '草稿';
                stat3 = '  <li class="" for="ddconfirm"><a href="#"><i class="icon-ok-sign"></i>确认</a></li>' +
              '  <li class="" for="ddcancel"><a href="#"><i class="icon-remove-circle"></i>取消</a></li>';
                stat2 = '  <li class="" for="ddedit"><a href="#"><i class="icon-pencil"></i>修改</a></li>';
            }
        }
        c.push(dom.td(stat));
        var b = [['修改', 'update'], ['查看', 'view']];
        b = (!!a[6]) ? b[1] : b[0];

        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddview"><a href="#"><i class="icon-file"></i>查看</a></li>' + stat2 +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '  <li class="divider"></li> ' + stat3 +
              '</ul></td>';
        c.push(dd);
        o.data[a[0]] = a;
        //var btn = "<input value=" + b[0] + " type=button class=" + b[1] + " />";
        //c.push(dom.td(btn));

        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.updateStatus = updateStatus;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini,obj:o };
    return o;
})()

agent.poReturnUpd = (function () {
    var o = $.extend({}, gobj, base.poUpd, { dvId: 'dvPoReturnUpd', inputs: [], status: { cancel: '取消', confirm: '已确认', draft: '草稿'} }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () {
                agent.soProductQuery.show(selectedProduct, ur.user().id, o.partner.attr('data-id'));
                //o.dv.modal('hide');
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_po_ru_partner').next().click(function () {
                agent.partnerMemberLov.show(fillPartner, o.partner.val(), 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '')
            });

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                //if ($(this).hasClass('number')) { changeNumber(this); }
                $(this).parents('tr').addClass('dirty');
                pressEnter(this);
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_po_ru_total');

            o.getVendor();
        }
    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = null; b = a[i]; i++) {
            var td = [];
            //if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b.productName));
            td.push(dom.td(b.maxQty, 'class="number" ' + ctb));
            td.push(dom.td(b.maxPrice, 'class="number" ' + ctb));
            td.push(dom.td('/' + b.uom));
            td.push(dom.td(b.maxQty * b.maxPrice));
            td.push(dom.td(b.orderNum));
            td.push(dom.td('', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            attr = 'data-maxQty="' + b.maxQty + '" data-maxPrice="' + b.maxPrice + '" data-fromId="' + b.lineId + '" data-prod-id="' + b.productId + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(4).attr('data-value', 'confirm');
        submit(function (id) {
            agent.so.updateStatus(id, 'confirm');
            o.show(id);
        });
    },
    cancelOrder = function () {
        o.inputs.eq(4).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
        else if (obj.hasClass('clear')) {
            clear();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            var tr = $(obj).parents('tr');
            if ($(obj).index() == 1) {
                if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxqty'))) {
                    $(obj).text(tr.attr('data-maxqty')).focus();
                    gtips.showNotice('不能大于订单的数量');
                    return;
                }
            }
            else if ($(obj).index() == 2) {
                if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxprice'))) {
                    $(obj).text(tr.attr('data-maxprice')).focus();
                    gtips.showNotice('不能大于订单上面的单价');
                    return;
                }
            }
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        tds.eq(4).text(parseFloat(price) * parseInt(num));
        total();
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            t += parseFloat($(this).find('td:eq(4)').text() || 0);
        });
        o.total.val(t);
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoReturnHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoReturnLine', lines, function () {
                    success(v);
                })
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_po_ru_total,#q_po_ru_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(3).val(a[4]);
        o.inputs.eq(4).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        if (a[11] == 'cancel' || a[11] == 'confirm') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8])
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[4] * -1 || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            //td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2] * b[4] * (parseFloat(b[5] || 0 - 100)) / 100, 'class="number"'));
            td.push(dom.td(b[10] || ''));
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_member_getSoReturnHead', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[MRT' + a[0] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getSoLine', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(o.inputs.eq(1).attr('data-id'));
        //
        if (!o.inputs.eq(1).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(uid);
        head.push(o.inputs.eq(2).val()); //order date
        head.push(o.inputs.eq(4).val()); //amount
        head.push(o.inputs.eq(3).val()); //reason
        head.push(o.dv.find('.modal-footer textarea').text() || '');
        head.push(o.inputs.eq(5).attr('data-value') || 'draft');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push('-' + tds.eq(1).text()); //qty
                line.push(tds.eq(2).text()); //price
                //line.push(tds.eq(4).text()); //discount
                line.push(obj.attr('data-fromId')); //src line id
                line.push(tds.eq(6).text()); //comment
                line.push(uid);
                lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(5).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.poReturn.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.stockOut = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvStockOut', ttbl: 'member.stockTranOut_v',
        fields: 'id,orderNumber,productName,category,qty,uom,price,outDate,productID'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('table tbody a').live('click', function () {
                var a = JSON.parse(decodeURI($(this).parents('tr').attr('data')));
                gf.noPagination('up_member_stockTranOutForTop', [a[0], a[4], a[8], ur.user().agentId, ur.user().id], function (a) {
                    if (a.length === 0) {
                        alert('出库成功！')
                        o.search();
                    }
                    else {
                        agent.stockOutExpress.show(a);
                    }
                });
            });
        }
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3]));
        c.push(dom.td(a[4], 'class=number'));
        c.push(dom.td('<small>' + a[5] + '</small>'));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[7])));
        data = encodeURI(JSON.stringify(a));
        c.push(dom.td('<a href="#">出库</a>'));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("(outDate is null)");
        a.push(ur.user().agentId);
        var o = this.dv.find('.tool :text');
        a.push(1);
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    return o;
})()

agent.pickingOut = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvPickingOut', ttbl: 'stock.pickingOut_v',
        fields: 'id,pNum,orderNumber,orderDate,outDate,aname,status,note,street,mobile,cname,amount,deposit'
    }), state = { 'draft': '未出库', 'confirm': '已出库', 'cancel': '已取消' },
    ini = function () {
        if (!o.dv) {
            o.preIni();

            var a = [];
            for (var k in state) {
                a.push([k, state[k]]);
            }
            gOption.foption($('#q_pickingo_status_id_in').eq(0), a, -1, ['', '']);

            o.dv.find('table tbody a').live('click', function () {
                if ($(this).parents('td').index() === 0) {
                    agent.pickingDetail.show($(this).attr('data-id'));
                }
                else {
                    //o.stockOut(this);
                }
            });
        }
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddout':
                o.stockOut(obj);
                break;
        }
    };
    o.stockOut = function (obj) {
        var a = JSON.parse(decodeURI($(obj).parents('tr').attr('data')));
        agent.pickingDetail.id = a[0];
        agent.pickingDetail.pickingOut();
    }
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"')));
        c.push(dom.td(a[2]));
        c.push(dom.td(f.date(a[3])));
        c.push(dom.td(f.date(a[4])));
        c.push(dom.td(a[5]));
        c.push(dom.td(state[a[6]]));
        c.push(dom.td(a[7]));
        c.push(dom.td(a[8]));
        data = encodeURI(JSON.stringify(a));
        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddout"><a href="#"><i class="icon-file"></i>出库</a></li>' +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '</ul><input type="checkbox" /></td>';
        c.push(dd);
        if (!o.data) {
            o.data = {};
        }
        o.data[a[0]] = a;
        //c.push(dom.td('<a href="#">出库</a>'));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '" data=' + data);
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("pNum ='r_r'");
        aF.push("orderNumber ='r_r'");
        aF.push("status='r_r'");
        a.push(ur.user().agentId);
        var o = this.dvSp.find(':text,select');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    };
    o.queryPrint = function (success) {
        var a = [], b = {};
        o.tbl.find('tbody :checked').each(function () {
            a.push($(this).parents('tr').attr('data-id'));
        });
        o.pickingIds = a;
        if (a.length) {
            gf.query('agent.stock.tran.picking.out', [a.join(',')], function (a) {
                var pickingId = '';
                for (var i = 0, c = null; c = a[i]; i++) {
                    pickingId = 'id' + c[15];
                    if (b[pickingId]) {
                        b[pickingId].push(c);
                    }
                    else {
                        b[pickingId] = [c];
                    }
                };
                success ? success(b) : null;
            });
        }
    };    
    o.printSo = function (id) {          
        //var _tbl = doc.html();//doc.find('table'),
            //tbl = $(_tbl);//_tbl.clone().eq(0),
            //trs = tbl.find('tbody tr');
        var ptobj = 'pickingOut',
                doc = $(frames[ptobj].document).find('body>div'),
                ids = [],
                    trs=null;

        doc.find('table:gt(0),>div').remove();
        doc.not(':has(table)').remove();

        var _tbl = $.trim(doc.html());//doc.find('table'),

        function detailHead(id)
        {
            //tbl = doc.find('table').clone();  

            //tbl.show().appendTo(doc);
            var title = trs.eq(0),
                header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
                je = trs.eq(10),
                comment = trs.eq(11), qz = trs.eq(14),
                line = trs.eq(5), xj = trs.eq(7), hj = trs.eq(8), dx = trs.eq(9),
                a = o.data[id];

            title.find('td').text(ur.user().coName);
            qz.find('c').text(ur.user().coName);
            date.find('td c').eq(0).text(a[10]).end().eq(1).text(a[9]);
            customer.find('td c').eq(0).text(a[8]).end().eq(1).text(f.date(a[4]));
            comment.find('td c').text(a[7]), tqty = 0, tamount = 0, tdis = 0;
            je.find('td c').eq(0).text(f.price(a[11], 2)).end().
                eq(1).text(f.price(a[12] || 0, 2)).end().eq(2).text(f.price(a[11] - (a[12] || 0), 2));
        }

        function detailLine(a)
        {
            var tds = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                tds = trs.eq(5 + i).find('td');
                tds.eq(1).text(b[1]); //name
                //tds.eq(2).text(b[1]); //name
                tds.eq(2).text(b[13]); //规格
                tds.eq(3).text(b[12]); //颜色
                tds.eq(4).text(b[4]); //qty
                tds.eq(5).text(b[3]); //uom
                tds.eq(6).text(f.price(b[2], 2)); //price
                //tqty += b[4];
                tds.eq(7).text(f.price(b[2] * b[4], 2)); //amount
                tds.eq(8).text(b[6]);
            }
        } 

        o.queryPrint(function (lineObj) {
            //var doc = $(frames[ptobj].document).find('div'),
            //    ids = [];
            //    doc.find('table:gt(0)').remove();
           
            for (var i = 0, id = null; id = o.pickingIds[i]; i++)
            {
                if (i > 0) {
                    var breakPage = '<div style = "page-break-after:always;"></div>';
                    doc.append(breakPage);
                    //tbl = $(_tbl);//_tbl.clone(true).eq(0);
                }
                //tbl.show().appendTo(doc);
                tbl = doc.append(_tbl).find('table').last().show();
                trs = tbl.find('tbody tr');
                detailHead(id);
                detailLine(lineObj['id'+id]);
            }
            //doc.not(':has(table)').remove();
            frames[ptobj].print();
        });
        if (o.pickingIds.length == 0) {
            tbl = doc.append(_tbl).find('table').last().show();
            trs = tbl.find('tbody tr');
            detailHead(id);
            gf.noPagination('up_stock_getTranForPickingOut', [id], function (a) {
                detailLine(a);
                doc.not(':has(table)').remove();
                frames[ptobj].print();
            });
        }

        
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    o.state = state;
    return o;
})()

agent.pickingDetail = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPickingDetail', inputs: [] }), state = agent.pickingOut.state,
    productTmpl = {}, productTmplList = [], productProd = {}, productProdList = [],
    iniHeadeD = function () {
        var headerDetail = o.dv.find('.dvHeaderDetail'),
        controller = o.dv.find('.controller').click(function () {
            if (ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'show') {
                headerDetail.hide();
                controller.removeClass('f-icon-chevron-up');
                controller.addClass('f-icon-chevron-down');
                ur.config({ SoHeaderDetail: 'hide' });
            }
            else {
                headerDetail.show();
                controller.removeClass('f-icon-chevron-down');
                controller.addClass('f-icon-chevron-up');
                ur.config({ SoHeaderDetail: 'show' });
            }
        });
        if (ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'show') {
            headerDetail.show();
            controller.removeClass('f-icon-chevron-down');
            controller.addClass('f-icon-chevron-up');
            ur.config({ SoHeaderDetail: 'show' });
        }
        else {
            headerDetail.hide();
            controller.removeClass('f-icon-chevron-up');
            controller.addClass('f-icon-chevron-down');
            ur.config({ SoHeaderDetail: 'hide' });
        }
    },
    iniUser = function () {
        gf.noPagination('up_user_getStoreUserForCmb', [ur.user().agentId], function (a) {
            gOption.foption(o.dv.find('#q_so_u_user'), a, ur.user().id);
        });
    },
    iniAttrDefin = function () {
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.product) {
                var t = o.tbl.find('thead .' + k).show(), pa = ur.config().attributeDefin.product[k];
                if (pa.isUn) {
                    t.show();
                    t.find('a').text(pa.label);
                }
                else {
                    t.hide();
                }
            }
        }
    },

    ini = function () {
        if (!o.dv) {
            o.preIni();
            /*o.dv.find('button[name=query]').click(function () {
            agent.productLovMutil.show(selectedProduct, 'ag');
            o.dv.modal('hide');
            });
            o.dv.find('button[name=clear]').click(function () {
            clear();
            });*/
            o.partner = o.dv.find('#q_so_u_partner').next().click(function () {
                agent.partnerLov.show(fillPartner, o.partner.val(), 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '')
            });

            o.dv.find('.btn-out').click(function () {
                o.pickingOut();
            });

            /* o.dv.find('#q_so_u_user').keydown(function (evt) {//最後的日期后就直接跳轉到行
            if (evt.keyCode === 9 &&
            ((ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'hide') ||
            !ur.config().SoHeaderDetail)) {
            o.tbl.find('tbody tr:eq(0) td:eq(0)').focus();
            return false;
            }
            })

            o.dv.find('#q_so_ud_date').keydown(function (evt) {//最後的日期后就直接跳轉到行
            if (evt.keyCode === 9 || evt.keyCode === 13) {
            o.tbl.find('tbody tr:eq(0) td:eq(0)').focus();
            return false;
            }
            });

            var userMobile = o.dv.find('#q_so_ud_tel');
            userMobile.blur(function () {
            if ($(this).val().length != 11) {
            $(this).focus();
            }
            });
            try {
            suggest.mobile(userMobile, function (item, obj) {
            o.inputs.eq(9).val(item.tips).attr('data-district', item.districtCode);
            })
            } catch (e) { }

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
            if ($(this).hasClass('number')) { changeNumber(this); }
            $(this).parents('tr').addClass('dirty');
            checkProduct(this);
            }).live('keypress', function (evt) {
            if (evt.keyCode == 13) {
            pressEnter(this);
            return false;
            }
            }).live('focus', function () {
            if ($(this).index() == 0) {
            $(this).text($(this).data('tmpl-code'));
            }
            });

            o.tbl.find('tbody tr td .del').live('click', function () {
            delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
            clear();
            });
            */

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_so_u_total');

            iniHeadeD();
            //iniProduct();
            iniAttrDefin();
            iniUser();
        }
    },

    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            t += parseFloat($(this).find('td:eq(7)').text() || 0);
        });
        o.total.val(f.price(t, 2));
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoHead1', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoLine', lines, function () {
                    success(v);
                })
            }
            else {
                success(v);
            }
        })
    },
    displayBtn = function () {
        //o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_so_u_total,#q_so_u_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(4).val(a[4]);
        o.inputs.eq(5).val(state[a[11]] || state['draft']).attr('data-value', a[11] || 'draft');
        o.inputs.eq(6).val(a[3]);
        /*if (a[11] == 'cancel' || a[11] == 'confirm' || a[9] == 'TOP') {
            displayBtn();
        }
        else {
            showBtn();
        }*/
        o.inputs.eq(7).val(a[16]); //送货日期
        o.dv.find('.modal-footer textarea').text(a[8]);
        o.inputs.eq(8).val(a[12]); //用户姓名
        o.inputs.eq(9).val(a[13]); //用户电话
        o.inputs.eq(10).attr('data-district', a[14]).val(a[15]);
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb='',//ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));

            if (o.tbl.find('thead th:eq(1)').css('display') != 'none') {
                td.push(dom.td(b[12] || ''));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }
            if (o.tbl.find('thead th:eq(2)').css('display') != 'none') {
                td.push(dom.td(b[13] || ''));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }

            td.push(dom.td(b[4] || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            td.push(dom.td(f.price(b[5], 2) || '0', ctb + ' class="number"'));
            td.push(dom.td(f.price(b[2] * b[4] * (100 - parseFloat((b[5]||0))) / 100, 2), 'class="number"'));
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (!b[13]) {
                attr += ' class="dirty" ';
            }
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_stock_getPicking', [id], function (a) {
            fdataHead(a);
            getLine(id);
            //o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[' + a[17] + ']');
            o.dv.find('.modal-header h3').find('small').text('[' + a[17] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_stock_getTranForPickingOut', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(o.inputs.eq(6).val()); //saleId
        if (!o.inputs.eq(1).val() && !o.inputs.eq(7).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(o.inputs.eq(1).attr('data-id') || 0); //memberId
        head.push(o.inputs.eq(2).val()); //订单日期
        head.push(o.inputs.eq(4).val()); //金额
        head.push(o.dv.find('.modal-footer textarea').text() || ''); //备注
        head.push(o.inputs.eq(5).attr('data-value') || 'draft'); //状态
        head.push(o.inputs.eq(7).val()); //用户姓名
        head.push(o.inputs.eq(8).val()); //用户电话
        head.push(o.inputs.eq(9).attr('data-district')); //地区
        head.push(o.inputs.eq(9).val()); //街道
        head.push(o.inputs.eq(10).val()); //shipdate

        head.push(uid);
        head.push(ur.user().agentId);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push(tds.eq(3).text()); //qty
                line.push(tds.eq(4).text()); //price
                line.push(tds.eq(6).text()); //discount
                line.push(tds.eq(8).text()); //comment
                line.push(uid);
                if (line[2]) {
                    lines.push(line);
                }
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(10).val(gf.dateFormat(gf.addDay(new Date(), 1), 'yyyy-MM-dd'));
        o.inputs.eq(5).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
        defaultLine();
    };
    o.pickingOut = function () {
        gf.noPagination('up_stock_pickingOutForTop', [o.id,ur.user().id], function (a) {
            if (a.length === 0) {
                alert('出库成功！')
                agent.pickingOut.search();
            }
            else {
                agent.stockOutExpress.show(a);
            }
        });
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            o.id = id;
            displayBtn();
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.so.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.stockOutExpress = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvStockOutExpress' }),
    updateDelivery = function (expNo) {
        gf.noPagination('up_stock_updateDelivery', [o.id, o.tbl.find('select').val(), expNo, o.addressId, ur.user().id], function () {
            o.dv.modal('hide');
        })
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl = o.dv.find('table');
            o.dv.find('btn.success').click(function () {
                var expNo = o.tbl.find('input').val();
                if (o.type == 'TOP') {
                    var expCode = o.tbl.find('select :selected').text().split('-')[0];
                    jsonp.get(Constant.TOP_DELEVERY_EXPRESS, { tid: o.id, expressCo: expCode, expressNo: expNo, nick: o.nick }, function () {
                        updateDelivery(expNo);
                    });
                }
            });
        }
    };
    o.show = function (a) {
        ini();
        var addr = a[0], co = a.slice(1),
            tds = o.tbl.find('tbody td');
        tds.eq(0).text(addr[1]);
        tds.eq(1).text(addr[2]);
        tds.eq(2).text(addr[3]);
        tds.eq(3).text(addr[4]);
        gOption.foption(tds.eq(4).find('select'), co);
        o.id = addr[0];
        o.type = addr[6];
        o.addressId = addr[7];
        o.nick = addr[8];
        o.dv.modal('show');
    };
    return o;
})()

agent.accountInvoice = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvAccountInvoice', ttbl: 'account.invoice_v',
        fields: 'id,pNum,orderNumber,amount,orderDate,collecctDate,amount,amountCollected,status,aname,note'
    }), state = { 'draft': '未收款', 'done': '全部收款', 'part': '部分收款' },
    ini = function () {
        if (!o.dv) {
            o.preIni();

            var a = [];
            for (var k in state) {
                a.push([k, state[k]]);
            }
            gOption.foption($('#q_pickingo_status_id_in').eq(0), a, -1, ['', '']);

            o.dv.find('table tbody a').live('click', function () {
                agent.invoiceDetail.show(JSON.parse(decodeURI($(this).parents('tr').attr('data'))));
            });
        }
    };
    o.stockOut = function (obj) {
        var a = JSON.parse(decodeURI($(obj).parents('tr').attr('data')));
        agent.pickingDetail.id = a[0];
        agent.pickingDetail.pickingOut();
    }
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"')));
        c.push(dom.td(a[2])); 
        c.push(dom.td(a[9]));
        c.push(dom.td(f.date(a[4])));
        c.push(dom.td(f.date(a[5])));
        c.push(dom.td(a[6]));
        c.push(dom.td(a[7]));
        c.push(dom.td(state[a[8]]));
        c.push(dom.td(a[10]));
        data = encodeURI(JSON.stringify(a));
        c.push(dom.td('<a href="#">收款</a>'));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("pNum ='r_r'");
        aF.push("orderNumber ='r_r'");
        aF.push("status='r_r'");
        a.push(ur.user().agentId);
        var o = this.dvSp.find(':text,select');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    o.state = state;
    return o;
})()

agent.invoiceDetail = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvInvoiceDetail' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl = o.dv.find('table');
            o.dv.find('.btn-ok').click(function () {
                var a = [o.id], inputs = o.dv.find('input');
                a.push(inputs.eq(0).val());
                a.push(inputs.eq(1).val());
                a.push(ur.user().id);
                gf.noPagination('up_member_collectSo', a, function () {
                    o.dv.modal('hide');
                    agent.accountInvoice.search();
                })
            });
        }
    };
    o.show = function (addr) {
        ini();
        var tds = o.tbl.find('tbody td'), inputs = o.dv.find('input');
        if (addr[8] != 'draft') {
            inputs.attr('disabled', 'disabled');
        }
        tds.eq(0).text(addr[1]);
        tds.eq(1).text(addr[2]);
        tds.eq(2).text(f.date(addr[4]));
        tds.eq(3).text(addr[3]);
        inputs.eq(0).val(addr[7]);
        inputs.eq(1).val(addr[10]);
        o.id = addr[0];
        o.type = addr[6];
        o.addressId = addr[7];
        o.nick = addr[8];
        o.dv.modal('show');
    };
    return o;
})()

agent.stockIn = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvStockIn', ttbl: 'member.stockTranIn_v',
        fields: 'id,orderNumber,productName,category,qty,uom,price,outDate,productID'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('table tbody a').live('click', function () {
                var a = JSON.parse(decodeURI($(this).parents('tr').attr('data')));
                gf.noPagination('up_pos_stockIn', [a[0], a[4], ur.user().id], function () {
                    alert('入库成功！');
                    o.search();
                });
            });
        }
    },
    batchMoveIn = function () {

    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3]));
        c.push(dom.td(a[4], 'class=number'));
        c.push(dom.td('<small>' + a[5] + '</small>'));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[7])));
        data = encodeURI(JSON.stringify(a));
        c.push(dom.td('<a href="#">入库</a>'));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("(inDate is null)");
        a.push(ur.user().agentId);
        var o = this.dv.find('.tool :text');
        a.push(1);
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    return o;
})()

agent.stock = (function () {
    var o = $.extend({}, gobj, gpagination, { fields: 'ordernumber,productName,category,qty,uom,outDate,inDate' });
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[0]));
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3], 'class=number'));
        c.push(dom.td('<small>' + a[4] + '</small>'));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[5])));
        data = JSON.stringify(a);
        c.push(dom.td(''));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    };
    return o;
})()

agent.stockInR = (function () {
    var o = $.extend({}, agent.stock, { dvId: 'dvStockInR', ttbl: 'member.stockTranIn_v2' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
        }
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[0]));
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3], 'class=number'));
        c.push(dom.td('<small>' + a[4] + '</small>'));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[6])));
        data = JSON.stringify(a);
        c.push(dom.td(''));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("(inDate is not null)");
        a.push(ur.user().agentId);
        var o = this.dv.find('.tool :text');
        a.push(1);
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini,obj:o };
    return o;
})()

agent.stockOutR = (function () {
    var o = $.extend({}, agent.stock, { dvId: 'dvStockOutR', ttbl: 'member.stockTranOut_v' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
        }
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("(outDate is not null)");
        a.push(ur.user().agentId);
        var o = this.dv.find('.tool :text');
        a.push(1);
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini,obj:o };
    return o;
})()

agent.categoryUpd = (function () {
    var o = $.extend({}, gobj, base.form, { dvId: 'dvCategoryUpd', updProc: 'up_member_updateStoreCategory',
        queryProc: 'up_member_getStoreCategory', parent: agent.category
    });
    return o;
})();

agent.category = (function () {
    var o = $.extend({}, gobj, gpagination, base.query, { dvId: 'dvCategory', updObj: agent.categoryUpd, ttbl: 'member.storeCategory_v1', fields: 'id,code,name,bname,status,[description]' }),
    ini = function () {
        if (!o.dv) {
            o.ini();
            gf.noPagination('up_member_getBrandForCmb2', [1, ur.user().agentId], function (a) {
                for (var i = 0; i < a.length; i++) {
                    a[i] = [a[i][0], a[i][1]+'-'+a[i][2]];
                }
                gOption.foption($('.cmbBrand'), a);
            })
        }
    }
    ;
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        a[0] = ur.user().agentId;
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"'))); //编号
        c.push(dom.td(a[2])); //名称
        c.push(dom.td(a[3])); //名称
        c.push(dom.td(a[4] ? '有效' : '无效')); //状态
        c.push(dom.td(a[5])); //描述
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.userUpd1 = (function () {
    var o = $.extend({}, gobj, base.form, { dvId: 'dvUserUpd', updProc: 'up_user_updateStoreUser',
        queryProc: 'up_user_getStoreUser', parent: agent.user
    });
    return o;
})();

base.headBodyTabForm = $.extend({}, base.form, { updBodyProc: '',
    iniPostH: function () {
        var o = this;
        o.fields = o.dv.find('.modal-header,.modal-footer').find('[type=text],[type=number],[type=checkbox],select,textarea');
        o.dv.find('[name=query]').click(function () { o.queryItem(this); });
        if (o.iniPost) {
            o.iniPost();
        }
        o.tbl.find('tbody tr td .del').live('click', function () {
            o.delTr(this);
            $(this).parents('tr').addClass('dirty');
        });
        o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
            if ($(this).hasClass('number')) { o.changeNumber ? o.changeNumber(this) : null; }
            $(this).parents('tr').addClass('dirty');
        }).live('keypress', function (evt) {
            if (evt.keyCode == 13) {
                o.pressEnter(this);
                return false;
            }
        });
    },
    getLines: function () {

    },
    save: function (success) {
        var a = [this.id || 0, ur.user().agentId, ur.user().id], o = this;
        this.fields.each(function () {
            if ($(this)[0].type == "checkbox") {
                a.push($(this).parent().find(':checked').size());
            }
            else {
                a.push($(this).val()||null);
            }
        });
        var lines = this.getLines();
        if (lines.length === 0 && !o.id && o.otherLines === 0) {
            return;
        }
        gf.getOneLine(this.updProc, a, function (a) {
            for (var i = 0, len = lines.length, v = a[0]; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            o.id = a[0];
            if (lines.length != 0) {
                gf.callProcBatch(o.updBodyProc, lines, function () {
                    if (o.otherLines - lines.length == 0) {
                        success ? success(v) : null;
                    }
                    else {
                        o.otherLines = o.otherLines - lines.length;
                    }
                })
            }
            o.saveOtherLine ? o.saveOtherLine(success) : null;
        });
    },
    delTr: function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
    },
    queryItem: function () {

    },
    pressEnter: function (obj) {
        if ($(obj).hasClass('number')) {
            o.changeNumber ? o.changeNumber(obj) : null;
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    queryBody: function () {
        var o = this;
        gf.noPagination(this.queryBodyProc, [o.id], function (a) {
            var b = [], l = a.length;
            for (var i = 0; i < l; i++) {
                b.push(o.fdata(a[i]));
            }
            o.dv.find('.modal-body table tbody:eq(0)').html(b.join(''));
            o.activeDv = o.dv.find('.result-header').eq(0).parent();
            o.searchend(l);
        });
        o.queryBodyTab ? o.queryBodyTab() : null;
    },
    query: function () {
        this.queryH();
        this.queryBody();
    },
    clearBody: function () {
        this.dv.find('.modal-body table tbody').html('');
    },
    clear: function () {
        this.clearH();
        this.clearBody();
    }
});

agent.topUserLov = (function () {
    var o = $.extend({}, gobj, base.lov, { queryProc: 'up_base_getTopUserLov', dvId: 'dvTopUserLov', selectedHide: false }), state = { 'on': '启用', 'of': '关闭' };
    o.fdata = function (a) {
        //var format = '<tr data-id="{0}"><td></td><td>{1}</td><td>{2}</td><td>{4}</td><td>{3}</td><td></td></tr>';
        var tr = [];
        tr.push(dom.td(''));
        tr.push(dom.td(a[1]));
        tr.push(dom.td(state[a[2]]));
        return dom.tr(tr.join(''), 'data-id=' + a[0]); //String.format.apply(null, [format].concat(a));
    };
    o.selectedItem = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.nick = tds.eq(1).text();
        p.state = tds.eq(2).text();
        if (this.selectedHide) {
            o.dv.modal('hide');
        }
        o.callback ? o.callback(p) : null;
    };
    return o;
})()

agent.userUpd = (function () {
    var o = $.extend({}, gobj, base.headBodyTabForm, { dvId: 'dvUserUpd', updProc: 'up_user_updateStoreUser', updBodyProc: 'up_user_updateUserRoleRel',
        queryProc: 'up_user_getStoreUser', queryBodyProc: 'up_user_getUserRoleRel', parent: agent.user
    }), state = { 'on': '开启', 'of': '关闭' },
    selectedMenu = function (item) {
        //base.menuLov.selectedHide = true;
        var a = [], ctb = ' contenteditable="true"';
        a.push(dom.td(item.code));
        a.push(dom.td(item.name));
        //a.push(dom.td(item.name, ctb));
        //a.push(dom.td('', ctb));
        a.push(dom.td(item.desc));
        a.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
        var l = o.dv.find('.modal-body table tbody').eq(0).append(dom.tr(a.join(''), 'class="dirty" data-id="' + item.id + '"')).find('tr').size();
        o.searchend(l);
    },
    selectedTop = function (item) {
        var a = [];
        a.push(dom.td(item.nick));
        a.push(dom.td(item.state));
        a.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
        var l = o.dvTop.find('table tbody').append(dom.tr(a.join(''), 'class="dirty" data-id="' + item.id + '"')).find('tr').size();
        o.activeDv = o.dvTop;
        o.searchend(l);
    }
    getTopNick = function (nick, type) {
        o.activeDv = o.dvTop;
        var tr = [], tr0 = o.dvTop.find('tbody tr[data-nick="' + nick + '"]'),
        on = dom.btn('已启用', 'disabled class="btn"'), off = dom.btn('关闭', ' class="btn"');
        if (tr0.size() > 0 && type == 'new') {
            var tds = tr0.find('td');
            tds.eq(1).html(on);
            tds.eq(2).html(off);
            tr0.addClass('dirty');
            return;
        }
        if (type == 'new') {
            tr.push(dom.td(nick));
            tr.push(dom.td(on));
            tr.push(dom.td(off));
            tr.push(dom.td(''));
        }
        o.dvTop.find('tbody').prepend(dom.tr(tr.join(''), 'class="dirty" data-status="on" data-nick="' + nick + '"'));
        o.searchend(o.dvTop.find('tbody tr').size());
    };
    o.fdata = function (b) {
        var a = [], ctb = ' contenteditable="true"';
        a.push(dom.td(b[1]));
        a.push(dom.td(b[2]));
        //a.push(dom.td(b[3], ctb));
        //a.push(dom.td(b[4], ctb));
        a.push(dom.td(b[3]));
        a.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
        return dom.tr(a.join(''), 'data-id="' + b[0] + '"');
    };
    o.iniPost = function () {
        gf.noPagination('up_user_getRoleType', [], function (a) {
            gOption.foption(o.dv.find('#q_r_u_type'), a);
        });
        o.activeDv = o.dv.find('.tab-content .active');
        o.dvTop = o.dv.find('#q_m_u_top');
    };
    o.queryBodyTab = function () {
        gf.noPagination('up_user_getTopUser', [o.id], function (a) {
            var b = [], l = a.length;
            for (var i = 0; i < l; i++) {
                var c = [];
                c.push(dom.td(a[i][1]));
                c.push(dom.td(state[a[i][2]]));
                c.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
                b.push(dom.tr(c.join(''), 'data-id=' + a[i][0]));
                //b.push(o.fdata(a[i]));
            }
            o.dvTop.find('table tbody').html(b.join(''));
            var dv = o.activeDv;
            o.activeDv = o.dvTop;
            o.searchend(l);
            o.activeDv = dv;
        });
    };
    o.saveOtherLine = function (success) {
        var a = [], b = [];
        o.dvTop.find('tr.dirty').each(function () {
            b = [];
            var tds = $(this).find('td'), pre = '';
            b.push(o.id);
            if ($(this).css('display') == 'none') {
                pre = '-';
            }
            b.push(pre + $(this).attr('data-id'));
            a.push(b);
        });
        if (a.length > 0) {
            gf.callProcBatch('up_user_updaetUserTopNickRel', a, function (v) {
                if (o.otherLines - a.length == 0) {
                    success ? success(v) : null;
                }
                else {
                    o.otherLines = o.otherLines - a.length;
                }
            });
        }
        else {
            success ? success() : null;
        }
    }
    o.getLines = function () {
        var a = [];
        o.tbl.find('tbody').eq(0).find('tr.dirty').each(function () {
            var b = [ur.user().id], tds = $(this).find('td'), id = $(this).attr('data-id');
            if ($(this).css('display') == 'none') {
                id = -id;
            }
            b.push(id);
            b.push(tds.eq(2).text());
            b.push(tds.eq(3).text() || 0);
            a.push(b);
        });
        o.otherLines = o.tbl.find('tbody tr.dirty').size();
        return a;
    };
    o.queryItem = function (obj) {
        if ($(obj).hasClass('role')) {
            user.roleLov.show(selectedMenu);
        }
        else if ($(obj).hasClass('top')) {
            agent.topUserLov.show(selectedTop);
        }
    }
    return o;
})();

agent.user = (function () {
    var o = $.extend({}, gobj, gpagination, base.query, { dvId: 'dvUser', updObj: agent.userUpd, ttbl: '[user].users_v', fields: 'id,memberNo,name,mobile,aname,isActive' }),
    ini = function () {
        if (!o.dv) {
            o.ini();
        }
    }
    ;
    o.where = function () {
        var a = [], aF = [];
        aF.push('role<r_r');
        aF.push('agentId=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");

        a[0] = 10;
        a[1] = ur.user().agentId;
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"'))); //编号
        c.push(dom.td(a[2])); //名称
        c.push(dom.td(a[3])); //电话
        c.push(dom.td(a[4])); //电话
        c.push(dom.td(a[5] ? '有效' : '无效')); //状态
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.topUser = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvTopUser', updObj: agent.userUpd, ttbl: '[user].topUser', fields: 'id,nick,status,lastSessionDate,DATEDIFF(day,lastSessionDate,GETDATE())' })
        , topOauthUrl = null, status = { 'of': '未启用', 'on': '已启用' }, on = dom.btn('已启用', 'disabled class="btn"'), off = dom.btn('关闭', ' class="btn"'),
    getTopNick = function (nick, type, state, id) {
        id = id || 0;
        gf.getOneLine('up_user_updateTopNick1', [id, ur.user().agentId, nick, state,ur.user().id], function () {
            o.search();
        });
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                window.open(topOauthUrl);
            });
            o.tbl.find('tbody button').live('click', function () {
                var idx = $(this).parent().index();
                if (idx === 3) {
                    var nick = $(this).parents('tr').find('td:eq(0)').text();
                    jsonp.get(Constant.TOP_STOP_SYN_URL, { "nick": nick }, function (d) {
                        if (d.ISSuccess != 1) {
                            alert(d.errorMessage);
                        }
                        else {
                            getTopNick(nick, 'old', 'of');
                        }
                    });
                }
                else if (idx === 2) {
                    window.open(topOauthUrl);
                }
                else if (idx === 5) {
                     getTopNick(nick, 'old', 'of', -$(this).parents('tr').attr('data-id'));
                }
            });

            //获取地址
            jsonp.get(Constant.GET_TOP_OAUTH_URL, '', function (data) {
                topOauthUrl = data + "?openerFun=" + ur.user().id;
            });
            window.addEventListener('message', function (event) {
                var nick = event.data['uid' + ur.user().id];
                if (nick) {
                    getTopNick(nick, 'new', 'on');
                }
            }, false);
        }
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("nick like 'r_r%'");
        aF.push("status = 'r_r'");
        a[0] = ur.user().agentId;

        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[1])); //编号
        c.push(dom.td(status[a[2]])); //名称
        if (a[2] == 'on') {
            c.push(dom.td(dom.btn('已启用', 'class="btn"')));
            c.push(dom.td(dom.btn('停止', 'class="btn"')));
            c.push(dom.td(f.date(a[3]))); //名称
            c.push(dom.td(''));
        }
        else {
            c.push(dom.td(dom.btn('启用', 'class="btn"')));
            c.push(dom.td(dom.btn('已停止', 'disabled class="btn"')));
            c.push(dom.td('')); //名称
            c.push(dom.td(dom.btn('删除', 'class="btn"'))); //状态
        }
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini,obj:o };
    return o;
})()

agent.topItem = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvTopItem', ttbl: 'dbo.topItems_v1', fields: 'num_iid,pp,xh,title,price,num,pic_url,storeProductCode' })
        ,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.setSort('pp,xh');
            o.dv.find('tbody a').live('click', function () {
                var a = [], tr = $(this).parents('tr'), tds = tr.find('td');
                a.push(tds.eq(2).text() || tds.eq(3).text()); //型号
                a.push(tds.eq(1).text()); //品牌
                a.push(tr.attr('data-pic')); //picurl
                a.push(tds.eq(0).text()); //id
                a.push(tds.eq(4).text()); //price
                a.push(tds.eq(5).text()); //qty
                a.push(tr.attr('data-spcode'));//store product code
                a.push(tds.eq(3).text());
                agent.topItemDetail.show(tr.attr('data-id'), a);
            })
        }
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("num_iid = r_r");
        aF.push("title like 'r_r%'");

        a[0] = ur.user().agentId;

        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[0])); //编号
        c.push(dom.td(a[1])); //品牌
        c.push(dom.td(a[2])); //型号
        c.push(dom.td(a[3])); //名称
        c.push(dom.td(f.priceLabel(a[4]))); //名称
        c.push(dom.td(a[5])); //名称
        c.push(dom.td(dom.a('明细', '#'))); //名称
        return dom.tr(c.join(""), 'data-id="' + a[0] + '" ' + 'data-pic="' + a[6] + '" data-spcode="'+a[7]+'"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.topItemDetail = (function () {
    var o = { dv: null, dvId: 'dvTopItemDetail' }, item,
    importProduct = function (tr) {
        var a = [], tds = tr.find('td');
        a.push(item[0]); //名称
        a.push(tds.eq(1).text()); //数量
        a.push(tds.eq(2).text()); //价格
        a.push(tds.eq(0).text()); //sku
        a.push(o.id); //numiid
        a.push(tr.find('td.pid1').attr('pid'));
        a.push(tr.find('td.pid2').attr('pid'));
        a.push(tr.find('td.pid1').text());
        a.push(tr.find('td.pid2').text());
        a.push(item[1]); //brand
        a.push(item[2].substr(0, item[2].lastIndexOf('/') + 1)); //pic
        a.push(item[2].substr(item[2].lastIndexOf('/') + 1)); //picname
        a.push(ur.user().agentId);
        a.push(ur.user().id);
        gf.callProc_with_value('up_stock_importTopProduct', a, function () {
            o.show(o.id, item);
        })
    },
    mapProduct = function (tr) {
        var skuId = tr.attr('data-id') || 0, itemId = tr.attr('data-itemId') || 0;
        agent.productSingleLov.show(function (p) {
            gf.noPagination('up_stock_MapTopProduct', [skuId, itemId, p.id || 0, p.storeProductId, ur.user().agentId, ur.user().id], function () {
                item[6] = p.productName;
                agent.topItem.search();
                o.show(o.id, item);
            })
        })
    },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#' + o.dvId);
            o.dv.find('tbody a').live('click', function () {
                if ($(this).hasClass('imp')) {
                    importProduct($(this).parents('tr'));
                    $(this).text('导入中...');
                }
                else if ($(this).hasClass('map')) {
                    mapProduct($(this).parents('tr'));
                }
            });
        }
    };
    o.show = function (id, itm) {
        ini(); item = itm; o.id = id;
        o.dv.find('.modal-header t').text(item[7]);
        gf.noPagination('up_stock_getTopItemDetail', [id], function (a) {
            var props = a[0][3].split(';'), p = {}, tr = [], att1Lb = '', att2Lb = '', td = [];
            for (var i = 0, b; b = props[i]; i++) {
                b = b.split(':');
                if (!p[b[0]]) {
                    p[b[0]] = {};
                }
                p[b[0]][b[1]] = b[2] + '_' + b[3];
            };
            if (a.length > 1) {
                for (var i = 1, b = []; b = a[i]; i++) {
                    var ps = b[3].split(';'), psd = ps[0].split(':'), pvalue = '', cls = '';
                    td = [];
                    td.push(dom.td(b[0]));
                    td.push(dom.td(b[1]));
                    td.push(dom.td(f.priceLabel(b[2])));
                    pvalue = p[psd[0]][psd[1]].split('_');
                    att1Lb = att1Lb || pvalue[0];
                    if (att1Lb.indexOf('颜色') >= 0) {
                        cls = 'pid1';
                    }
                    else {
                        cls = 'pid2';
                    }
                    td.push(dom.td(pvalue[1], 'class=' + cls + ' pid=' + psd[0]));
                    if (ps[1]) {
                        psd = ps[1].split(':');
                        pvalue = p[psd[0]][psd[1]].split('_');
                        att2Lb = att2Lb || pvalue[0];
                        if (att2Lb.indexOf('颜色') >= 0) {
                            cls = 'pid1';
                        }
                        else {
                            cls = 'pid2';
                        }
                        td.push(dom.td(pvalue[1], 'class=' + cls + ' pid=' + psd[0]));
                    }
                    else {
                        td.push(dom.td(''));
                    }
                    td.push(dom.td(dom.a(b[4] || '选择本地产品', '#', 'class=map')));
                    td.push(dom.td(dom.a('导入到本地', '#', 'class=imp')));
                    tr.push(dom.tr(td.join(''), 'data-id=' + b[0] + ' data-itemId=' + id));
                };
            }
            else {
                td.push(dom.td(item[3]));
                td.push(dom.td(item[5]));
                td.push(dom.td(f.priceLabel(item[4])));
                td.push(dom.td(dom.a(item[6] || '选择本地产品', '#', 'class=map')));
                td.push(dom.td(dom.a('导入到本地', '#', 'class=imp')));
                tr.push(dom.tr(td.join(''), 'data-itemId=' + item[3]));
            }
            o.dv.modal('show').find('table tbody').html(tr.join(''));
            o.dv.find('table thead th a').eq(3).text(att1Lb).end().eq(4).text(att2Lb);
        })
    };
    return o;
})()

base.menuLov = (function () {
    var o = $.extend({}, gobj, base.lov, { queryProc: 'up_base_getMenuLov', dvId: 'dvMenuLov', selectedHide: true });
    o.fdata = function (a) {
        var format = '<tr data-id="{0}"><td></td><td>{1}</td><td>{2}</td><td>{4}</td><td>{3}</td><td></td></tr>';
        return String.format.apply(null, [format].concat(a));
    };
    o.selectedItem = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tds.eq(1).text();
        p.name = tds.eq(2).text();
        p.desc = tds.eq(4).text();
        if (this.selectedHide) {
            o.dv.modal('hide');
        }
        o.callback ? o.callback(p) : null;
    };
    return o;
})()

agent.roleUpd = (function () {
    var o = $.extend({}, gobj, base.headBodyForm, { dvId: 'dvRoleUpd', updProc: 'up_user_updateStoreRole', updBodyProc: 'up_user_updateRoleMenuRel',
        queryProc: 'up_user_getStoreRole', queryBodyProc: 'up_user_getRoleMenuRel', parent: agent.role
    }),
    selectedMenu = function (item) {
        //base.menuLov.selectedHide = true;
        var a = [], ctb = ' contenteditable="true"';
        a.push(dom.td(item.code));
        a.push(dom.td(item.name));
        a.push(dom.td(item.name, ctb));
        a.push(dom.td('', ctb));
        a.push(dom.td(item.desc));
        a.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
        var l = o.dv.find('.modal-body table tbody').append(dom.tr(a.join(''), 'class="dirty" data-id="' + item.id + '"')).find('tr').size();
        o.searchend(l);
    };
    o.fdata = function (b) {
        var a = [], ctb = ' contenteditable="true"';
        a.push(dom.td(b[1]));
        a.push(dom.td(b[2]));
        a.push(dom.td(b[3], ctb));
        a.push(dom.td(b[4], ctb));
        a.push(dom.td(b[5]));
        a.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
        return dom.tr(a.join(''), 'data-id="' + b[0] + '"');
    };
    o.iniPost = function () {
        gf.noPagination('up_user_getRoleType', [], function (a) {
            gOption.foption(o.dv.find('#q_r_u_type'), a);
        });
    };
    o.getLines = function () {
        var a = [];
        o.tbl.find('tbody tr.dirty').each(function () {
            var b = [ur.user().id], tds = $(this).find('td'), id = $(this).attr('data-id');
            if ($(this).css('display') == 'none') {
                id = -id;
            }
            b.push(id);
            b.push(tds.eq(2).text());
            b.push(tds.eq(3).text() || 0);
            a.push(b);
        });
        return a;
    };
    o.queryItem = function () {
        var qp = base.menuLov.queryProc;
        base.menuLov.queryProc = 'up_base_getMenuLovSub';
        base.menuLov.selectedHide = false;
        base.menuLov.show(selectedMenu);
        base.menuLov.queryProc = qp;
    }
    return o;
})();

agent.role = (function () {
    var o = $.extend({}, gobj, gpagination, base.query, { dvId: 'dvRole', updObj: agent.roleUpd, ttbl: '[user].role_v', fields: 'id,code,name,tname,status,[desc]' }),
    ini = function () {
        if (!o.dv) {
            o.ini();
        }
    }
    ;
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        a[0] = ur.user().agentId;

        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"'))); //编号
        c.push(dom.td(a[2])); //名称
        c.push(dom.td(a[3])); //电话
        c.push(dom.td(a[4] ? '有效' : '无效')); //状态
        c.push(dom.td(a[5])); //描述
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

user.roleLov = (function () {
    var o = $.extend({}, gobj, base.lov, { queryProc: 'up_user_getRoleLov', dvId: 'dvRoleLov', selectedHide: true });
    o.fdata = function (a) {
        var format = '<tr data-id="{0}"><td></td><td>{1}</td><td>{2}</td><td>{4}</td><td>{3}</td><td></td></tr>';
        return String.format.apply(null, [format].concat(a));
    };
    o.selectedItem = function (tr) {
        tds = tr.find('td');
        var p = {};
        p.id = tr.attr('data-id');
        p.code = tds.eq(1).text();
        p.name = tds.eq(2).text();
        p.desc = tds.eq(4).text();
        if (this.selectedHide) {
            o.dv.modal('hide');
        }
        o.callback ? o.callback(p) : null;
    };
    return o;
})()

agent.returnReasonUpd = (function () {
    var o = $.extend({}, gobj, base.form, { dvId: 'dvReturnReasonUpd', updProc: 'up_member_updateReturnReason',
        queryProc: 'up_member_getReturnReason', parent: agent.returnReason
    });
    return o;
})();

agent.returnReason = (function () {
    var o = $.extend({}, gobj, gpagination, base.query, { dvId: 'dvReturnReason', updObj: agent.returnReasonUpd, ttbl: 'member.soReturnReason', fields: 'id,code,name,status,[desc]' }),
    ini = function () {
        if (!o.dv) {
            o.ini();
        }
    }
    ;
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        a[0] = ur.user().agentId;
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"'))); //编号
        c.push(dom.td(a[2])); //名称
        c.push(dom.td(a[3] ? '有效' : '无效')); //状态
        c.push(dom.td(a[4])); //描述
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.so = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.soHead_v3',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,cname,mobile,cct",
        dvId: 'dvSo'
    }), _displayAll = false,
    state = { 'draft': '草稿', 'cancel': '已取消', 'return': '已退货', 'nosend': '未发货',
        'norece': '未收货', 'success': '已完成', 'confirm': '已确认'
    },
    iniRole = function () {
        var st = o.tbl.find('thead th').eq(3);
        _displayAll = false;
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.role) {
                if (ur.config().attributeDefin.role[k].id == base.STATIC.ROLE_MANAGER) {
                    _displayAll = true;
                    break;
                }
            }
        }
    },
    iniUser = function () {
        gf.noPagination('up_user_getStoreUserForCmb', [ur.user().agentId], function (a) {
            gOption.foption(o.dv.find('#q_so_user'), a, ur.user().id, ['', '']);
        });
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.soUpd.show();
            });

            o.setSort('creationDate');

            var a = [];
            for (var k in state) {
                a.push([k, state[k]]);
            }
            gOption.foption($('#q_so_status_id_in').eq(0), a, -1, ['', '']);

            gf.noPaginationSqlPara('storeID=' + ur.user().agentId, 'ID asc', "id,code+' - '+name", 'member.storeCategory', function (a) {
                gOption.foption($('.cmbCategory').eq(1), a);
                gOption.foption($('.cmbCategory').eq(0), a, -1, ['', '']);
            });
            o.tbl.find('tbody tr a').live('click', function () {
                agent.soUpd.show($(this).parents('tr').attr('data-id'));
            });
            iniRole();
            iniUser();
        }
    },
    updateStatus = function (id, status) {
        gf.callProc_with_value('up_agent_updateSoStatus', [id, status, ur.user().id], function () {
            o.search();
        })
    },
    so2poError = function (code) {
        switch (code) {
            case 99:
                break;
            case 1:
                alert('产品未对应本地产品！');
                break;
            case 2:
                alert('产品未定义供应商！');
                break;
            case 3:
                alert('产品的采购价定义异常！');
                break;
            case 4:
                alert('对应产品非Erp产品！');
                break;
            default:
                alert('订单转换成功！');
                o.search();
        }
    },
    so2po = function (id) {
        if (o.param.forErp) {
            var ids = [];
            o.dv.find('tbody :checkbox:checked').each(function () {
                ids.push($(this).val());
            })
            agent.poUpdForErp.ids = ids;
            agent.poUpdForErp.show(id, '', 'so2po', so2poError);
        }
        else {
            gf.getOneLine('up_member_updateSo2Po', [id, ur.user().id, ur.user().agentId], function (a) {
                so2poError(a[0]);
            });
        }
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddview':
                agent.soUpd.show(id, 'view');
                break;
            case 'ddedit':
                agent.soUpd.show(id, 'edit');
                break;
            case 'ddconfirm':
                updateStatus(id, 'confirm');
                break;
            case 'ddcancel':
                updateStatus(id, 'cancel');
                break;
            case 'so2po':
                so2po(id);
                break;
        }
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    o.printSo = function (id) {
        var doc = $(frames['ptso'].document).find('div');
        doc.find('table:visible').remove();
        var tbl = doc.find('table').clone();
        tbl.show().appendTo(doc);
        var trs = tbl.find('tbody tr'),
            title = trs.eq(0),
            header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
            comment = trs.eq(4), line = trs.eq(6), xj = trs.eq(7), hj = trs.eq(8), dx = trs.eq(9),
            a = o.data[id];

        title.find('td').text(ur.user().coName);
        date.find('td c').eq(0).text(f.date(a[2])).end().eq(1).text(a[1]);
        customer.find('td c').eq(0).text(a[3]).end().eq(1).text(a[7]);
        comment.find('td c').text(a[8]), tqty = 0, tamount = 0, tdis = 0;

        gf.noPagination('up_member_getSoLine', [id], function (a) {
            var tds = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                if (i == 0) {
                    tds = line.find('td');
                }
                else {
                    var cl = line.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4]); //qty
                tqty += b[4];
                tds.eq(6).text(f.price(b[2] * b[4], 2)); //amount
                tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (100 - b[5]) / 100, 2)); //折后
                tamount += b[2] * b[4] * (100 - b[5]) / 100;
            }
            xj.find('td').eq(1).text(tqty).end().eq(3).text(f.price(tamount, 2));
            hj.find('td c').eq(0).text(tqty).end().eq(1).text(f.price(tamount, 2)).end().eq(2).text(f.price(tdis, 2));
            dx.find('td c').text(f.chineseNumber(tamount));
            frames['ptso'].print();
        });
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('saleID=r_r');
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("saleId=r_r");
        aF.push("status = 'r_r'");

        if (!_displayAll) {
            a.push(ur.user().id);
        }
        else {
            a.push(null);
        }
        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        a.push(inputs.eq(5).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#')));
        c.push(dom.td(f.date(a[2])));
        if (a[7])
            c.push(dom.td(a[7] + '[' + a[3] + ']'));
        else
            c.push(dom.td('个人[' + a[10] + ']'));
        c.push(dom.td(a[4]));
        c.push(dom.td(f.priceLabel(a[5])));
        var stat = '', stat2 = '', stat3 = '',
            statSo2Po = '';
        if (a[6] && o.param.type == 'so2po' && a[12] == 0) {
            statSo2Po = '<li class="" for="so2po"><a href="#"><i class="f-icon-retweet"></i>销售转采购单</a></li>';
        }

        // if (a[9] == 'cancel') {
        //     stat = '已取消'
        // }
        // else {
        stat = a[6] && f.date(a[6]);
        if (a[9] == 'draft' || a[9] == '') {
            //stat = '草稿';
            stat3 = '  <li class="" for="ddconfirm"><a href="#"><i class="icon-ok-sign"></i>确认</a></li>' +
              '  <li class="" for="ddcancel"><a href="#"><i class="icon-remove-circle"></i>取消</a></li>';
            stat2 = '  <li class="" for="ddedit"><a href="#"><i class="icon-pencil"></i>修改</a></li>';

        }
        //}
        c.push(dom.td(stat));
        c.push(dom.td(state[a[9]] + (a[12] != 0 ? '/已转采购' : '')));
        var b = [['修改', 'update'], ['查看', 'view']];
        b = (!!a[6]) ? b[1] : b[0];

        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddview"><a href="#"><i class="icon-file"></i>查看</a></li>' + stat2 +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '  <li class="divider"></li> ' + stat3 + statSo2Po +
              '</ul></td>';
        c.push(dd);
        if (a[9] == 'draft' || a[9] == '') {
            c.push(dom.td(''));
        }
        else {
            c.push(dom.td('<input type="checkbox" value=' + a[0] + '>'));
        }
        o.data[a[0]] = a;
        //var btn = "<input value=" + b[0] + " type=button class=" + b[1] + " />";
        //c.push(dom.td(btn));

        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.updateStatus = updateStatus;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    o.state = state;
    return o;
})()

agent.soUpd = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoUpd', inputs: [], status: agent.so.state }),
    productTmpl = {}, productTmplList = [], productProd = {}, productProdList = [],
    iniBmap = function () {
        if (BMap) {
            function G(id) {
                return document.getElementById(id);
            }
            //var map = new BMap.Map("l-map");
            //map.centerAndZoom("上海", 12);                   // 初始化地图,设置城市和地图级别。

            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input": "q_so_ud_street", "location": '上海' });

            ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                $(G(e.target._options.input)).attr('data-district', _value.district || _value.city);
                //G("q_so_ud_srp").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                $(G(e.target._options.input)).attr('data-district', _value.district);
                //G("q_so_ud_srp").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                //setPlace();
            });
        }
    },
    iniHeadeD = function () {
        var headerDetail = o.dv.find('.dvHeaderDetail'),
        controller = o.dv.find('.controller').click(function () {
            if (ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'show') {
                headerDetail.hide();
                controller.removeClass('f-icon-chevron-up');
                controller.addClass('f-icon-chevron-down');
                ur.config({ SoHeaderDetail: 'hide' });
            }
            else {
                headerDetail.show();
                controller.removeClass('f-icon-chevron-down');
                controller.addClass('f-icon-chevron-up');
                ur.config({ SoHeaderDetail: 'show' });
            }
        });
        if (ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'show') {
            headerDetail.show();
            controller.removeClass('f-icon-chevron-down');
            controller.addClass('f-icon-chevron-up');
            ur.config({ SoHeaderDetail: 'show' });
        }
        else {
            headerDetail.hide();
            controller.removeClass('f-icon-chevron-up');
            controller.addClass('f-icon-chevron-down');
            ur.config({ SoHeaderDetail: 'hide' });
        }
    },
    iniUser = function () {
        gf.noPagination('up_user_getStoreUserForCmb', [ur.user().agentId], function (a) {
            gOption.foption(o.dv.find('#q_so_u_user'), a, ur.user().id);
        });
    },
    iniProduct = function () {
        gf.noPagination('up_base_getProductTemplCode', [ur.user().agentId], function (a) {
            for (var i = 0, b = []; b = a[i]; i++) {
                productTmpl[b[1]] = { id: b[0], name: b[2] };
                productTmplList.push({ id: b[0], code: b[1], name: b[2], label: b[1] });
            }
        });
        gf.noPagination('up_base_getProductProdCode', [ur.user().agentId], function (a) {
            for (var i = 0, b = []; b = a[i]; i++) {
                var obj = { id: b[0], code: 'p' + b[1], name: b[3], label: b[2], price: b[6], uom: b[7], sub: b }
                if (productProd['p' + b[1]]) {
                    productProd['p' + b[1]].push(obj);
                }
                else {
                    productProd['p' + b[1]] = [obj];
                }
            }
        });
    },
    iniAttrDefin = function () {
        if (ur.config().attributeDefin) {
            for (k in ur.config().attributeDefin.product) {
                var t = o.tbl.find('thead .' + k).show(), pa = ur.config().attributeDefin.product[k];
                if (pa.isUn) {
                    t.show();
                    t.find('a').text(pa.label);
                }
                else {
                    t.hide();
                }
            }
        }
    },
    sugSelectProd = function (pp, item) {//suggest 选择了产品 pp productProduct
        var tr = pp.parents('tr').attr('data-prod-id', item.id).attr('data-attr' + (pp.index() - 1), item.label),
        tds = tr.find('td');
        tds.eq((pp.index() - 1)).text(item.name);
        tds.eq(3).text(1);
        tds.eq(4).text(item.price);
        tds.eq(5).text(item.uom);
        tds.eq(6).text(0);
        tds.eq(7).text(item.price);
    },
    suggestProd = function () {
        o.tbl.find('tbody tr').each(function () {
            var pt = $(this).find('td:eq(0)');
            pt.autocomplete({
                minLength: 0,
                source: productTmplList,
                //autoFocus: true,
                focus: function (event, ui) {
                    pt.text(ui.item.code);
                    //pt.parents('tr').data('tmpl-id','p' + ui.item.id);
                    //return false;
                },
                select: function (event, ui) {
                    pt.text(ui.item.code);
                    //pt.parents('tr').data('tmpl-id', 'p' + ui.item.id);
                    return false;
                }
            })
        .data("autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                .data("item.autocomplete", item)
                .append("<a>" + item.code + "<small>" + item.name + "</small></a>")
                .appendTo(ul);
        };

            var pp = $(this).find('td:eq(1)');
            pp.autocomplete({
                minLength: 0, autoFocus: true,
                source: function (req, rep) {
                    var a = productProd[pp.parents('tr').attr('data-tmpl-id')], c = [], b = [];
                    for (var i = 0; i < a.length; i++) {
                        if (b.indexOf(a[i].label) < 0) {
                            c.push(a[i]);
                            b.push(a[i].label);
                        }
                    }
                    rep(c);
                },
                focus: function (event, ui) {
                    pp.text(ui.item.name);
                    sugSelectProd(pp, ui.item);
                    return false;
                },
                select: function (event, ui) {
                    pp.text(ui.item.name);
                    sugSelectProd(pp, ui.item);
                    return false;
                }
            })
        .data("autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                .data("item.autocomplete", item)
                .append("<a><small>" + item.name + "</small></a>")
                .appendTo(ul);
        };

            var pp2 = $(this).find('td:eq(2)');
            pp2.autocomplete({
                minLength: 0, autoFocus: true,
                source: function (req, rep) {
                    var tr = pp2.parents('tr'),
                        a = productProd[tr.attr('data-tmpl-id')],
                        c = [], label = tr.attr('data-attr1');
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].label == label) {
                            var b = $.extend({}, a[i]);
                            b.label = a[i].sub[4];
                            b.name = a[i].sub[5];
                            c.push(b);
                            //b.push(a[i].label);
                        }
                    }
                    rep(c);
                },
                focus: function (event, ui) {
                    pp2.text(ui.item.name);
                    sugSelectProd(pp2, ui.item);
                    return false;
                },
                select: function (event, ui) {
                    pp2.text(ui.item.name);
                    sugSelectProd(pp2, ui.item);
                    return false;
                }
            })
        .data("autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                .data("item.autocomplete", item)
                .append("<a><small>" + item.name + "</small></a>")
                .appendTo(ul);
        };

        })
    },
    checkProduct = function (pobj) {
        if ($(pobj).index() == 0) {//校驗產品
            var pt = productTmpl[$(pobj).text().toUpperCase()];
            if (pt) {
                $(pobj).data({ 'tmpl-id': pt.id, 'tmpl-code': $(pobj).text().toUpperCase(), 'tmpl-name': pt.name });
                $(pobj).text($(pobj).text().toUpperCase() + ' ' + pt.name);

                $(pobj).parents('tr').attr('data-tmpl-id', 'p' + pt.id);
                if (productProd['p' + pt.id].length === 1) {
                    sugSelectProd($(pobj).next().next(), productProd['p' + pt.id][0]);
                }
            }
            else {
                $(pobj).focus();
            }
        }
    },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () {
                agent.productLovMutil.show(selectedProduct, 'ag');
                o.dv.modal('hide');
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_so_u_partner').next().click(function () {
                agent.partnerLov.show(fillPartner, o.partner.val(), 'customer');
            }).end().blur(function () {
                if ($(this).val()) {
                    $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
                }
                else {
                    $(this).attr({'data-code':'','data-name':'','data-id':''});
                }
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '')
            });

            o.dv.find('#q_so_u_user').keydown(function (evt) {//最後的日期后就直接跳轉到行
                if (evt.keyCode === 9 &&
                                ((ur.config().SoHeaderDetail && ur.config().SoHeaderDetail == 'hide') ||
                                        !ur.config().SoHeaderDetail)) {
                    o.tbl.find('tbody tr:eq(0) td:eq(0)').focus();
                    return false;
                }
            })

            o.dv.find('#q_so_ud_date').keydown(function (evt) {//最後的日期后就直接跳轉到行
                if (evt.keyCode === 9 || evt.keyCode === 13) {
                    o.tbl.find('tbody tr:eq(0) td:eq(0)').focus();
                    return false;
                }
            });

            var userMobile = o.dv.find('#q_so_ud_tel');
            userMobile.blur(function () {
                if ($(this).val().length != 11) {
                    $(this).focus();
                }
            });
            try {
                suggest.mobile(userMobile, function (item, obj) {
                    o.inputs.eq(10).val(item.tips).attr('data-district', item.districtCode);
                })
            } catch (e) { }

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                if ($(this).hasClass('number')) { changeNumber(this); }
                $(this).parents('tr').addClass('dirty');
                checkProduct(this);
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            }).live('focus', function () {
                if ($(this).index() == 0) {
                    $(this).text($(this).data('tmpl-code'));
                }
            });

            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_so_u_total');

            iniHeadeD();
            iniBmap();
            iniProduct();
            iniAttrDefin();
            iniUser();
        }
    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));

            if (o.tbl.find('thead th:eq(1)').css('display') != 'none') {
                td.push(dom.td(b[7] || ''));
            }
            else {
                td.push(dom.td('', 'display:none'));
            }
            if (o.tbl.find('thead th:eq(2)').css('display') != 'none') {
                td.push(dom.td(b[8] || ''));
            }
            else {
                td.push(dom.td('', 'display:none'));
            }

            td.push(dom.td('1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            //td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(o.discount || b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2] * (100 - (o.discount || 0)) / 100, 'class="number"'));
            td.push(dom.td('', ctb));

            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            //if (b[7])
            //    attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').prepend(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(4).attr('data-value', 'confirm');
        submit(function (id) {
            agent.so.updateStatus(id, 'confirm');
            o.show(id);
        });
    },
    cancelOrder = function () {
        o.inputs.eq(4).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
        else if (obj.hasClass('clear')) {
            clear();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(4).text(), num = tds.eq(3).text() || 0;
        tds.eq(7).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(6).text() || 0)) / 100);
        total();
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            t += parseFloat($(this).find('td:eq(7)').text() || 0);
        });
        o.total.val(f.price(t, 2));
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoHead3', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoLine', lines, function () {
                    success(v);
                })
            }
            else {
                success(v);
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_so_u_total,#q_so_u_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(4).val(a[4]);
        o.inputs.eq(5).val(a[19]);
        o.invoiceId = a[18];
        o.inputs.eq(6).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        o.inputs.eq(7).val(a[3]);
        if (a[11] == 'cancel' || a[11] == 'confirm' || a[9] == 'TOP') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8]);
        o.inputs.eq(8).val(a[12]); //用户姓名
        o.inputs.eq(9).val(a[13]); //用户电话
        o.inputs.eq(10).attr('data-district', a[14]).val(a[15]);
        o.inputs.eq(11).val(a[16]); //用户电话
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));

            if (o.tbl.find('thead th:eq(1)').css('display') != 'none') {
                td.push(dom.td(b[10] || ''));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }
            if (o.tbl.find('thead th:eq(2)').css('display') != 'none') {
                td.push(dom.td(b[11] || ''));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }

            td.push(dom.td(b[4] || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            td.push(dom.td(f.price(b[5], 2) || '0', ctb + ' class="number"'));
            td.push(dom.td(f.price(b[2] * b[4] * (100 - parseFloat(b[5])) / 100, 2), 'class="number"'));
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (!b[13]) {
                attr += ' class="dirty" ';
            }
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_member_getSoHead2', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[' + a[17] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getSoLine2', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(o.inputs.eq(7).val()); //saleId
        if (!o.inputs.eq(1).val() && !o.inputs.eq(7).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(o.inputs.eq(1).attr('data-id') || 0); //memberId
        head.push(o.inputs.eq(2).val()); //订单日期
        head.push(o.inputs.eq(4).val()); //金额
        head.push(o.dv.find('.modal-footer textarea').text() || ''); //备注
        head.push(o.inputs.eq(5).val()); //预收款
        head.push(o.inputs.eq(6).attr('data-value') || 'draft'); //状态
        head.push(o.inputs.eq(8).val()); //用户姓名
        head.push(o.inputs.eq(9).val()); //用户电话
        head.push(o.inputs.eq(10).attr('data-district')); //地区
        head.push(o.inputs.eq(10).val()); //街道
        head.push(o.inputs.eq(11).val()); //shipdate

        head.push(o.invoiceId || 0); //收款信息
        head.push(uid);
        head.push(ur.user().agentId);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push(tds.eq(3).text()); //qty
                line.push(tds.eq(4).text()); //price
                line.push(tds.eq(6).text()); //discount
                line.push(tds.eq(8).text()); //comment
                line.push(uid);
                if (line[2]) {
                    lines.push(line);
                }
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    defaultLine = function () {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        for (var i = 0; i < 5; i++) {
            var td = [];
            td.push(dom.td('', ctb));
            if (o.tbl.find('thead th:eq(1)').css('display') != 'none') {
                td.push(dom.td('', ctb));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }
            if (o.tbl.find('thead th:eq(2)').css('display') != 'none') {
                td.push(dom.td('', ctb));
            }
            else {
                td.push(dom.td('', 'style="display:none"'));
            }
            td.push(dom.td('', 'class="number" ' + ctb));
            td.push(dom.td('', 'class="number" ' + ctb));
            td.push(dom.td('<small></small>'));
            td.push(dom.td('', ctb + ' class="number"'));
            td.push(dom.td('', 'class="number"'));
            td.push(dom.td('', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            tr.push(dom.tr(td.join('')));
        }
        o.tbl.find('tbody').append(tr.join(''));
        suggestProd();
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(11).val(gf.dateFormat(gf.addDay(new Date(), 1), 'yyyy-MM-dd'));
        o.inputs.eq(6).val(o.status['draft']).attr('data-value', 'draft');
        o.invoiceId = null;
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
        defaultLine();
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.so.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.soReturn = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.soReturnHead_v',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,rname",
        dvId: 'dvSoReturn'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.soReturnUpd.show();
            });

            gf.noPagination('up_member_getReturnReasonForCmb', [ur.user().agentId], function (a) {
                var b = [];
                for (var i = 0, c = []; c = a[i]; i++) {
                    if (c[3]) {
                        b.push(c);
                    }
                }
                gOption.foption($('.cmbReturnReason').eq(1), b);
                gOption.foption($('.cmbReturnReason').eq(0), a, -1, ['', '']);
            });
            o.tbl.find('tbody tr a').live('click', function () {
                agent.soReturnUpd.show($(this).parents('tr').attr('data-id'));
            });

        }
    },
    updateStatus = function (id, status) {
        gf.callProc_with_value('up_agent_updateSoStatus', [id, status, ur.user().id], function () {
            o.search();
        })
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddview':
                agent.soReturnUpd.show(id, 'view');
                break;
            case 'ddedit':
                agent.soReturnUpd.show(id, 'edit');
                break;
            case 'ddconfirm':
                updateStatus(id, 'confirm');
                break;
            case 'ddcancel':
                updateStatus(id, 'cancel');
                break;
        }
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    o.printSo = function (id) {
        var doc = $(frames['ptso'].document).find('div');
        doc.find('table:visible').remove();
        var tbl = doc.find('table').clone();
        tbl.show().appendTo(doc);
        var trs = tbl.find('tbody tr'),
            title = trs.eq(0),
            header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
            comment = trs.eq(4), line = trs.eq(6), xj = trs.eq(7), hj = trs.eq(8), dx = trs.eq(9), a = o.data[id];

        title.find('td').text(ur.user().coName);
        header.find('td').text('退货单');
        date.find('td c').eq(0).text(f.date(a[2])).end().eq(1).text(a[1]);
        customer.find('td c').eq(0).text(a[3]).end().eq(1).text(a[7]);
        comment.find('td c').text(a[8]), tqty = 0, tamount = 0, tdis = 0;

        gf.noPagination('up_member_getSoLine', [id], function (a) {
            var tds = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                if (i == 0) {
                    tds = line.find('td');
                }
                else {
                    var cl = line.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                b[4] = b[4] * -1;
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4]); //qty
                tqty += b[4];
                tds.eq(6).text(f.price(b[2] * b[4], 2)); //amount
                //tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (100 - b[5]) / 100, 2)); //折后
                tamount += b[2] * b[4] * (100 - b[5]) / 100;
            }
            xj.find('td').eq(1).text(tqty).end().eq(3).text(f.price(tamount, 2));
            hj.find('td c').eq(0).text(tqty).end().eq(1).text(f.price(tamount, 2)).end().eq(2).text(f.price(tdis, 2));
            dx.find('td c').text(f.chineseNumber(tamount));
            frames['ptso'].print();
        });
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("status = 'r_r'");

        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#')));
        c.push(dom.td(f.date(a[2])));
        c.push(dom.td(a[7] + '[' + a[3] + ']'));
        c.push(dom.td(a[4]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        c.push(dom.td(a[10]));
        var stat = '', stat2 = '', stat3 = '';
        if (a[9] == 'cancel') {
            stat = '已取消'
        }
        else {
            stat = a[6] && f.date(a[6]);
            if (a[9] == 'draft' || a[9] == '') {
                stat = '草稿';
                stat3 = '  <li class="" for="ddconfirm"><a href="#"><i class="icon-ok-sign"></i>确认</a></li>' +
              '  <li class="" for="ddcancel"><a href="#"><i class="icon-remove-circle"></i>取消</a></li>';
                stat2 = '  <li class="" for="ddedit"><a href="#"><i class="icon-pencil"></i>修改</a></li>';
            }
        }
        c.push(dom.td(stat));
        var b = [['修改', 'update'], ['查看', 'view']];
        b = (!!a[6]) ? b[1] : b[0];

        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddview"><a href="#"><i class="icon-file"></i>查看</a></li>' + stat2 +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '  <li class="divider"></li> ' + stat3 +
              '</ul></td>';
        c.push(dd);
        o.data[a[0]] = a;
        //var btn = "<input value=" + b[0] + " type=button class=" + b[1] + " />";
        //c.push(dom.td(btn));

        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.updateStatus = updateStatus;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.soReturnUpd = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoReturnUpd', inputs: [], status: { cancel: '取消', confirm: '已确认', draft: '草稿'} }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () {
                agent.soProductQuery.show(selectedProduct, o.partner.attr('data-id'),ur.user().id);
                //o.dv.modal('hide');
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_so_ru_partner').next().click(function () {
                agent.partnerMemberLov.show(fillPartner, o.partner.val(),ur.user().id, 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '')
            });

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                //if ($(this).hasClass('number')) {
                //    changeNumber(this); 
                //}
                $(this).parents('tr').addClass('dirty');
                pressEnter(this);
                //return false;
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_so_ru_total');
        }
    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = null; b = a[i]; i++) {
            var td = [];
            //if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b.productName));
            td.push(dom.td(b.maxQty, 'class="number" ' + ctb));
            td.push(dom.td(b.maxPrice, 'class="number" ' + ctb));
            td.push(dom.td('/' + b.uom));
            td.push(dom.td(b.maxQty * b.maxPrice));
            td.push(dom.td(b.orderNum));
            td.push(dom.td('', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            attr = 'data-maxQty="' + b.maxQty + '" data-maxPrice="' + b.maxPrice + '" data-fromId="' + b.lineId + '" data-prod-id="' + b.productId + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(4).attr('data-value', 'confirm');
        submit(function (id) {
            agent.so.updateStatus(id, 'confirm');
            o.show(id);
        });
    },
    cancelOrder = function () {
        o.inputs.eq(4).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
        else if (obj.hasClass('clear')) {
            clear();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            var tr= $(obj).parents('tr');
            if ($(obj).index() == 1) {
                if (parseFloat($(obj).text()) >parseFloat(tr.attr('data-maxqty'))) {
                    $(obj).text(tr.attr('data-maxqty')).focus();
                    gtips.showNotice('不能大于订单的数量');
                    return;
                }
            }
            else if ($(obj).index() == 2) {
                if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxprice'))) {
                    $(obj).text(tr.attr('data-maxprice')).focus();
                    gtips.showNotice('不能大于订单上面的单价');
                    return;
                }
            }
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        tds.eq(4).text(parseFloat(price) * parseInt(num));
        total();
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            t += parseFloat($(this).find('td:eq(4)').text() || 0);
        });
        o.total.val(f.price(t, 2));
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoReturnHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoReturnLine', lines, function () {
                    success(v);
                })
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_so_ru_total,#q_so_ru_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(3).val(a[4]);
        o.inputs.eq(4).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        if (a[11] == 'cancel' || a[11] == 'confirm') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8])
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[4] * -1 || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            //td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2] * b[4] * (parseFloat(b[5] || 0 - 100)) / 100, 'class="number"'));
            td.push(dom.td(b[10] || ''));
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_member_getSoReturnHead', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[MRT' + a[0] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getSoLine', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(uid);
        if (!o.inputs.eq(1).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(o.inputs.eq(1).attr('data-id'));
        head.push(o.inputs.eq(2).val()); //order date
        head.push(o.inputs.eq(4).val()); //amount
        head.push(o.inputs.eq(3).val()); //reason
        head.push(o.dv.find('.modal-footer textarea').text() || '');
        head.push(o.inputs.eq(5).attr('data-value') || 'draft');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push('-' + tds.eq(1).text()); //qty
                line.push(tds.eq(2).text()); //price
                //line.push(tds.eq(4).text()); //discount
                line.push(obj.attr('data-fromId')); //src line id
                line.push(tds.eq(6).text()); //comment
                line.push(uid);
                lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(5).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.soReturn.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.soExchange = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.soExchangeHead_v',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,rname",
        dvId: 'dvSoExchange'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.soExchangeUpd.show();
            });

            gf.noPagination('up_member_getReturnReasonForCmb', [ur.user().agentId], function (a) {
                var b = [];
                for (var i = 0, c = []; c = a[i]; i++) {
                    if (c[3]) {
                        b.push(c);
                    }
                }
                gOption.foption($('.cmbReturnReason').eq(3), b);
                gOption.foption($('.cmbReturnReason').eq(2), a, -1, ['', '']);
            });

            o.tbl.find('tbody tr a').live('click', function () {
                agent.soExchangeUpd.show($(this).parents('tr').attr('data-id'));
            });
        }
    },
    updateStatus = function (id, status) {
        gf.callProc_with_value('up_agent_updateSoStatus', [id, status, ur.user().id], function () {
            o.search();
        })
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddview':
                agent.soExchangeUpd.show(id, 'view');
                break;
            case 'ddedit':
                agent.soExchangeUpd.show(id, 'edit');
                break;
            case 'ddconfirm':
                updateStatus(id, 'confirm');
                break;
            case 'ddcancel':
                updateStatus(id, 'cancel');
                break;
        }
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    o.printSo = function (id) {
        var doc = $(frames['ptsoExchange'].document).find('div');
        doc.find('table:visible').remove();
        var tbl = doc.find('table').clone();
        tbl.show().appendTo(doc);
        var trs = tbl.find('tbody tr'),
            title = trs.eq(0),
            header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
            comment = trs.eq(4), linein = trs.eq(7), lineout = trs.eq(10), xjin = trs.eq(8), 
            xjout = trs.eq(11), hj = trs.eq(12), dx = trs.eq(13), a = o.data[id];

        title.find('td').text(ur.user().coName);
        date.find('td c').eq(1).text(f.date(a[2])).end().eq(0).text(a[1]);
        customer.find('td c').eq(0).text(a[3]).end().eq(1).text(a[7]);
        comment.find('td c').text(a[8]), tqty = 0, tqtyin = 0, tqtyout = 0, tamount = 0, tamountin = 0, tamountout = 0, tdis = 0;

        gf.noPagination('up_member_getSoLine', [id], function (a) {
            var tds = [], ain = [], aout = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                if (b[4] < 0) {
                    ain.push(b);
                }
                else {
                    aout.push(b);
                }
            }
            for (var i = 0, b = []; b = ain[i]; i++) {
                if (i == 0) {
                    tds = linein.find('td');
                }
                else {
                    var cl = linein.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4] * -1); //qty
                tqtyin += b[4]*-1;
                tds.eq(6).text(f.price(b[2] * b[4] * -1, 2)); //amount
                tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (b[5] - 100) / 100, 2)); //折后
                tamountin += b[2] * b[4] * (b[5] - 100) / 100;
            }
            for (var i = 0, b = []; b = aout[i]; i++) {
                if (i == 0) {
                    tds = lineout.find('td');
                }
                else {
                    var cl = lineout.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4]); //qty
                tqtyout += b[4];
                tds.eq(6).text(f.price(b[2] * b[4], 2)); //amount
                tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (100 - b[5]) / 100, 2)); //折后
                tamountout += b[2] * b[4] * (100 - b[5]) / 100;
            }
            tamount = tamountout - tamountin;
            xjin.find('td').eq(1).text(tqtyin).end().eq(3).text(f.price(tamountin, 2));
            xjout.find('td').eq(1).text(tqtyout).end().eq(3).text(f.price(tamountout, 2));
            hj.find('td c').eq(0).text(tqtyin + tqtyout).end().eq(1).text(f.price(tamount, 2)).end().eq(2).text(f.price(tdis, 2));
            dx.find('td c').text(f.chineseNumber(tamount));
            frames['ptsoExchange'].print();
        });
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("status = 'r_r'");

        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#')));
        c.push(dom.td(f.date(a[2])));
        c.push(dom.td(a[7] + '[' + a[3] + ']'));
        c.push(dom.td(a[4]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        c.push(dom.td(a[10]));
        var stat = '', stat2 = '', stat3 = '';
        if (a[9] == 'cancel') {
            stat = '已取消'
        }
        else {
            stat = a[6] && f.date(a[6]);
            if (a[9] == 'draft' || a[9] == '') {
                stat = '草稿';
                stat3 = '  <li class="" for="ddconfirm"><a href="#"><i class="icon-ok-sign"></i>确认</a></li>' +
              '  <li class="" for="ddcancel"><a href="#"><i class="icon-remove-circle"></i>取消</a></li>';
                stat2 = '  <li class="" for="ddedit"><a href="#"><i class="icon-pencil"></i>修改</a></li>';
            }
        }
        c.push(dom.td(stat));
        var b = [['修改', 'update'], ['查看', 'view']];
        b = (!!a[6]) ? b[1] : b[0];

        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddview"><a href="#"><i class="icon-file"></i>查看</a></li>' + stat2 +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '  <li class="divider"></li> ' + stat3 +
              '</ul></td>';
        c.push(dd);
        o.data[a[0]] = a;
        //var btn = "<input value=" + b[0] + " type=button class=" + b[1] + " />";
        //c.push(dom.td(btn));

        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.updateStatus = updateStatus;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.soExchangeUpd = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoExchangeUpd', inputs: [], status: { cancel: '取消', confirm: '已确认', draft: '草稿'} }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').eq(1).click(function () {
                agent.productLovMutil.show(selectedProduct, 'ag');
                o.dv.modal('hide');
            }).end().eq(0).click(function () {
                agent.soProductQuery.show(selectedProductR, o.partner.attr('data-id'),ur.user().id);
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_so_ec_partner').next().click(function () {
                agent.partnerMemberLov.show(fillPartner, o.partner.val(), 'customer');
                //agent.partnerLov.show(fillPartner, 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '');
            });

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                //if ($(this).hasClass('number')) {
                //    changeNumber(this); 
                //}
                $(this).parents('tr').addClass('dirty');
                pressEnter(this);
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_so_ec_total');
        }
    },
    selectedProductR = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(5).attr('data-value') == 'cancel' || o.inputs.eq(5).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = null; b = a[i]; i++) {
            var td = [];
            //if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b.productName));
            td.push(dom.td(b.maxQty, 'class="number" ' + ctb));
            td.push(dom.td(b.maxPrice, 'class="number" ' + ctb));
            td.push(dom.td('/' + b.uom));
            //td.push(dom.td(''));
            td.push(dom.td(b.maxQty * b.maxPrice));
            td.push(dom.td(b.orderNum));
            td.push(dom.td('', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            attr = 'data-maxQty="' + b.maxQty + '" data-maxPrice="' + b.maxPrice + '" data-fromId="' + b.lineId + '" data-prod-id="' + b.productId + '" data-pre="-1"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').eq(0).append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody:eq(1) tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td('1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            //td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(o.discount || b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2] * (100 - (o.discount || 0)) / 100, 'class="number"'));
            td.push(dom.td(b[6] || '', ctb));

            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"  data-pre="1"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').eq(1).append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(5).attr('data-value', 'confirm');
        submit(function (id) {
            agent.so.updateStatus(id, 'confirm');
            o.show(id);
        });
    },
    cancelOrder = function () {
        o.inputs.eq(5).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
        else if (obj.hasClass('clear')) {
            clear();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            var tr = $(obj).parents('tr');
            if (tr.attr('data-pre') < 0) {
                if ($(obj).index() == 1) {
                    if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxqty'))) {
                        $(obj).text(tr.attr('data-maxqty')).focus();
                        gtips.showNotice('不能大于订单的数量');
                        return;
                    }
                }
                else if ($(obj).index() == 2) {
                    if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxprice'))) {
                        $(obj).text(tr.attr('data-maxprice')).focus();
                        gtips.showNotice('不能大于订单上面的单价');
                        return;
                    }
                }
            }
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tr = $(obj).parents('tr'), tds = tr.find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        if (tr.attr('data-pre') < 0) {
            tds.eq(4).text(parseFloat(price) * parseInt(num));
        }
        else {
            tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
        }
        total();
    },
    totalSub = function () {
        var t = 0;
        o.tbl.each(function () {
            t = 0;
            $(this).find('tbody tr:not(.hide)').each(function () {
                if ($(this).attr('data-pre') > 0) {
                    t += parseFloat($(this).find('td:eq(5)').text() || 0);
                }
                else
                    t += parseFloat($(this).find('td:eq(4)').text() || 0);
            });
            $(this).prev().find('div').eq(1).text(f.price(t, 2));
        });
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            if ($(this).attr('data-pre') > 0) {
                t += parseFloat($(this).find('td:eq(5)').text() || 0) * $(this).attr('data-pre');
            }
            else
                t += parseFloat($(this).find('td:eq(4)').text() || 0) * $(this).attr('data-pre');
        });
        o.total.val(f.price(t, 2));
        totalSub();
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoExchangeHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoExchangeLine', lines, function () {
                    success(v);
                })
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_so_ec_total,#q_so_ec_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(3).val(a[4]);
        o.inputs.eq(4).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        if (a[11] == 'cancel' || a[11] == 'confirm') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8])
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr1 = [], tr2 = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            var pre = 1;
            if (b[4] < 0) {
                pre = -1;
            }
            td.push(dom.td(b[4] * pre || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            if (pre > 0) {
                td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            }
            td.push(dom.td(b[2] * b[4] * pre * (100 - parseFloat(b[5])) / 100, 'class="number"'));
            if (pre < 0) {
                td.push(dom.td(b[10]));
            }
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            if (pre < 0) {
                attr += ' data-pre="-1"'
                tr1.push(dom.tr(td.join(''), attr));
            }
            else {
                attr += ' data-pre="1"'
                tr2.push(dom.tr(td.join(''), attr));
            }
        }
        o.tbl.find('tbody').eq(0).append(tr1.join('')).end().eq(1).append(tr2.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_member_getSoExchangeHead', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[MEC' + a[0] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getSoLine', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(uid);
        if (!o.inputs.eq(1).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(o.inputs.eq(1).attr('data-id'));
        head.push(o.inputs.eq(2).val()); //order date
        head.push(o.inputs.eq(4).val()); //amount
        head.push(o.inputs.eq(3).val()); //reason
        head.push(o.dv.find('.modal-footer textarea').text() || '');
        head.push(o.inputs.eq(5).attr('data-value') || 'draft');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0), pre = obj.attr('data-pre');
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push(tds.eq(1).text() * pre); //qty
                line.push(tds.eq(2).text()); //price
                if (pre < 0)
                    line.push(0);
                else
                    line.push(tds.eq(4).text() || 0); //discount
                line.push(obj.attr('data-fromId') || 'null'); //from
                line.push(tds.eq(6).text()); //comment
                line.push(uid);
                lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(5).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.soExchange.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.soProductQuery = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvSoProductQuery', inputs: [] }), callback = null,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //            o.dv.find('.modal-footer .btn-success').click(function () {
            //                if (callback) {
            //                    selectedProduct();
            //                }
            //            });
        }
    },
    where = function () {
        return '1=1';
    },
    search = function () {
        gf.query('agent.base.soProductQuery', [o.memberId,o.saleId, where()], function (a) {
            var c = [], d = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                c = [];
                c.push(dom.td('<input type="checkbox" />'));
                c.push(dom.td(b[0]));
                //c.push(dom.td(b[1]));
                c.push(dom.td(f.date(b[5])));
                c.push(dom.td(b[2]));
                c.push(dom.td(b[3])); //qty
                c.push(dom.td(b[8] + "/" + '<small>' + b[10] + '</small>')); //price
                c.push(dom.td(b[4]));
                d.push(dom.tr(c.join(''), 'data-productId="' + b[7] + '" data-lineId="' + b[6] +
                                     '" data-price="' + b[8] + '" data-uomId="' + b[9] + '" data-uom="' + b[10] + '"'));
            }
            o.dv.find('tbody').html(d.join(''));
        });
    };
    o.saveClose = function () {
        var a = [];
        o.dv.find('tbody tr:has(:checked)').each(function () {
            var p = {}, tr = $(this), tds = tr.find('td');
            p.productId = tr.attr('data-productId');
            p.lineId = tr.attr('data-lineId');
            p.maxQty = tds.eq(4).text();
            p.maxPrice = tr.attr('data-price');
            p.uom = tr.attr('data-uom');
            p.uomId = tr.attr('data-uomId');
            p.orderNum = tds.eq(1).text();
            p.productName = tds.eq(3).text();
            a.push(p);
        });
        if (callback) {
            callback(a);
            o.dv.modal('hide');
        }
    };
    o.show = function (callbk, memberId, saleId) {
        ini();
        if (!memberId || !saleId) {
            gtips.showNotice('请先选择业务伙伴！');
        }
        o.memberId = memberId || 0;
        o.saleId = saleId;
        callback = callbk;
        search();
        o.dv.modal({ backdrop: false });
    };
    return o;
})()

agent.giftdelSta = (function () {
    var o = $.extend({}, _cmbAddress, gobj, gpagination, {
        id: '',
        agentId: '',
        fields: 'ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo,aname',
        ttbl: "member.giftDelivery_v4",
        fileNamePrefix: 'memberlist', // 文件名前缀
        toexcel_fields: 'ID,memberNo,name,companyName,address,mobile,IdCardNo,memberDate,gender',
        dvUpdate: null,
        dvId: 'dvGiftDelSta'
    }),
    ini = function () {
        if (!o.dv) {
            var om = o;
            o.preIni();
            //o.dv = $('#dvMembers');
            o.dvUpdate = $('#dvUpdateMember');
            o.cmbAddress = o.dvUpdate.find('.address select');
            o.dvUpdate.find('.icon_close').click(function () { om.dvUpdate.fadeOut(); });
            o.oTbl = o.dv.find('table');
            //            o.bttnSearch = o.dv.find('.vehicle_search [name=query]').click(function () {
            //                o.search();
            //            });

            o.dvUpdate.find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(om.id);
                a.push(om.parentId);
                a.push(om.cmbAddress.eq(2).val());
                var btn = $(this).val('正在添加');
                om.dvUpdate.find('.content table td :text').each(function () {
                    a.push($(this).val());
                });

                gf.callProc('', a, function () {
                    gtips.showNotice('添加完毕!');
                    btn.val('确定保存');
                    om.dvUpdate.fadeOut();
                });
            });
            //this.ini_after();
            //this.iniChilrenAgent();

            //this.iniToExcel();
        }
    },
    show = function (obj, parentName, parentId, id) {
        this.iniAddr();
        var o = this.dvUpdate.find('table td');
        o.eq(0).text(parentName);
        gf.show(obj, this.dvUpdate, { x: 'center', y: 'center' });
        this.id = '';
        this.parentId = parentId;
        if (id) { // 修改
            this.id = id;
        }
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(a[1])); //姓名
        //c.push(td(a[3])); //身份证
        c.push(dom.td(a[3].substr(0, a[3].length - 4) + '****'));
        c.push(dom.td(a[4])); //手机
        c.push(dom.td(a[5])); //地址
        c.push(dom.td(a[6])); //礼物
        c.push(dom.td(f.date(a[7]))); //日期
        c.push(dom.td(a[10])); //礼物
        return dom.tr(c.join(""), '_id="' + a[0] + '"');
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push("agentId!=r_r");
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        aF.push("IdCardNo like 'r_r%'");
        aF.push("mobile like 'r_r%'");
        aF.push("marketingId = r_r");
        a.push('372');
        a.push(ur.user().code);
        this.dv.find('.well').find(':text,select').each(function () {
            a.push($(this).val());
        });
        return f.getWhere_root(aF, a);
    };
    base.iniFunc[o.dvId] = { fun: ini };
})();

agent.brand = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvBrand', ttbl: 'stock.brand_v', fields: 'id,code,name,status,[desc]' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.brandUpd.show();
            });
            o.tbl.find('tbody a').live('click', function () {
                agent.brandUpd.show($(this).attr('data-id'));
            })
        }
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        a[0] = ur.user().agentId;
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#', 'data-id="' + a[0] + '"'))); //编号
        c.push(dom.td(a[2])); //名称
        c.push(dom.td(a[3] ? '有效' : '无效')); //状态
        c.push(dom.td(a[4])); //描述
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.brandUpd = (function () {
    var o = $.extend({}, gobj, base.form, { dvId: 'dvBrandUpd', updProc: 'up_stock_updateBrand',
        queryProc: 'up_member_getBrand1', parent: agent.brand
    });
    o.queryH= function () {
        var o = this;
        gf.getOneLine(this.queryProc, [o.id,ur.user().agentId], function (a) {
            o.fields.each(function (i) {
                if ($(this)[0].type == "checkbox") {
                    if (a[i] > 0)
                        $(this).attr('checked', 'checked');
                }
                else {
                    $(this).val(a[i]);
                }
            });
        })
    };
    selectedItem = function (item) {
        o.partner.val(item.code + ' ' + item.name).attr('data-id',item.id);
    }
    o.iniPost = function () {
        o.partner = o.dv.find('.btnVendor').click(function () {
            agent.partnerLov.show(selectedItem, $(this).prev().val(), 'vendor');
        }).prev();
    };
    return o;
})();

agent.purchasOrder = (function () {
    //var o = $.extend({}, gobj, { dvId: 'dvPurchasOrder' }),
    var o = $.extend({}, gobj, gpagination, { ttbl: 'member.poHead_v',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,acode,per,srcOrderNum",
        dvId: 'dvPurchasOrder'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //o.dv = $('#dvPurchasOrder');
            o.oTbl = o.dv.find('.report-results>table');
            o.dv.find('.vehicle_search button[name=query]').click(function () {
                o.search();
            });
            o.dv.find('.vehicle_search button[name=add]').click(function () {
                agent.purchasOrderUpd.show('', 'create');
            });
            o.oTbl.find('tbody tr a').live('click', function () {
                agent.purchasOrderUpd.show($(this).parents('tr').attr('data-id'));
            })
        }
    };
    o.fdata = function (a) {
        var c = [], cd = '';
        //c.push(td('MSO' + a[0]));
        c.push(dom.td('<a href="#">' + a[1] + '</a>'));
        c.push(dom.td(f.date(a[2]))); //日期
        //c.push(dom.td(f.price(a[3], 2), 'class="number"'));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        c.push(dom.td(a[7] + '[' + a[4] + ']')); //供货方
        if (a[9] == 'cancel') {
            cd = '已取消';
        }
        else {
            cd = a[6] ? f.date(a[6]) : '草稿';
        }
        c.push(dom.td(cd));
        c.push(dom.td('<div class="progress progress-striped active"><div class="bar" style="width: ' + (parseFloat(a[11]) * 100 || 0) + '%"></div></div>'));
        c.push(dom.td(a[12]));
        c.push(dom.td(''));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("srcOrderNum ='r_r'");
        aF.push("status = 'r_r'");

        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        a.push(inputs.eq(5).val());
        return f.getWhere_root(aF, a);
    };
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

base.poUpd = {
    partner: null,
    getReason: function (agentId) {
        var o = this;
        if (!o.dv.find('.cmbReturnReason')) return;
        gf.noPagination('up_member_getReturnReasonForCmb', [agentId], function (a) {
            var b = [];
            for (var i = 0, c = []; c = a[i]; i++) {
                if (c[3]) {
                    b.push(c);
                }
            }
            gOption.foption(o.dv.find('.cmbReturnReason'), b);
        });
    },
    getVendor: function () { //获取默认供应商
        var o = this;
        gf.getOneLine('up_pos_getDefaultVendor', [ur.user().agentId], function (a) {
            o.partner.val(a[1] + ' ' + a[2]).attr({ 'data-id': a[0], 'data-code': a[1], 'data-name': a[2], 'data-aid': a[3] });
            o.getReason(a[0]);
        });
    }
};

agent.purchasOrderUpd = (function () {
    var o = $.extend({}, gobj, base.poUpd, { dvId: 'dvPoUpd', inputs: [], status: { cancel: '取消', confirm: '已确认', draft: '草稿'} }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () {
                agent.productLovMutil.show(selectedProduct, 'ag', o.partner.attr('data-aid'));
                o.dv.modal('hide');
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_po_vendor').next().click(function () {
                agent.partnerLov.show(fillPartner, 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '')
            });

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                if ($(this).hasClass('number')) { changeNumber(this); }
                $(this).parents('tr').addClass('dirty');
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input');
            o.total = o.dv.find('#q_po_total');

            o.getVendor();
        }
    },
    //    getVendor = function () { //获取默认供应商
    //        gf.getOneLine('up_pos_getDefaultVendor', [ur.user().agentId], function (a) {
    //            o.partner.val(a[1] + ' ' + a[2]).attr('data-id', a[0]);
    //        });
    //    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb1 = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        ctb = '';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td('1', 'class="number" ' + ctb1));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td(b[6] || '', ctb1));

            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(4).attr('data-value', 'confirm');
        submit();
    },
    cancelOrder = function () {
        o.inputs.eq(4).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
        total();
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            t += parseFloat($(this).find('td:eq(5)').text() || 0);
        });
        o.total.val(t);
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoLine', lines, function () {
                    success();
                })
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_po_total,#q_po_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(3).val(a[4]);
        o.inputs.eq(4).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        if (a[11] == 'cancel' || a[11] == 'confirm') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8])
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr = [];
        o.dv.modal('show');
        var ctb1 = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        var ctb = '';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb1 = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[4] || '1', 'class="number" ' + ctb1));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td(b[6] || '', ctb1));

            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id) {
        gf.getOneLine('up_member_getPoHead', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text('修改').end().find('small').text('[MSO' + a[0] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getPoLine', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        if (!o.inputs.eq(1).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(o.inputs.eq(1).attr('data-id'));
        head.push(uid);
        head.push(o.inputs.eq(2).val());
        head.push(o.inputs.eq(3).val());
        head.push(o.dv.find('.modal-footer textarea').text() || '');
        head.push(o.inputs.eq(4).attr('data-value') || 'draft');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push(tds.eq(1).text()); //qty
                line.push(tds.eq(2).text()); //price
                line.push(tds.eq(4).text()); //discount
                line.push(tds.eq(6).text()); //comment
                line.push(uid);
                lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.eq(3).val('').end().eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(4).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
    };
    o.show = function (id) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.po.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()

agent.soExport = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvSoExport', ttbl: 'soHeadLine_v',af:[],av:[] }), ROW_FLUID = 12,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            gf.noPagination('up_base_getTableColumn1', [o.ttbl], function (a) {
                var qMain = 0, qa = [], d = [], ea = [], e = [], da = [], fields = [], pk = [];
                for (var i = 0, b = []; b = a[i]; i++) {
                    if (b[9] == 1) {
                        if (b[11] == 1) {
                            qMain++;
                            if (b[4].indexOf('date') >= 0) {
                                qMain++;
                            }
                        }
                        qa.push(b);
                    }
                    if (b[10] == 1) {
                        ea.push(b);
                    }
                    if (b[12] == 1) {
                        if (b[13] == 1) {
                            da.push(b);
                        }
                    }
                    if (b[8] == 1) {
                        pk = b;
                    }
                    if (b[14] == 1) {
                        o.setSort(b[3], b[15] ? 'desc' : 'asc');
                    }
                    if (b[16] == 1) {
                        o.af.push(b[3] + '=' + 'r_r');
                        o.av.push(ur.user().agentId);
                    }
                    if (b[17] == 1) {
                        o.af.push(b[3] + '=' + 'r_r');
                        o.av.push(ur.user().id);
                    }
                }

                fields.push(pk[3]);

                for (var i = 0, b = []; b = qa[i]; i++) {//查询列
                    var len = parseInt(ROW_FLUID / qMain), id = 'q' + (new Date).getTime() + i,
                        lb = dom.lbl(id, b[5]), txt = dom.txt(id, b[6]);
                    if (b[4].indexOf('date') >= 0) {
                        lb = dom.lbl(id, b[5] + '起'), txt = dom.txt(id, b[6] + '起');
                        d.push(dom.dv(lb + txt, 'span' + len + ' date', 'data-column="' + b[3] + '" data-operator=">="'));
                        lb = dom.lbl(id + 1, b[5] + '止'), txt = dom.txt(id + 1, b[6] + '止');
                        d.push(dom.dv(lb + txt, 'span' + len + ' date', 'data-column="' + b[3] + '" data-operator="<"'));
                    }
                    else {
                        d.push(dom.dv(lb + txt, 'span' + len, 'data-column="' + b[3] + '" data-operator="="'));
                    }
                } //查询列
                for (var i = 0, b = []; b = ea[i]; i++) {//导出列
                    var id = 'e' + (new Date).getTime() + i,
                        lb = dom.lbl(id, b[5]), chb = dom.chb(id, b[6],'c');
                    e.push(dom.dv(lb + chb, 'span2', 'data-column="' + b[3] + '" data-type="' + b[4] + '"'));
                } //导出列
                o.dv.find('.vehicle_search .row-fluid').eq(0).html(d.join('')).end().eq(1).html(e.join(''));
                mDate.iniDvDate(o.dv);

                for (var i = 0, b = [], d = []; b = da[i]; i++) {//显示列
                    var id = 'e' + (new Date).getTime() + i,
                        th = dom.th(dom.a(b[5], '#'), 'class="sort_link"');
                    d.push(th);
                    fields.push(b[3]);
                } //显示列
                o.dv.find('.report-results thead tr').html(d.join(''));

                o.queryColumn = qa;
                o.displayColunm = da;
                o.exportColumn = ea;
                o.fields = fields.join(',');
            });
        }
    };
    o.fdata = function (a) {
        var c = [];
        for (var i = 0, b = []; b = o.displayColunm[i]; i++) {
            var v = a[i + 1];
            if (b[4].indexOf('date') >= 0) {
                v = f.date(v);
            }
            else if (b[4] == 'money') {
                v = f.priceLabel(v);
            }
            c.push(dom.td(v));
        }
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    }
    o.where = function () {
        var af = o.af||[], a = o.av||[];
        o.dv.find('.vehicle_search .row-fluid').eq(0).find('div').each(function () {
            af.push($(this).attr('data-column') + $(this).attr('data-operator') + "'r_r'");
            a.push($(this).find('input,select').val());
        })
        return f.getWhere_root(af, a);
    };
    o.excelEncode = function (a) {
        var b = [], c = [];
        for (var i = 0, l = a.length; i < l; i++) {
            c = [];
            for (var j = 0, m = a[i].length; j < m; j++) {
                var v = a[i][j];
                if (o.exportType[j].indexOf('date') >= 0 && i != 0) {
                    v = f.date(v);
                }
                c.push(dom.td(v));
            }
            b.push(dom.tr(c.join('')));
        }
        var data = b.join("");
        if (a.length) {
            window.location = 'data:application/vnd.ms-excel, ' + '<table>' + encodeURIComponent(data) + '</table>';
        }
    }
    o.excel = function (obj) {
        var fields = [], title = [];
        o.exportType = [];
        o.dv.find('.vehicle_search .row-fluid').eq(1).find('div:has(:checkbox:checked)').each(function () {
            fields.push($(this).attr('data-column'));
            title.push($(this).find('label').text());
            o.exportType.push($(this).attr('data-type'));
        })
        if (!fields.length) return;
        gf.noPagination('up_base_exportExcel', [o.excelSize, o.ttbl, fields.join(','), 'id desc', o.where()], function (a) {
            a = [title].concat(a);
            o.excelEncode(a);
        });
    };
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    return o;
})()

agent.poForErp = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPoForErp' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //o.dv = $('#dvPurchasOrder');
            o.oTbl = o.dv.find('.report-results>table');
            // o.dv.find('.vehicle_search button[name=query]').click(function () { pgSearch(); });
            o.dv.find('.vehicle_search button[name=add]').click(function () {
                agent.poUpdForErp.show('', 'create');
            });
            o.oTbl.find('tbody tr a').live('click', function () {
                agent.poUpdForErp.show($(this).parents('tr').attr('data-id'));
            });
        }
    },
    pgSearch = function () {
        var t = [];
        pgf.codeTableData('agent.so.query', [ur.user().erpID, where(), o.pager.val()], function (a) {
            for (var i = 0, l = a.length; i < l; i++) {
                t.push(fdata(a[i]));
            }
            //o.dv.find('.page-header .fr').find('c').html(a.length).end().find('d').html(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
            o.searchend(a.length);
            if (t.length)
                o.oTbl.find('tbody').html(t.join(''));
            else
                o.oTbl.find('tbody').html('查询无记录');
        });
    },
    fdata = function (a) {
        var c = [], cd = '';
        //c.push(td('MSO' + a[0]));
        c.push(dom.td('<a href="#">' + a[1] + '</a>'));
        c.push(dom.td(a[10]));
        c.push(dom.td(f.date(a[2])));
        //c.push(dom.td(f.price(a[3], 2), 'class="number"'));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[3], 2) + '</label>'));
        c.push(dom.td(a[6]));
        if (a[9] == 'cancel') {
            cd = '已取消';
        }
        else {
            cd = a[4] ? f.date(a[4]) : '';
        }
        c.push(dom.td(cd));
        c.push(dom.td('<div class="progress progress-striped active"><div class="bar" style="width: ' + (parseFloat(a[5]) * 100 || 0) + '%"></div></div>'));
        c.push(dom.td(''));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    },
    where = function () {
        var a = [], aF = [];
        aF.push("so.name like '%r_r%'")
        aF.push("so.date_order>='r_r'");
        aF.push("so.date_order<='r_r'");
        //aF.push("storeId=r_r");
        var t = o.dvSp.find('input,select');
        a.push(t.eq(1).val());
        a.push(t.eq(2).val());
        a.push(t.eq(3).val());
        //if (!ur.isFirst()) a.push(ur.user().agentId);
        //else a.push('');
        return f.getWhere_root(aF, a);
    };
    o.search = pgSearch;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.poUpdForErp = (function () {
    var o = $.extend({}, gobj, { dv: null, status: 'create', dvId: 'dvPOUpdForErp' }), S_MD = 'normal', callback = null,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () {
                agent.productLovMutil.show(fillProduct);
                o.dv.modal('hide');
            });
            o.tbl = o.dv.find('.report-results table');
            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                if ($(this).hasClass('number')) { changeNumber(this); }
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.cmbAnalytic = o.dv.find('#q_po_anyltic').change(function () {
                changeAnaltic($(this).find(':selected'));
            });
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });
            getAnalytic();
            o.total = o.dv.find('#q_po_total');
            o.oid = o.dv.find('#q_poe_oid');
        }
    },
    saveClose = function (obj) {
        loading(obj);
        var t = $(obj).text();
        $(obj).text('正在提交...');
        submit(function () {
            close(); clear(); agent.poForErp.search(); $(obj).text(t); loadingEnd();
        });
    },
    saveAdd = function (obj) {
        loading(obj);
        var t = $(obj).text();
        $(obj).text('正在提交...');
        submit(function () {
            clear(); $(obj).text(t); loadingEnd();
        });
    },
    loading = function (obj) {
        o.dv.find('.btn,input,select').disable();
        //$(obj).text('正在提交...');
    },
    loadingEnd = function (obj) {
        o.dv.find('.btn,input,select').enable();
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.cmbAnalytic.val('');
        o.dv.find('#q_po_total').val('');
        o.dv.find('textarea').val('');
    },
    changeAnaltic = function (obj) {
        var discount = parseInt($(obj).attr('data-discount') || 0);
        o.tbl.find('tbody tr').each(function () {
            var tds = $(this).find('td');
            tds.eq(4).text(discount);
            tds.eq(5).text(parseInt(tds.eq(1).text()) * parseFloat(tds.eq(2).text()) * (100 - discount) / 100);
        });
        total();
    },
    delTr = function (obj) {
        $(obj).parents('tr').remove();
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
        total();
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr').each(function () {
            t += parseFloat($(this).find('td:eq(5)').text() || 0);
        })
        o.total.val(t);
    }
    fillProduct = function (a) {
        var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, tr = [];
        //o.dv.modal('backdrop');
        o.dv.modal('show');
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            discount = b[8] || discount;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[7] || '1', 'class="number" contenteditable="true"'));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            if (ur.user().isVip == "True" || ur.user().isVip === true) {
                td.push(dom.td(discount, 'class="number" contenteditable="true"'));
            }
            else {
                td.push(dom.td(discount, 'class="number"'));
            }
            td.push(dom.td(b[2] * (100 - discount) / 100, 'class="number"'));
            td.push(dom.td(b[9] || '', 'contenteditable="true"'));
            td.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
            tr.push(dom.tr(td.join(''), 'data-prod-id="' + b[0] + '"'));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    submit = function (submitEnd) {
        var head = [], lines = [], om = this, uid = ur.user().id;
        head.push(ur.user().erpID || ur.user().agentId);
        head.push(o.total.val() || 0);
        head.push(o.dv.find('.modal-footer textarea').val());
        head.push(o.cmbAnalytic.val() || 'null');
        head.push(o.oid.val());
        var trs = o.tbl.find('tbody tr'), proc = 'agent.so.head.create';
        if (o.address) {
            head.push(o.address[1]);
            head.push(o.address[4]);
            head.push(o.address[5]);
            head.push(o.address[6]);
            proc = 'agent.so.head.create.hasAddress';
        }
        if (trs.length) {
            pgf.codeData(proc, head, function (a) {
                lines = getLinesF(trs, a);
                pgf.batchUpdate('agent.so.line.create', lines, function () {
                    if (submitEnd) submitEnd();
                    o.address = null;
                    o.ids = null;
                })
            })
        }
    },
    fdataHead = function (a) {
        o.id = a[0];
        o.dv.find('#q_po_vendor').val(a[1] || '上海欧美姿化妆品有限公司');
        o.dv.find('#q_po_date').val(a[2] ? f.date(a[2]) : gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.total.val(a[3] || '');
        o.cmbAnalytic.val(a[4] || '');
        o.oid.val(a[8] || '');
        if (a[6] == 1 || !a[6])
            o.dv.find('.modal-footer textarea').val(a[5]);
        else
            o.dv.find('.modal-footer textarea').val('');
        if (a[7])
            o.dv.find('.modal-header small').eq(0).text('[' + a[7] + ']');
    },
    fdataLine = function (a, discount) {//查看订单时
        var tr = [];
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            //discount = discount || b[5];
            discount = b[5];
            //if (o.tbl.find('tbody tr[data-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td(b[3], 'class="number"'));
            td.push(dom.td('<small>' + b[4] + '</small>'));
            td.push(dom.td(discount, 'class="number"'));
            td.push(dom.td(b[6], 'class="number"'));
            td.push(dom.td(b[7]));
            td.push(dom.td(''));
            tr.push(dom.tr(td.join(''), 'data-id="' + b[0] + '"'));
        }
        o.tbl.find('tbody').html(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));

    },
    viewPo = function (id) {
        pgf.codeData('agent.so.head.query', [id], function (a) {
            fdataHead(a[0]);
        });
        pgf.codeData('agent.so.line.query', [id], function (a) {
            fdataLine(a);
        });
    },
    getSo = function (id) {
        gf.noPagination('up_order_so2poForErpHead', [id, ur.user().agentId, ur.user().id], function (a) {
            if (callback) callback(a[0][0]);
            o.address = a[2];
            if (o.ids.length>0) a[1][8] = o.ids.join(';');
            fdataHead(a[1]);
        })
        o.ids.push(id);
        gf.query('agent.order.so2po.forErpLine', [ur.user().agentId, ur.user().id, o.ids.join(',')], function (a) {
            fillProduct(a);
        });
    }
    getLinesF = function (trs, a) {
        var line = [], lines = [];
        trs.each(function () {
            line = [];
            var tds = $(this).find('td');
            line.push(a[0]);
            line.push($(this).attr('data-prod-id'));
            line.push(tds.eq(1).text());
            line.push(tds.eq(4).text() || 0);
            line.push(tds.eq(2).text());
            line.push(ur.user().id);
            line.push(tds.eq(6).text() || '');
            lines.push(line);
        });
        return lines;
    },
    fillAnalytic = function (a) {
        var content = '<option data-discount="{3}" data-id="{0}" value="{0}">{1}</option>', c = [];
        //c.push(formatStr(content, ['', '', '', '']));
        c.push('<option></option>');
        for (var i = 0, b = []; b = a[i]; i++) {
            //c.push(formatStr(content, b));
            c.push('<option data-discount="' + b[3] + '" data-id="' + b[0] + '" value="' + b[0] + '">' + b[1] + '</option>');
        }
        o.cmbAnalytic.html(c.join(''));
    },
    getAnalytic = function () {
        pgf.codeData('a-analytic', [], function (a) {
            fillAnalytic(a);
        })
    },
    close = function () {
        o.dv.modal('hide');
    };
    o.show = function (id, type, mode, callbk) {
        ini();
        var title = "查看";
        callback = callbk;
        o.mode = mode || S_MD;
        o.dv.modal({ backdrop: 'static' });
        if (id && o.mode == S_MD) {
            viewPo(id);
            loading();
            o.dv.find('.btn').hide();
        }
        else {
            clear();
            if (o.mode != S_MD) {
                getSo(id);
                title = "转换";
            }
            else {
                fdataHead([]);
                title = "增加";
            }
            loadingEnd();
            o.dv.find('.btn').show();
        }
        o.dv.find('.modal-header c').eq(0).text(title);
    };
    o.saveClose = saveClose;
    o.saveAdd = saveAdd;
    return o;
})()

agent.stockInForErp = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvStockInForErp' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody .stin').live('click', function () {
                moveIn($(this).parents('tr'));
            });
            o.dv.find('.page-header f.btn').click(function () {
                batchMoveIn();
            });
            //使用base.checkAll来代替
            o.dv.find('input[name=all]').click(function () {
                if ($(this).attr('checked'))
                    o.tbl.find('tbody input[type=checkbox]').attr('checked', $(this).attr('checked'));
                else
                    o.tbl.find('tbody input[type=checkbox]').removeAttr('checked');
            });
        }
    },
    batchMoveIn = function () {
        var a = [], b = [], c = [];
        o.tbl.find('tbody tr:has(:checked)').each(function () {
            b = JSON.parse(decodeURI($(this).attr('data')));
            a.push(getData($(this), b));
            c.push([ur.user().agentId, b[0], b[4]]);
        });
        console.log(JSON.stringify(a));
        if (a.length > 0) {
            gf.callProcBatch('up_member_stockTran1', a, function () {
                pgf.batchUpdate('confirmStockMove', c, function () {
                    gtips.showNotice('入库成功！');
                    search();
                })
            })
        }
    },
    getData = function (tr, b) {
        var a = [], om = this;
        a.push(b[10]); //物料id
        a.push(b[2]); //单号
        a.push(b[9]); //类别id
        a.push(b[3]); //类别
        a.push(b[4]); //数量
        a.push(b[6]); //单价
        a.push(b[5]); //单位
        a.push(1); //来源
        a.push(ur.user().agentId);
        a.push(ur.user().agentId);
        a.push(ur.user().id);
        a.push('OE');
        a.push(b[11]); //销售订单行id
        a.push(b[0]); //stock move id
        a.push(b[1]); //order number
        a.push(b[16]); //barcode
        a.push(f.date(b[7])); //outDate
        return a;
    }
    moveIn = function (obj) {
        var b = JSON.parse(decodeURI(tr.attr('data'))), a = getData(obj, b);
        gf.callProc_with_value('up_member_stockTran1', a, function () {
            pgf.codeData('confirmStockMove', [ur.user().agentId, b[0], b[4]], function () {
                gtips.showNotice('入库成功！');
                search();
            })
        });
    },
    fdata = function (a) {
        var c = [];
        if (a[15] == 1) {
            c.push(dom.td(a[12] || '', 'rowspan=' + a[14]));
        }
        if (!a[15]) c.push(dom.td(''));
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3]));
        c.push(dom.td(a[4] + '<small>' + a[5] + '</small>'));
        //c.push(dom.td(a[6]));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[7])));
        //c.push(dom.td(f.date(a[8])));
        if (a[15] == 1) {
            if (a[13].indexOf('发货通知') >= 0) {
                c.push(dom.td(a[13] || '', 'style="width: 20%;max-width: 300px;min-width: 150px;" rowspan=' + a[14]));
            }
            else {
                c.push(dom.td('', 'rowspan=' + a[14]));
            }
        }
        if (!a[15]) c.push(dom.td(''));
        var data = encodeURI(JSON.stringify(a));
        c.push(dom.td((!a[8] && a[7]) ? '<a href="#" class="stin">入库</a>' : ''));
        c.push(dom.td('<input type="checkbox" />'));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    },
    search = function () {
        pgf.codeTableData('member.stock.move', [ur.user().erpID, o.pager.val()], function (a) {
            var order = '', tr = [];
            for (var i = 0, l = a.length; i < l; i++) {
                order = a[12];
                tr.push(fdata(a[i]));
            }
            o.tbl.find('tbody').html(tr.join(''));
            o.searchend(a.length);
            //success ? success() : null;
        })
    };
    o.search = search;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.smsSend = (function () {
    var o = $.extend({}, gobj,{ dvId: 'dvSmsSend' }),
        ini = function () {
            if (!o.dv)
            {
                o.preIni();
                o.dv.find('.selUser').click(function () {
                    agent.lov.userForSms.show(function () {

                    });
                }).end().find('.clearUser').click(function () {
                    $('#q_ss_pn').val('');
                });
                base.pkDate.iniDvDate(o.dv,'yyyy-mm-dd hh:ii');
            }
        };
    base.iniFunc[o.dvId] = { fun: ini, obj: o };
    return o;
})()