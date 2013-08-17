/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="common.js" />
$(function () {
    pm.ini();
})

f.price = function (v, digit) {
    v = v.toString();
    if (!v.length || isNaN(v)) return '';
    if (v < 0) return f.fix(v,digit);
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
        return a[0] + '.' + a[1];
    } else {
        if (digit) {
            var b = '';
            for (var i = 0; i < digit; i++) {
                b += '0';
            }
        } return v + "." + b;
    }
}



/**
* 
* @desc 全屏插件
* @version 1.0.0
* @date	2012-4-27 
*/
var a=
(function () {
    var 
		fullScreenApi = {
		    supportsFullScreen: false,
		    isFullScreen: function () { return false; },
		    requestFullScreen: function () { },
		    cancelFullScreen: function () { },
		    fullScreenEventName: '',
		    prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];

            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.supportsFullScreen = true;

                break;
            }
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function (el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function (el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function () {

            return this.each(function () {
                var el = jQuery(this);
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(el);
                }
            });
        };
    }

    window.fullScreenApi = fullScreenApi;
})();


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

//postMessage
var pm = {
    ini: function () {
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', this.onmessage, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', this.onmessage);
        }
        if (window.parent && window.parent.parent)
            window.parent.parent.postMessage({ code: 'lg' }, '*');
    },
    onmessage: function (e) {
        var d = e.data;
        if (d.code == 'lg' && d.data) {
            d = JSON.parse(d.data);
            if (localStorage.last_login_login_success != d.last_login_login_success) {
                localStorage.last_db_login_success = d.last_db_login_success;
                localStorage.last_login_login_success = d.last_login_login_success;

                pgf.codeData('user-cus-info', [localStorage.last_login_login_success], function (a) {
                    a = a[0];
                    localStorage.user_id = a[0];
                    localStorage.partner_id = a[1];
                    localStorage.partner_name = a[2];
                    //alert(localStorage.user_id);
                })
            }
        }
    }
}

jQuery.fn.extend({
    enterpress: function (ec) {
        $(this).bind('enterpress', ec);
        return $(this);
    }
});

var pgf = {
    ajax: function (par) {
        par = $.extend({ url: gurl.root + "handlers/pgCommon.ashx" }, par);
        gf.ajax(par);
    },
    codeData: function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType,
            ConField: localStorage.last_db_login_success
        }
        this.ajax({
            code: 'query',
            data: data,
            error: onError || function (m) { alert(m)},
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
    },
    codeTableData: function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType,
            ConField: localStorage.last_db_login_success
        }
        this.ajax({
            code: 'query',
            data: data,
            error: onError,
            success: function (jsn) {
                gtips.hideAjax();
                success(jsn.OutputTable, jsn.ReturnValue);
            }
        });
    },
    batchUpdate: function (code, aPara, success, conType, onError) {
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType,
            ConField: localStorage.last_db_login_success
        }
        this.ajax({
            code: 'batchUpdate',
            data: data,
            error: onError,
            success: function (jsn) {
                gtips.hideAjax();
                if (jsn.ISSuccess != 1) {
                    if (onError)
                        onError(jsn.ErrorMessage);
                    else
                        alert(jsn.ErrorMessage);
                }
                else
                    success();
            }
        });
    }
}

ur.user=function () {
        //ID,name,DistrictCode,agentId,role,memberDate,total_point,consumed_point,rank,agentId,companyName,children
        this.ini();
        return {
            id: this.a[0],
            name: this.a[1], //真实姓名
            role: this.a[4], //角色
            agentId: this.a[3], // 我的默认平台ID
            DistrictCode: this.a[2],
            rank: this.a[8],
            coid: this.a[9],
            coName: this.a[10],
            code: this.a[11],
            children: this.a[12],
            erpID:this.a[13]
        };
    };

    ur.isFirst = function () {
        return !!ur.user().erpID;
    }


    gPaginationModel.search = function (pIndex) {
        if (arguments.length < 1) pIndex = -1;

        var om = this;
        $(this.btnSearch).disable();
        this.showAjax();
        gf.pagination([this.tbl, pIndex, this.ps, this.fields, this.sort.sort_str(), this.where()], function (jsn) {
            $(om.btnSearch).enable();
            var pageTotal = jsn.OutputValue;
            if (pageTotal != -1) {
                om.create_pagination(pageTotal)
                om.dv.find('.pageTotal').html('本次查询总数' + pageTotal);
            };
            var a = jsn.OutputTable;
            function success() { gtips.hideAjax(); }
            if (a.length > 0) {
                om.fillin(a, success);
            } else {
                om.oTbl.find('tbody').html('');
                if (om.search_done)
                    if (hasArguments(om.search_done))
                        om.search_done(success);
                    else
                        success();
                else
                    success();
                //gf.outputMsgInTbl('查询无记录', om.oTbl);
            }
        }, {
            isRowNumber: this.isRowNumber,
            conType: om.contype
        });
    };
    gPaginationModel.fillin = function (a, success) {
        for (var i = 0; i < a.length; i++) a[i] = this.fdata(a[i], i);
        this.oTbl.find('tbody').html(a.join(''));
        if (hasArguments(this.search_done))
            this.search_done(success);
        else {
            this.search_done();
            success ? success() : null;
        }
    }
    gPaginationModel.search_done = function (success) {
        success ? success() : null;
    }

    function hasArguments(fun) {
        if (typeof fun != 'function') return;
        var a = fun.toString(),
            b = a.substring(0, a.indexOf("{")),
            c = b.substring(b.indexOf("(")).trim(),
            d = c.substring(1, c.length - 1);
	if(!d) return;
        var   e = d.split(",");
        return e.length;
    }

    gf.showSimple = function (obj, dv, position) {
        if (position) {
            gf.show(obj, dv, position);
        }
        else {
            gf.show(obj, dv, { x: 'center', y: 'center' });
        }
    }

    function DX(n) { //金额大写转换函数
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
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }


    function formatStr(format, args) {
        return String.format.apply(null, [format].concat(args));
    }