﻿/// <reference path="jquery-1.8.0.js" />
var Constant = { GET_TOP_OAUTH_URL: 'http://jy.ic361.cn:8080/top/src.jsp'
    , TOP_STOP_SYN_URL: 'http://jy.ic361.cn:8080/top/StopSyn'
    , TOP_DELEVERY_EXPRESS: 'http://jy.ic361.cn:8080/top/DeliveryExpress'
};

var gobj = {
    dv: null, dvSp: null, tbl: null, dvId: null, excelSize: 1000,
    preIni: function () {
        this.dv = $('#' + this.dvId);
        this.dvSp = this.dv.find('.vehicle_search');
        this.tbl = this.dv.find('.report-results>table');
        var om = this;
        this.dvSp.find('button[name=query]').click(function () {
            om.search(0, this);
        }).end().find('button[name=excel]').click(function () {
            om.excel(this);
        });
        this.dv.find('.modal-footer').find('.btn-success').click(function () {
            if (om.saveClose)
                om.saveClose(this);
        }).end().find('.btn-save-add').click(function () {
            if (om.saveAdd)
                om.saveAdd(this);
        });
        this.pager = this.dv.find('.pagination select').change(function () {
            pgSearch();
        });
        if (this.pIni)
            this.pIni();
    },
    excelEncode: function (a) {
        var b = [], c = [];
        for (var i = 0, l = a.length; i < l; i++) {
            c = [];
            for (var j = 0, m = a[i].length; j < m; j++) {
                c.push(dom.td(a[i][j]));
            }
            b.push(dom.tr(c.join('')));
        }
        var data = b.join("");
        if (a.length) {
            //window.location = 'data:text/csv;charset=utf-8;filename=a.csv;base64,' + data;
            //window.location = "data:application/ms-excel;charset=gbk;filename=a.csv;base64," + data;
            window.location = 'data:application/vnd.ms-excel, ' + '<table>' + encodeURIComponent(data) + '</table>';
            //window.open("data:text/csv;filename=a.csv;base64," + data, "a.csv");
        }
    },
    excel: function () { },
    searchend: function (len) {
        var dv = this.dv.find('.page-header .fr');
        if (dv.size() === 0) {
            dv = this.dv.find('.result-header .span7');
        }
        if (this.activeDv) {
            dv = this.activeDv.find('.result-header');
        }
        dv.find('c').html(len).end().find('d').html(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        this.ended();
    },
    ended: function () { }
}

var gpagination = {
    ps: 30, data: {},
    pIni: function () {
        var o = this, pag = o.dv.find('.page-header .pagination');
        o.pPrev = pag.find('.prev').click(function () {
            if (o.pIndex - 1 > 0)
                o.search(o.pIndex - 1);
        });
        o.pNext = pag.find('.next').click(function () {
            if (o.pIndex + 1 <= Math.ceil(o.pPageTotal / o.ps))
                o.search(o.pIndex + 1);
        });
        o.pCur = pag.find('.cur');
    },
    setSort: function (field, dir) {
        this.field = field;
        this.dir = dir;
    },
    sort: function () {
        //this.field = f; // 字段
        var dir = this.dir;
        var field = this.field || 'id';
        if (!dir) dir = 'desc';
        dir = dir.toLowerCase();  //排序方向 asc desc
        return {
            sort_str: function () {
                return field + ' ' + dir;
            },
            turn: function () {// 改变顺序
                dir = dir == 'desc' ? 'asc' : 'desc';
            }
        }
    },
    createPagination: function (pageTotal) {
        var o = this, sty = 'disabled';
        if (this.pIndex == 1) {
            o.pPrev.parent().addClass(sty);
        }
        else {
            o.pPrev.parent().removeClass(sty);
        }
        //if (this.pIndex == Math.ceil(o.pPageTotal / o.ps)) {
        if (this.pIndex >= Math.ceil(o.pPageTotal / o.ps)) {//1114
            o.pNext.parent().addClass(sty);
        }
        else {
            o.pNext.parent().removeClass(sty);
        }
        o.pCur.text(o.pIndex + '/' + Math.ceil(o.pPageTotal / o.ps));
    },
    fillin: function (a) {
        for (var i = 0; i < a.length; i++) a[i] = this.fdata(a[i], i);
        this.tbl.find('tbody').html(a.join(''));
    },
    search: function (pIndex) {
        if (arguments.length < 1) pIndex = 0;
        var om = this;
        this.data = {};
        this.pIndex = pIndex || 1;
        if (om.dv.find('.pagination select').size()) {
            om.ps = om.dv.find('.pagination select').val();
        };
        gf.pagination([this.ttbl, pIndex, this.ps, this.fields, this.sort('id', 'desc').sort_str(), this.where()], function (jsn) {
            gtips.hideAjax();
            $(om.btnSearch).enable();
            var pageTotal = jsn.OutputValue;
            if (pageTotal[0] != -1) {
                om.pPageTotal = pageTotal[0];
                om.dv.find('.page-header .fr g').text(om.pPageTotal);
            }
            om.createPagination(pageTotal);
            var a = jsn.OutputTable;
            if (a.length > 0) {
                om.fillin(a);
            }
            else {
                om.tbl.find('tbody').html('查询无记录！');
            }
            om.searchend(a.length);
        }, {
            isRowNumber: this.isRowNumber,
            conType: om.contype
        })
    }
}

var gOption = {
    config: {
        noneStr: '无选项',
        firstItem: [],
        bufferid: '',
        callback: function () { },
        conType: 1// 数据库连接类型
    },
    option: function (ocmb, procName, aPara, defaultValue, config) {
        var om = this;
        if (!config) config = {};
        $.extend(this.config, config);
        gf.noPagination(procName, aPara, function (a) {
            if (om.config.firstItem.length > 0) a.unshift(om.config.firstItem);
            om.foption(ocmb, a, defaultValue);
            if ($.isFunction(om.config.callback)) { om.config.callback(ocmb); }
        }, config.conType);
    },
    foption: function (ocmb, av, defaultValue, firstItem) {
        var sel = '';
        var b = [];
        var a = av.concat();
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                if ($.isArray(a[i])) {
                    sel = (defaultValue && defaultValue == a[i][0]) ? "selected" : "";
                    if (!defaultValue && i == 0) sel = "selected";
                    b.push('<option value="' + a[i][0] + '" ' + sel + ' >' + a[i][1] + '</option>');
                } else {
                    sel = (defaultValue && defaultValue == a[i]) ? "selected" : "";
                    if (!defaultValue && i == 0) sel = "selected";
                    b.push('<option value="' + i.toString() + '" ' + sel + ' >' + a[i] + '</option>');
                }
            }

            if (firstItem) b.unshift('<option value="' + firstItem[0] + '" >' + firstItem[1] + '</option>');
        } else {
            b[0] = '<option value="" >' + this.config.noneStr + '</option>';
        }
        ocmb.html(b.join(''));
    }
}

base = (function () {
    var o = { iniFun: [], iniFunc: {} };
    $(function () {
        if (ur.user().id) {
            for (var i = 0, b; b = o.iniFun[i]; i++) {
                b();
            }
        }
        else {
            o.logout();
        }
    });
    o.STATIC = {
        ROLE_ADMIN: 0,
        ROLE_MANAGER: 1,
        ROLE_SALER:5,
        ROLE_BUYER: 6,
        ROLE_GIFT: 10,
        ROLE_BUYER_MEMBER: 12,
        ROLE_MEMBER:11,
        LOGIN_PATH: "/shop/my_account.shtml"
    };
    o.memberTypeValue = function () {
        return (ur.config().attributeDefin && ur.config().attributeDefin.MemberType &&
                    ur.config().attributeDefin.MemberType.MemberType.label) || o.STATIC.ROLE_MEMBER;
    };
    o.logout = function () {
        $.cookie("userid", null);
        localStorage.userdetail = '';
        if (window.location.toString().indexOf('login') >= 0 || window.location.toString().indexOf('account') >= 0) {
            return;
        }
        else {
            window.location = o.STATIC.LOGIN_PATH;
            //window.location = "/shop/my_account.shtml"
        }
    }
    return o;
})()

base.form = {
    iniPostH: function () {
        if (this.iniPost)
            this.iniPost();
    },
    ini: function () {
        var o = this;
        if (!o.dv) {
            if (o.preIni)
                o.preIni();
            o.fields = o.dv.find('.modal-body').find('[type=text],[type=number],[type=checkbox],select,textarea');
            o.iniPostH();
        }
    },
    saveClose: function () {
        var o = this;
        this.save(function () {
            o.dv.modal('hide');
            o.parent.search();
        });
    },
    saveAdd: function () {
        var o = this;
        o.save(function () {
            o.clear();
        })
    },
    save: function (success) {
        var a = [this.id || 0, ur.user().agentId, ur.user().id];
        this.fields.each(function () {
            if ($(this)[0].type == "checkbox") {
                a.push($(this).parent().find(':checked').size());
            }
            else {
                if ($(this).attr('data-id')) {
                    a.push($(this).attr('data-id'));
                }
                else {
                    a.push($(this).val());
                }
            }
        });
        gf.getOneLine(this.updProc, a, function () {
            success ? success() : null;
        })
    },
    clearH: function () {
        var o = this;
        o.id = 0;
        o.fields.each(function (i) {
            if ($(this)[0].type == "checkbox") {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).val('');
            }
        });
    },
    clear: function () {
        this.clearH();
    },
    queryH: function () {
        var o = this;
        gf.getOneLine(this.queryProc, [o.id], function (a) {
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
    },
    query: function () {
        this.queryH();
    },
    show: function (id) {
        var o = this;
        o.ini();
        o.dv.modal({});
        var t = '';
        if (id) {
            t = '修改';
            o.id = id;
            o.query();
        }
        else {
            t = '创建';
            o.clear();
        }
        o.dv.find('.modal-header c').html(t);
    }
};

base.headBodyForm = $.extend({}, base.form, { updBodyProc: '',
    iniPostH: function () {
        var o = this;
        o.fields = o.dv.find('.modal-header,.modal-footer').find('[type=text],[type=number],[type=checkbox],select,textarea');
        o.dv.find('[name=query]').click(function () { o.queryItem(); });
        if (o.iniPost) {
            o.iniPost();
        }
        o.tbl.find('tbody tr td .del').live('click', function () {
            o.delTr(this);
            $(this).parents('tr').addClass('dirty');
        });
        o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
            if ($(this).hasClass('number')) { o.changeNumber?o.changeNumber(this):null; }
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
                a.push($(this).val());
            }
        });
        var lines = this.getLines();
        if (lines.length === 0 && !o.id) {
            return;
        }
        gf.getOneLine(this.updProc, a, function (a) {
            for (var i = 0, len = lines.length, v = a[0]; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            gf.callProcBatch(o.updBodyProc, lines, function () {
                success ? success(v) : null;
            })
        })
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
    pressEnter : function (obj) {
        if ($(obj).hasClass('number')) {
            o.changeNumber?o.changeNumber(obj):null;
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    queryBody: function () {
        var o = this;
        gf.noPagination(this.queryBodyProc, [o.id], function (a) {
            var b = [],l=a.length;
            for (var i = 0; i < l; i++) {
                b.push(o.fdata(a[i]));
            }
            o.dv.find('.modal-body table tbody').html(b.join(''));
            o.searchend(l);
        })
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
})

base.query = {
    ini: function () {
        var o = this;
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                o.updObj.show();
            });
            o.tbl.find('tbody a').live('click', function () {
                o.updObj.show($(this).attr('data-id'));
            });
            o.updObj.parent = o;
        }
    }
}

base.lov = {
    dv: null,
    ini: function () {
        var o = this;
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr').live('click', function () {
                if (o.selectedItem)
                    o.selectedItem($(this));
            });
        }
    },
    show: function (callbk, filter, type) {
        var o = this;
        o.ini();
        o.callback = callbk;
        o.getItem(type || '', filter || '', function () {
            o.dv.modal({ backdrop: false });
        });
    },
    getItem: function (type, code, success) {
        var o = this;
        gf.noPagination(o.queryProc, [ur.user().agentId, code || ''], function (a) {
            var li = [];
            for (var i = 0, len = a.length; i < len; i++) {
                li.push(o.fdata(a[i]));
            }
            if (a.length == 1) {
                o.selectedItem($(li[0]));
            }
            else {
                o.tbl.find('tbody').html(li);
                success();
            }
        })
    }
}

base.topBar = (function () {
    var o = {},
    ini = function () {
        if (ur.user().id) {
            $('#topBar').find('.user').html(ur.user().name).end().find('.brand d').html(ur.user().storeName);

        }
        else {
            if (window.location.toString().indexOf('login') >= 0 || window.location.toString().indexOf('account') >= 0) {
                return;
            }
            else {
                window.location = base.STATIC.LOGIN_PATH;
                //window.location = "/shop/my_account.shtml"
            }
        }
    };
    base.iniFun.push(ini);
    return o;
})()

base.menu = (function () {
    var o = { dv: null };
    var ini = function () {
        o.dv = $('#menu-nav');
        if (ur.user().sysUrl && window.location.toString().indexOf('admin') < 0) {
            var ids = {};
            gf.noPagination('up_base_getUserMenu', [ur.user().id], function (a) {
                var c = [];
                for (var b = [], i = 0; b = a[i]; i++) {
                    if (!ids[b[0]]) {
                        ids[b[0]] = b;
                        if (b[2]) {
                            c.push('<li for="' + b[4] + '" data-param="' + encodeURI(b[6]) + '" data-url="' + b[7] +
                                '" data-version="' + b[8] + '">' +
                                '<a href="#"><i class="' + b[5] + '"></i>' + b[1] + '</a></li>');
                        }
                        else {
                            c.push('<li class="nav-header">' + b[1] + '</li>');
                        }
                    }
                }
                c.push('<li for="logout"><a href="#"><i class="icon-off"></i>退出系统</a></li>');
                o.dv.find('ul.nav-list').html(c.join(''));
                $('#menu-nav li a').eq(0).click();
            })
        }
        o.dv.find('li:not(.nav-header)').live('click', function () {
            var obj = this;
            if ($(obj).attr('for')) {
                switch ($(obj).attr('for')) {
                    case 'logout': //退出
                        base.logout();
                        break;
                    case 'username':
                        break;
                    case '23':
                        break;
                    case '24':
                        break;
                }
                $('.dvMain:visible').hide();
                var dvid = $(obj).attr('for');
                function hasDv() {
                    $('#' + dvid).show();
                    if ($(obj).attr('data-param')) {
                        base.iniFunc[dvid].obj.param = JSON.parse(decodeURI($(obj).attr('data-param')));
                    }
                    else {
                        if (base.iniFunc[dvid].obj) base.iniFunc[dvid].obj.param = {};
                    }
                    if (base.iniFunc[dvid]) {
                        base.iniFunc[dvid].fun();
                    }
                    base.pkDate.iniDvDate($('#' + dvid));
                    o.dv.find('.active').removeClass('active');
                    $(obj).addClass('active');
                }
                if ($('#' + dvid).size() > 0) {
                    hasDv();
                }
                else {
                    var url = $(obj).attr('data-url'), version = $(obj).attr('data-version');
                    $.get('/ctl/' + url+'?v='+version, function (html) {
                        $('body >.container-fluid>.row-fluid').append(html);
                        hasDv();
                    })
                }
            }
        });
        $('#menu-nav li.active a').click();
    }
    base.iniFun.push(ini);
})()

String.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm'), s = arguments[i];
        str = str.replace(re, s);
    }
    return str;
}

mDate = (function () {
    var o = { dv: null };
    ini = function () {
        try{
            $('.date :text').datetimepicker({
                language: 'zh-CN', autoclose: true, minView: 2,
                changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd", format: "yyyy-mm-dd"
            });
        } catch (e) {
            $('.date :text').datepicker({
                language: 'zh-CN', autoclose: true, minView: 2,
                changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd", format: "yyyy-mm-dd"
            });
        }
    }
    o.iniDvDate = function (dv, format) {
        try{
            dv.find('.date :text').datetimepicker({
                language: 'zh-CN', autoclose: true, minView: format ? 0 : 2,
                changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd", format: format || "yyyy-mm-dd"
            });
        } catch (e) {
            dv.find('.date :text').datepicker({
                language: 'zh-CN', autoclose: true, minView: format ? 0 : 2,
                changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd", format: format || "yyyy-mm-dd"
            });
        }
    }    
    base.iniFun.push(ini);
    return o;
})()
base.pkDate = mDate;

gf = (function () {
    var o = {},
    pad = function (source, length) {
        var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
        return (negative ? "-" : "") + pre + string;
    };
    o.addDay = function (date, n) {
        var t = n * 1000 * 3600 * 24;
        var d = new Date(date.getTime() + t);
        return d;
    },
    o.dateFormat = function (source, pattern) {//日期格式化 http://tangram.baidu.com/index.html
        //yyyy年MM月dd日 HH时mm分ss秒
        if ('string' != typeof pattern) {
            return source.toString();
        }
        if (typeof source == 'string') source = new Date(source);
        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }
        year = source.getFullYear(),
        month = source.getMonth() + 1,
        date2 = source.getDate(),
        hours = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();
        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(year.toString().slice(2), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);
        return pattern;
    };
    o.log = function (msg) {
        console.log(msg);
    };
    o.percent = function (Molecular, Denominator) {// 以百分数表示
        var rate = '';
        if (Denominator > 0) {
            rate = Math.round(100 * Number(Molecular) / Number(Denominator)).toString() + '%';
        }
        return rate;
    };
    o.ajax = function (par) {
        var onerror = function (msg) {
            gf.log(msg); 
            if (ur.user().id) {
                gf.log("数据操作出错\n异常信息如下：" + msg + JSON.stringify(par)); 
        } }
        //if (!par.error) onerror = par.error;
        par = $.extend({
            type: 'post',
            dataType: 'json',
            url: "/handlers/Common.ashx",
            success: function () { },
            error: onerror,
            code: '',
            data: {}
        }, par);
        jQuery.ajax({
            type: par.type,
            dataType: par.dataType,
            url: par.url,
            data: { OperationCode: par.code, OperationData: JSON.stringify(par.data, "", "") },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data, textStatus) {
                if (textStatus == "success") {
                    if (data.ISSuccess === 1) {
                        par.success(data);
                    }
                    else {
                        if (par.error)
                            par.error(data.ErrorMessage);
                    }
                }
                else {
                    if (par.error)
                        par.error(data.ErrorMessage);
                }
            },
            error: function (XMLHttpRequest, status) {
                if (par.error)
                    par.error(XMLHttpRequest.responseText);
                //请求出错处理
            }
        })
    };
    var callProc = function (procName, aPara, success, conType, onError) {
        var data = {
            ObjectName: procName,
            Values: aPara,
            ConType: conType || 1
        }
        o.ajax({
            code: 'PRC',
            data: data,
            success: success,
            error: onError
        });
    };
    o.callProc_with_value = function (procName, aPara, success, conType, onError) {
        callProc(procName, aPara, function (jsn) { success(jsn.ReturnValue); }, conType || 1, onError);
    };
    o.getOneLineSqlPara = function (sWhere, sFields, tbl, success, conType, onError) {// 单行数据
        this.noPaginationSqlPara(sWhere, '', sFields, tbl, function (a) {
            if ($.isArray(a)) {
                if ($.isArray(a[0])) a = a[0];
            } else a = [];
            success(a);
        }, conType || 1, onError);
    };
    o.pagination = function (aPara, success, config, onError) {
        //isRowNumber, conType
        if (!config) config = {};
        config = $.extend({
            conType: 1,
            isRowNumber: false,
            FieldKey: 'ID',
            ajaxMsg: '正在查询请稍后...'
        }, config);

        var proName = '';
        if (config.isRowNumber) {// 调用row number 分页存储过程
            proName = 'up_page';
        } else {
            proName = 'up_PageView';
            aPara.push(config.FieldKey);
        }
        aPara.push(1);
        var data = {
            ObjectName: proName,
            Values: aPara,
            ConType: config.conType
        }
        gtips.showAjax(config.ajaxMsg);
        o.ajax({
            code: 'PRC',
            data: data,
            success: success,
            error: onError
        });
    };
    o.callProcBatch = function (procName, aPara, success, conType, onError) {// 批量更新 aPara 是二维数组
        var data = {
            ObjectName: procName,
            BatchValues: aPara,
            ConType: conType || 1
        }
        this.ajax({
            code: 'BPR',
            data: data,
            success: success,
            error: onError
        });
    };
    o.getOneLine = function (procName, aPara, success, conType, onError) {// 单行数据
        this.noPagination(procName, aPara, function (a, returnValue) {
            if ($.isArray(a) && a.length > 0) {
                if ($.isArray(a[0])) a = a[0];
            }
            else a = [];
            success(a, returnValue);
        }, conType || 1, onError);
    };
    o.execSql = function (sql, success, conType) {
        var data = {
            ObjectName: sql,
            ConType: conType || 1
        }
        this.ajax({
            code: 'SQL',
            data: data,
            success: success
        });
    };
    o.noPagination = function (procName, aPara, success, conType, onError) { // 非分页
        var data = {
            ObjectName: procName,
            Values: aPara,
            ConType: conType || 1
        }
        this.ajax({
            code: 'PRC',
            data: data,
            error: onError,
            success: function (jsn) {
                var a = jsn.OutputTable;
                if ($.isArray(a)) {
                    if (a.length > 0) {
                        if (a[0].length == 1) {// 如果只有一列转换成一维数组
                            for (var i = 0; i < a.length; i++) a[i] = a[i][0];
                        }
                    }
                } else a = [];
                success(a, jsn.ReturnValue);
            }
        });
    };
    o.noPaginationSqlPara = function (sWhere, sortField, sFields, tbl, success, conType) {
        if (sWhere) sWhere = ' where ' + sWhere;
        if (sortField) sortField = ' order by ' + sortField;
        var sql = 'select ' + sFields + ' from ' + tbl + sWhere + sortField;
        this.execSql(sql, function (jsn) {
            var a = jsn.OutputTable;
            if ($.isArray(a)) {
                if (a[0]) {
                    if (a[0].length == 1) {// 如果只有一列转换成一维数组
                        for (var i = 0; i < a.length; i++) a[i] = a[i][0];
                    }
                }
            } else {
                a = [];
            }
            success(a);
        }, conType || 1);
    };
    o.query = function (code, values, success, conType) {
        var data = {
            ObjectName: code,
            Values: values,
            ConType: conType || 1
        }
        this.ajax({
            code: 'query',
            data: data,
            success: function (o) {
                success(o.OutputTable);
            }
        });
    };
    return o;
})()

pgf = (function () {
    var o = {},
    ajax = function (par) {
        par = $.extend({ url: "/handlers/pgCommon.ashx" }, par);
        gf.ajax(par);
    };
    o.codeData = function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType || 1,
            ConField: localStorage.last_db_login_success
        }
        ajax({
            code: 'query',
            data: data,
            error: onError || function (m) { alert(m) },
            success: function (jsn) {
                gtips.hideAjax();
                var a = jsn.OutputTable;
                if ($.isArray(a)) {
                    if (a.length > 0) {
                        if (a[0].length == 1) {// 如果只有一列转换成一维数组
                            for (var i = 0; i < a.length; i++) a[i] = a[i][0];
                        }
                    }
                } else a = [];
                success(a, jsn.ReturnValue);
            }
        });
    };
    o.codeTableData = function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType || 1,
            ConField: localStorage.last_db_login_success
        }
        ajax({
            code: 'query',
            data: data,
            error: onError,
            success: function (jsn) {
                gtips.hideAjax();
                success(jsn.OutputTable, jsn.ReturnValue);
            }
        });
    };
    o.batchUpdate = function (code, aPara, success, conType, onError) {
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,//这个非标准，后面去掉
            BatchValues:aPara,//这个是标准
            ConType: conType || 1,
            ConField: localStorage.last_db_login_success
        }
        ajax({
            code: 'batchUpdate',
            data: data,
            error: onError,
            success: function (jsn) {
                gtips.hideAjax();
                if (jsn.ISSuccess != 1) {
                    if (onError)
                        onError(jsn.ErrorMessage);
                    else {
                        console.log(data);
                        alert(jsn.ErrorMessage);
                    }
                }
                else
                    success();
            }
        });
    }
    return o;
})()

jQuery.cookie = function (name, value, options) {
    ///<summary>
    ///  set,get,delete cookie
    ///</summary>
    ///<param name="name" optional="true">(optional) cookie name</param>
    ///<param name="value" optional="true">(optional) The value to set the cookie to.</param>
    ///<param name="options" optional="true">(optional) { expires: 7, path: '/', domain: 'jquery.com', secure: true } </param>
    ///<returns type="jQuery" /> 
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = cookie.substring(name.length + 1);
                    //cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

ur = (function () {
    var o = { user: null }, c = null,
    splt1 = '|~';
    o.a = [];
    var ini = function (index) {
        if (o.a.length == 0) {
            //this.a = decodeURIComponent(localStorage.userdetail).split(splt1);
            if ($.cookie("user_data")) {
                try {
                    var s = JSON.parse(decodeURIComponent($.cookie("user_data")));
                }
                catch (e) {
                    var s = decodeURIComponent($.cookie("user_data"));
                }
                if ($.isArray(s)) {
                    o.a = s;
                }
                else {
                    if (s) o.a = s.split(splt1);
                }
            }
        }
    };
    o.user = function () {
        //ID,name,DistrictCode,agentId,role,memberDate,total_point,consumed_point,rank,agentId,companyName,children
        ini();
        return {
            id: this.a[0],
            name: this.a[1], //真实姓名
            role: this.a[4], //角色
            agentId: this.a[3], // 我的默认平台ID
            DistrictCode: this.a[2],
            rank: this.a[8],
            coid: this.a[9],
            storeName: this.a[10],
            coName: this.a[10],
            code: this.a[11],
            children: this.a[12],
            erpID: this.a[13],
            isVip: this.a[14],
            companyName: this.a[15],
            version: this.a[16],
            sysUrl: this.a[17],
            sysId:this.a[18]
        };
    }
    o.isFirst = function () {
        return !!ur.user().erpID;
    }
    if (o.user().id) {
        $.cookie('userid', o.user().id);
    }
    o.config = function (obj) {
        if (!c) {
            c = JSON.parse(localStorage.config||'{}');
        }
        if (typeof obj !="undefined") {
            c = $.extend({}, c, obj);
            localStorage.config = JSON.stringify(c);
        }
        else {
            return c;
        }
    }
    return o;
})();

f = (function () {
    var o = {};
    o.price = function (v, digit) {
        var pre = '';
        if (v < 0) { pre = '-'; }; //return f.fix(v, digit);
        v = Math.abs(v).toString();
        if (!v.length || isNaN(v)) return '';
        // 替换掉尾数全部为0
        if (!digit) digit = 0;
        v = Math.round(Number(v) * Math.pow(10, digit)) / Math.pow(10, digit);
        //v = Math.round(Number(v) * 10000) / 10000;
        v = v.toString();
        var a = v.split('.');

        if (a.length == 2) {
            a[1] = a[1].replace(/0{1,4}$/g, ""); // 小数部分
            var d = digit - a[1].length;
            if (d > 0) {
                for (var i = 0; i < d; i++) {
                    a[1] += '0';
                }
            }
            return pre + a[0] + '.' + a[1];
        } else {
            if (digit) {
                var b = '';
                for (var i = 0; i < digit; i++) {
                    b += '0';
                }
            } return pre + v + "." + b;
        }
    };
    o.priceLabel = function (v, digit) {
        if (digit != 0 && !digit) {
            digit = 2;
        }
        return '<label class=number style="width:50%">' + o.price(v, digit) + '</label>';
    }
    o.chineseNumber = function (n) {
        var pre = '';
        if (n < 0) {
            pre = '负';
            n = Math.abs(n);
        }
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return pre + str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    };
    o.getWhere_root = function (aF, aV) {
        var a = [];
        var j = 0;
        var reg = new RegExp("r_r", "g");
        for (var i = 0; i < aF.length; i++) {
            if (aV[i] && aF[i]) {
                if (typeof aV[i] == "string") aV[i] = aV[i].trim();
                a[j++] = aF[i].replace(reg, aV[i]);
            }
        }
        var s = a.join(" AND ");
        if (!s) s = '1=1';
        return s;
    };
    var oDate = function (sDate) {// 返回 date对象
        if (sDate) {
            return new Date(parseInt(sDate.replace("/Date(", "").replace(")/", ""), 10));
        } else return new Date();
    },
    _date = function (sDate) {
        if (sDate) {
            var d = oDate(sDate);
            var sOri = gf.dateFormat(d, "yyyy-MM-dd");
            //var dToday = new Date();
            //var h = (dToday - d) / (60 * 60 * 1000); // 日期和今天之差 单位小时
            //var s = '';
            //if (h > 24 && h < 48) {
            //    s = '昨天';
            //} else if (h > 48) {
            //    var y = dToday.getFullYear() - d.getFullYear();
            //    s = y > 0 ? gf.dateFormat(d, "yyyy-M-d") : gf.dateFormat(d, "M月d日");
            //} else s = gf.dateFormat(d, "HH:mm");
            return { formated: sOri, ori: sOri };
        } else return { formated: 'yyyy-mm-dd', ori: sDate };
    };
    o.date = function (sDate, isOri) {
        ///<summary>
        /// 格式化 日期，使用span包含
        ///</summary>
        /// <param name="sDate" type="String">
        ///     日期字符串
        /// </param>
        /// <param name="isOri" type="String">
        ///     True:用span包裹显示完整日期
        /// </param>
        if (sDate) {
            var d = _date(sDate);
            sDate = isOri ? '<span  title="' + d.ori + '">' + d.formated + '</span>' : d.formated;
        }
        return sDate;
    },
    o.replaceSign = function (str) {
        return str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    }
    return o;
})()

gtips = (function () {// 消息提示统一方法
    var dvNotice = null,
    dvAjax = null,
    dvMask = null, o = {};
    o.ini = function () {
        if (!o.dvAjax) {
            $('body').append('<div id="dvTopNotice" class="notice center"></div><div id="waitTips" class="wait" style="display:none;position:fixed;top: 43px;right:20px;z-index:30000;">正在处理，请稍后...</div>');
            o.dvAjax = $('#waitTips');
            o.dvNotice = $('#dvTopNotice');
            o.dvMask = $('#dvMask');
        }
    };
    o.showNotice = function (msg) {
        // 在页面顶部，无干扰显示提示信息，替代不重要的alert提示信息
        alert(msg);
        //this.dvNotice.html(msg).css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 }).slideDown().delay(3000).slideUp(300);
        if (o.dvNotice && o.dvNotice.size()) {
            o.dvNotice.html(msg);
            if (o.dvNotice.is(':hidden')) {
                o.dvNotice.show().css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 });
                setTimeout(function () {
                    o.dvNotice.css({ 'top': $('body').scrollTop() - 100 });
                    o.dvNotice.fadeOut(400);
                }, 5000);
            } 
        }
    };
    o.showAjax = function (msg) {
        if (!msg) msg = '正在处理，请稍后...';
        o.ini();
        o.dvAjax.text(msg).show(5);
    };
    o.showMask = function () {
        o.dvMask.show();
    };
    o.hideMask = function () { this.dvMask.hide(); };
    o.hideAjax = function () {
        o.dvAjax.hide(5);
    }
    return o;
})()

dom = (function () {
    var o = {};
    o.td = function (v, attr) {
        return '<td ' + (attr || '') + '>' + v + '</td>'
    };
    o.th = function (v, attr) {
        return '<th ' + (attr || '') + '>' + v + '</th>'
    };
    o.tr = function (v, attr) {
        return '<tr ' + (attr || '') + '>' + v + '</tr>'
    }
    o.a = function (v, href, attr) {
        return '<a href="' + (href || '') + '" ' + (attr || '') + '>' + v + '</a>';
    }
    o.btn = function (v, attr) {
        return '<button ' + (attr || '') + '>' + v + '</button>';
    };
    o.lbl = function (fr,txt) {
        return '<label for="'+fr+'">'+txt+'</label>';
    }
    o.txt = function (id, ph) {
        return '<input type="text" id="' + id + '" placeholder="' + ph + '" class="default" style="width: 100%; max-width: 284px;">';
    }
    o.chb = function (id, ph,checked) {
        return '<input type="checkbox" '+(checked?'checked=checked':'')+' id="' + id + '" placeholder="' + ph + '" class="default" style="width: 100%; max-width: 284px;">';
    }
    o.dv = function (v, cls,attr) {
        return '<div '+(attr||'')+' class="' + cls + '">' + v + '</div>';
    }
    return o;
})()

String.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm'), s = arguments[i];
        str = str.replace(re, s);
    }
    return str;
}
function formatStr(format, args) {
    return String.format.apply(null, [format].concat(args));
}

jQuery.event.special.enterpress = {// by 王凡 20110715
    setup: function (data, namespaces) {
        jQuery(this).bind("keypress", jQuery.event.special.enterpress.handler);
    },
    teardown: function (namespaces) {
        jQuery(this).unbind("keypress", jQuery.event.special.enterpress.handler);
    },
    handler: function (event) {
        if (event.keyCode === 13) {
            event.type = "enterpress";
            jQuery.event.handle.apply(this, arguments);
            return $(this);
        }
    }
};
jQuery.fn.extend({
    enterpress: function (ec) {
        $(this).bind('enterpress', ec);
        return $(this);
    }
});

$.fn.disable = function () { return this.each(function () { this.disabled = true; }); }
$.fn.enable = function () { return this.each(function () { this.disabled = false; }); }


/**
* @func	checkIdCard
* @desc 身份证验证函数
* @author Lone Chain
* @version 1.0.0
* @date	2011-9-19
*
* @parame {String} idcard 要验证的身份证号码字符串
* @return {Object¦Boolen} 验证成功返回一个包含省份、生日、性别的对象， 失败返回false
*/
function checkIdCard(idcard) {
    var cities = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
        21: "辽宁", 22: "吉林", 23: "黑龙江",
        31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
        41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
        50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
        61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
        71: "台湾",
        81: "香港", 82: "澳门",
        91: "国外"
    };

    idcard = idcard.toString();

    //验证位数是否正确
    var info = idcard.length == 15 ?
		idcard.match(/^([1-9]\d)\d{4}(\d{2})(\d{2})(\d{2})\d{2}(\d)$/i) :
		idcard.match(/^([1-9]\d)\d{4}(\d{4})(\d{2})(\d{2})\d{2}(\d)[\dx]$/i);
    if (info) {
        if (!info.length) {
            return false;
        }
    } else {
        return false;
    }

    //验证省份是否正确
    if (!cities[info[1]]) {
        return false;
    }

    //验证生日是否正确
    var birthday = new Date(info[2], info[3] - 1, info[4]);
    if (!(
		(birthday.getFullYear() == info[2] || birthday.getYear() == info[2]) &&
		birthday.getMonth() + 1 == parseInt(info[3], 10) &&
		birthday.getDate() == parseInt(info[4], 10)
	)) {
        return false;
    }

    //18位身份证校验
    if (info[0].length == 18) {
        var sum = 0;
        info[0] = info[0].replace(/x/i, 'a');
        for (var i = 17; i >= 0; i--) {
            sum += (Math.pow(2, i) % 11) * parseInt(info[0].charAt(17 - i), 11);
        }
        if ((sum % 11) != 1) {
            return false;
        }
    }
    return {
        city: cities[info[1]],
        birthday: gf.dateFormat(birthday, 'yyyyMMdd'),
        gender: info[5] % 2 ? "m" : "f"
    };
}

var _cmbAddress = {
    cmbAddress: null,
    isIniCmb: false,
    iniAddr: function () {//选择
        if (!this.isIniCmb) {
            var om = this;
            this.isIniCmb = true;
            // 地区号分3段
            gf.noPaginationSqlPara('1=1', 'ID asc', 'ID,ProvinceName', 'Province', function (a) {
                gOption.foption(om.cmbAddress.eq(0), a);
                om.setDefault(ur.user().DistrictCode);
            });
            this.cmbAddress.eq(0).change(function () {
                om.city($(this).val(), '');
            });
            this.cmbAddress.eq(1).change(function () {
                om.area($(this).val(), '');
            });
        }
    },
    setDefault: function (code) {
        var sa = [];
        code = $.trim(code);
        if (code) {
            sa.push(code.substr(0, 2));
            sa.push(code.substr(2, 2));
            sa.push(code.substr(4, 2));

            this.province(sa[0]);
            this.city(sa[0], sa[0] + sa[1]);
            this.area(sa[0] + sa[1], code);
        }
    },
    province: function (def) {
        this.cmbAddress.eq(0).val(def);
    },
    area: function (city, def) {
        var om = this;
        gf.noPaginationSqlPara('CityID=' + city, 'CityID asc', 'DistrictCode,AreaName', 'Area', function (a) {
            a.unshift(['', '请选择地区']);
            gOption.foption(om.cmbAddress.eq(2), a, def);
        });
    },
    city: function (provice, def) {
        var om = this;
        gf.noPaginationSqlPara('ProvinceID=' + provice, 'ID asc', 'ID,CityName', 'City', function (a) {
            a.unshift(['', '请选择城市']);
            gOption.foption(om.cmbAddress.eq(1), a, def);
        });
    }
}


var suggest = (function () {
    var o = {},
    complete = function (txts, proc, param, minLength, fResponse, callback) {
        $(txts).blur(function () {
            if (!$(this).val()) {
                $(this).attr('data-id', '');
            }
        });
        txts.autocomplete({
            source: function (request, response) {
                if (ur.user().id) {
                    var p = param.concat();
                    p.push(request.term);
                    gf.noPagination(proc, p, function (a) {
                        for (var i = 0; i < a.length; i++) a[i] = fResponse(a[i]);
                        response(a);
                    });
                }
            },
            autoFocus: true,
            appendTo: txts.next().size() ? txts.next() : null,
            select: function (event, ui) {
                if (ui.item.id) $(this).attr('data-id', ui.item.id);
                if ($.isFunction(callback)) callback(ui.item, this);
            },
            close: function (event, ui) {
            },
            change: function (event, ui) {
            },
            minLength: minLength
        });
        if (txts.size() > 0) {
            txts.data("autocomplete")._renderItem = function (ul, item) {
                var line = item.label ? "<a>" + item.label + "<b>" + item.tips + "</b></a>" : '<a>无匹配条件</a>';
                return $("<li></li>")
			.data("item.autocomplete", item)
			.append($(line))
			.appendTo(ul);
            }
        }
    };
    o.attribute = function (obj, callback) {
        $(obj).each(function () {
            complete($(this), 'up_base_getAttrValueForSuggest', [$(this).attr('data-ad-id'), 15], 2, function (a) {
                var c = {}
                c.label = a[1];
                c.value = a[1];
                c.id = a[0];
                c.tips = a[1];
                return c;
            }, callback)
        })
    },
    o.mobile = function (obj, callback) {
        complete($(obj), 'up_user_getUserMobileForSuggest', [15], 6, function (a) {
            var c = {}
            c.label = a[1];
            c.value = a[1];
            c.id = a[0];
            c.tips = a[2];
            c.districtCode = a[3];
            return c;
        }, callback);
    }
    return o;
})();

var jsonp = (function () {
    var o = {}, cb = null;
    o.callback = function (data) {
        cb(data);
    };
    o.get = function (url, param, callback) {
        cb = callback;
        if (url.indexOf('?') >= 0) {
            url = url + "&callback=jsonp.callback";
        }
        else {
            url = url + "?callback=jsonp.callback";
        }
        var p = [];
        if (param) {
            if (typeof param === 'object') {
                for (var k in param) {
                    p.push(k + '=' + encodeURI(param[k]));
                }
                url += '&' + p.join('&');
            }
            else {
                url += '&' + param;
            }
        }
        $('<script>').attr({'src': url,charset:'utf-8'}).appendTo($('head'));
    };
    return o;
})()

var pageIni = function () {
    //var url = window.location.href;
    //if (url.indexOf(ur.user().sysUrl) < 0 && ur.user().sysUrl) {
    //    url = ur.user().sysUrl; window.location = url;
    //}
//    else {
//        if (ur.user().rank == 1) {//&& 
//            if (ur.user().erpID) {
//                url = '/agent.shtml';
//            }
//            else {
//                url = '/agent_base.shtml';
//            }
//        }
//        else if (ur.user().rank > 1) {
//            url = '/pos.shtml';
//        }
//        else if (ur.user().rank < 1) {
//            url = '/factory.shtml'
//        }
//    }
//    window.location = url;
}
pageIni();

base.categoryStore = (function () {
    var a = [], o = {};
    o.fillCmb = function (fAllData) {
        if (a.length === 0) {
            gf.noPagination('up_member_getStoreCategoryForCmb', [1, ur.user().agentId], function (data) {
                a = data;
                fAllData(a);
            });
        }
        else {
            fAllData(a);
        }
    };
    return o;
})()

/**
    *@desc 自动给表上面的多选加上批量选择
*/
base.checkAll = (function () {
    $('table>thead :checkbox.all').live('click', function () {
        if ($(this).attr('checked'))
            $(this).parents('table').find('tbody :checkbox').attr('checked', $(this).attr('checked'));
        else
            $(this).parents('table').find('tbody :checkbox').removeAttr('checked');        
    })
})()