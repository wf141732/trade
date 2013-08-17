/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="version.js" />

var mevnt=null;
var mDvLogin=null;
$(function () {
    if ($.browser.webkit || $.browser.mozilla ||($.browser.msie && $.browser.version >= 10)) {
        $('body').keydown(function (e) { if (e.keyCode == 13) login($('#bttnLogin')); });
        $('#bttnLogin').click(function () {
            login(this);
        });
    } else {
        window.location = 'nosupport.htm';
    }
});

function login(obj) {
    var user = $("#txtUser").val();
    var psw = $("#txtPsw").val();
    $(obj).disable();
    $.get(gurl.root + 'handlers/login.ashx', { 'user': user, 'psw': psw, 'type': '11' }, function (data) {
        if (data) {// 登陆成功
            //ID,name,code,DistrictCode,agentId,grade,memberDate,total_point,consumed_point
            //localStorage.userdetail = data;
            var ex = null;
            if ($("#chkRemember").is(":checked")) ex = { expires: 7 }
            $.cookie("user_data", data, ex);
            $.cookie("userid", ur.user().id, ex);
            var url = window.location.href;
            var subDomain = url.split('.')[0]; // 二级域名 比如 http://wh , http://www
            a = url.split('to=');
            url = a.length > 1 ? a[1] : 'index.aspx';
            if (ur.user().rank == 1 && ur.user().erpID) {
                url = 'agent.shtml';
            }
	    if(ur.user().rank > 1)
	    {
                url = 'pos.shtml';
            }
            window.location = url ;//+ "?version=" + version;
            localStorage.version = version;
        } else {
            alert("用户名或密码错误，请重新输入");
            $(obj).enable();
        }
    });
}

