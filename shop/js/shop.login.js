/// <reference path="jquery.js" />
/// <reference path="bootstrap.js" />
/// <reference path="../../js/base.js" />
var shop = shop || {};

$(function () {
    $('form .btn-primary').click(function () {
        login(this);
        return false;
    });
});

function login(obj) {
    var user = $("#username").val(),psw = $("#password").val();
    $(obj).disable();
    $.cookie('userid', 1);
    gf.getOneLine('up_member_login1', [user, psw, '11'], function (data) {
        if (data[0]) {// 登陆成功
            var ex = ex = { expires: 10, path: '/' };
            ur.a = [];
            if ($("#chkRemember").is(":checked")) ex = { expires: 7, path: '/' };
            $.cookie("user_data", JSON.stringify(data), ex);
            $.cookie("userid", ur.user().id, ex);
            var url = window.location.href;
            var subDomain = url.split('.')[0]; // 二级域名 比如 http://wh , http://www
            a = url.split('to=');
            url = a.length > 1 ? a[1] : 'index.aspx';
            if (ur.user().sysUrl) {
                url = ur.user().sysUrl;
            }
            else {
                if (ur.user().rank == 1) {//&& 
                    if (ur.user().erpID) {
                        url = '/agent.shtml';
                    }
                    else {
                        url = '/agent_base.shtml';
                    }
                }
                else if (ur.user().rank > 1) {
                    url = '/pos.shtml';
                }
                else if (ur.user().rank < 1) {
                    url = '/factory.shtml'
                }
            }
            if (ur.user().sysId) {
                gf.noPagination('up_base_getAttributeDefin', [ur.user().sysId, 0, ur.user().id], function (a) {
                    var ad = {};
                    for (var i = 0, b = []; b = a[i]; i++) {
                        if (!ad[b[0]]) {
                            ad[b[0]] = {};
                        }
                        ad[b[0]][b[1]] = { label: b[2], desc: b[3], id: b[4], isUn: b[5] };
                    }
                    ur.config({ 'attributeDefin': ad });
                    window.location = url + "?version=" + version;
                    localStorage.version = version;
                })
            }
            else {
                ur.config({ 'attributeDefin': {} });
                window.location = url + "?version=" + version;
                localStorage.version = version;
            }
        } else {
            alert("用户名或密码错误，请重新输入");
            $(obj).enable();
        }
    });
}


