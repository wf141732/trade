<%@ Page Language="C#" AutoEventWireup="true" CodeFile="l.aspx.cs" Inherits="m_l" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>欧美姿会员管理系统</title>
    <script src="../js/version.js" type="text/javascript"></script>
    <script src="js/zepto.min.js" type="text/javascript"></script>
    <script src="js/zepto/zepto.cookie.min.js" type="text/javascript"></script>
    <script src="js/common.js" type="text/javascript"></script>
    <meta name="viewport" content="user-scalable=yes,width=device-width,initial-scale=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />    
    <script>
        window.onload = function () {
            $('input').on('keypress', function (evt) {
                if (evt.keyCode == 13)
                    _login();
            })
            $('#btnLogin').on('click', function () {
                _login();
            });
            var _login = function () {
                var u = $('#txtUser').val(), p = $('#txtPsw').val();
                if (u && p) {
                    $.post('/handlers/login.ashx', { 'user': u, 'psw': p, 'type': '11' }, function (data) {
                        if (data) {// 登陆成功
                            var ex = null;
                            ur.a = [];
                            if ($("#chkRemember").is(":checked")) ex = { expires: 7 }
                            $.cookie("user_data", data, ex);
                            $.cookie("userid", ur.user().id, ex);
                            var url = window.location.href;
                            var subDomain = url.split('.')[0]; // 二级域名 比如 http://wh , http://www
                            a = url.split('to=');
                            if (ur.user().rank != 1) {
                                alert('目前只支持代理商！');
                                return;
                            }
                            if (!ur.user().erpID) {
                                alert('未关联ERP客户');
                                return;
                            }
                            url = a.length > 1 ? a[1] : 'index.aspx';
                            window.location = url + "?version=" + version;
                            localStorage.version = version;
                        } else {
                            alert("用户名或密码错误，请重新输入");
                            $(obj).enable();
                        }
                    })
                }
            }
        }
    </script>
    <style>
        input{height:20px;max-width:100%}
        button{height:30px;}
        table{font-size:20px;}
        td{padding:5px 0px 5px 0px;}
    </style>
</head>
<body style="text-align:center;">
<h2>欧美姿会员管理系统登录</h2>
    <table style="border:1px gray solid;width:100%;border-radius:5px;padding:10px 5px 5px 5px; font-size:20px;" >
    <tr><td style="text-align:right;white-space:nowrap;width:40%">登录号：</td>
        <td style="text-align:left"><input id="txtUser" type="text" placeholder="输入登录号(数字)" autofocus="autofocus" /></td></tr>
    <tr><td style="text-align:right">密码：</td>
        <td style="text-align:left"><input id="txtPsw" type="password" placeholder="输入登录密码"/></td></tr>
    <tr><td colspan=2>
        <span id="dvIp"></span>
        <label><input id="chkRemember" type="checkbox" checked="checked" />下次记住我（一周）</label>
    </td>
    <tr><td colspan=2>
        <button id="btnLogin" style="width:40%;max-width:100px;">登陆</button>
        <a href="http://www.cnblogs.com/aac-wf/archive/2012/08/16/2642145.html" target="_blank">使用说明</a></td></tr>
    </table>
    <div style="border:1px gray solid;width:99%;border-radius:5px;padding:10px 5px 5px 5px; margin:10px 5px 5px 0px;">商海茫茫，千舟竞发。自信使我们在这个“竞争与发展同在，机遇与挑战并存”的环境中信心更足；努力让我们学会脚踏实地和孜孜不倦，坚持让我们不言放弃、不懈追求。欧美姿创业，经过11年的发展历程，建设成今天以生产，研发，销售为一体的具有坚实竞争力和坚强生命力的公司，公司拥有占地面积十二万平米的生产和仓储基地，一直致力于“打造中国面部保湿第一品牌”为目标，凭借高品质的产品和优秀竟争力的销售团队，为面对激烈的市场竟争奠定了坚实的基础。 回顾过去，我们充满自豪；展望未来，我们依然充满自信。我们将矢志不移的秉承“诚信为本，以人为尊”的经营理念。我们坚信，有了你们的支持和厚爱，欧美姿的目标一定能实现！欧美姿的明天一定更美好！“长风破浪会有时，直挂云帆济沧海”，让我们一起来感受欧美姿青春的脉息、畅想共同成长的快乐！ </div>
</body>
</html>
