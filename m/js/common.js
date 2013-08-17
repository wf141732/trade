/// <reference path="baidu.json.js" />

var gaRank = ['厂家', '代理商', '终端店', '连锁店'];
var Host = window.location.protocol + "//" + window.location.host + '/';
var splt1 = '|~'
var gurl = {
    root: Host
}

function checkLogin() {
    // 检查登录状态 每个页面必须调用该方法
    //var s = localStorage.userdetail;
    var s = $.cookie("user_data");
    if (s) {// 未登录
        return true;
    } else {// 登录
        setTimeout(function () {
            window.location = "l.aspx?to=" + window.location.href;
        }, 200);
        return false;
    }
}
function logout() {
    $.cookie("userid", null);
    gls.clear();
    window.location = "l.aspx";
}


var gls = {// localStorage 方法   
    aAu: [], // 权限
    aMyFunc: [],
    ini: function () {
    },
    // 以下是加工厂专用，以后要独立出来
    toJson: function (data) {
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                gf.log('toJson:' + data);
                return {};
            }
        } else return {};
    },
    clear: function () {
        localStorage.userdetail = '';
    }
}

var ur = {
    a: [],
    ini: function (index) {
        if (this.a.length == 0) {
            //this.a = decodeURIComponent(localStorage.userdetail).split(splt1);
            var s = decodeURIComponent($.cookie("user_data"));
            if (s) this.a = s.split(splt1);
        }
    },
    user: function () {
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
            erpID: this.a[13]
        };
    }
};

var gtips = {// 消息提示统一方法
    dvNotice: null,
    dvAjax: null,
    dvMask: null,
    ini: function () {
        if (!this.dvAjax) {
            $('body').append('<div id="dvTopNotice" class="notice center"></div><div id="waitTips" class="wait" style="display:none;">正在处理，请稍后...</div>');
            this.dvAjax = $('#waitTips');
            this.dvNotice = $('#dvTopNotice');
            this.dvMask = $('#dvMask');
        }
    },
    showNotice: function (msg) {
        // 在页面顶部，无干扰显示提示信息，替代不重要的alert提示信息
        //this.dvNotice.html(msg).css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 }).slideDown().delay(3000).slideUp(300);
        var om = this;
        this.dvNotice.html(msg);
        if (this.dvNotice.is(':hidden')) {
            this.dvNotice.show().css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 });
            setTimeout(function () {
                om.dvNotice.css({ 'top': $('body').scrollTop() - 100 });
                om.dvNotice.fadeOut(400);
            }, 5000);
        }
    },
    showAjax: function (msg) {
        if (!msg) msg = '正在处理，请稍后...';
        this.ini();
        this.dvAjax.text(msg).show(5);
    },
    showMask: function () {
        this.dvMask.show();
    },
    hideMask: function () { this.dvMask.hide(); },
    hideAjax: function () {
        this.dvAjax.hide(5);
    }
}

var pgf = {
    ajax: function (par) {
        var onerror = function (msg) { gf.log(msg); alert("数据操作出错\n异常信息如下：" + msg); }
        //if (!par.error) onerror = par.error;        
        par = $.extend({
            type: 'post',
            dataType: 'json',
            url: "/handlers/pgCommon.ashx",
            success: function () { },
            error: onerror,
            code: '',
            data: {}
        }, par);
        var od = '';
        try {
            od = JSON.stringify(par.data);
        } catch (e) {
            od = T.json.stringify(par.data);
        };
        var s=function(data, textStatus) {
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
          };
        $.ajax({
            type: par.type,
            dataType: par.dataType,
            url: par.url,
            data: { OperationCode: par.code, OperationData: od },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data, textStatus) {
                s(data,textStatus)
            },
            error: function (XMLHttpRequest, status) {
                if (status == 'parsererror') {
                    s(T.json.parse(XMLHttpRequest.responseText), 'success');
                    return;
                }
                if (par.error)
                    par.error(XMLHttpRequest.responseText);
                //请求出错处理
            }
        })
    },
    codeData: function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType
        }
        try {
            data.ConField = (localStorage && localStorage.last_db_login_success) ? localStorage.last_db_login_success : ''
        } catch (e) {
        }
        this.ajax({
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
    },
    codeTableData: function (code, aPara, success, conType, onError) { // 非分页
        gtips.showAjax();
        var data = {
            ObjectName: code,
            Values: aPara,
            ConType: conType
        }
        try {
            data.ConField = (localStorage && localStorage.last_db_login_success) ? localStorage.last_db_login_success : ''
        } catch (e) {
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
            BatchValues: aPara,
            ConType: conType
        }
        try {
            data.ConField = (localStorage && localStorage.last_db_login_success) ? localStorage.last_db_login_success : ''
        } catch (e) {
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
