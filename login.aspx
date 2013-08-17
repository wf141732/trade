<%@ Page Language="VB" AutoEventWireup="false" CodeFile="login.aspx.vb" Inherits="login" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>欧美姿会员管理系统登录</title>
    <% Dim ver As String= "20120530" %>    
    <link href="css/yui/reset-fonts-grids.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery-1.7.1.min.js" type="text/javascript"></script>
    <script src="js/jquery.aac.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/common.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/common05.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/login.js?ver=1.0" type="text/javascript"></script> 
    <script src="js/version.js?ver=<%=ver %>" type="text/javascript"></script>
<style type="text/css" >
.login_pnl{width:300px;height:182px;background:url(images/register/login_bg.gif);}
   
.login_pnl table{margin-top:20px;margin-left:10px;}    
.login_pnl table input{font-size:15px;font-weight:bold;}   
.login_pnl table input[type=text],.login_pnl table input[type=password]{padding:1px;} 
.login_pnl table tr{height:30px;}

h1{font-size:25px;line-height:200px;}    
.register_pic{height:160px;width:160px;background:url(images/register/reg.jpg) no-repeat 0 0;float:left;}    
.register_pnl li{
    line-height:20px;
    color:Gray;
    font-size:11px;
    }    
.clear {
	clear: both;
	display: block;
	overflow: hidden;
	visibility: hidden;
	width: 0;
	height: 0;
}
</style>    
</head>
<body>
<div id="doc">
<div id="hd">
<h1>欧美姿会员管理系统登录</h1>
</div>
<div id="bd">
<div class="yui-b">
<div class="yui-g">
    <div class="yui-u first" style="border-right:solid 1px gray;">
    <div class="login_pnl">
    <div style="height:1px;"></div>
    <table style="margin-top:20px;">
    <tr><td style="width:60px;">登录号：</td><td style="width:220px;"><input id="txtUser" type="text" placeholder="输入登录号(数字)" style="width:200px;" autofocus="autofocus" /></td></tr>
    <tr><td>密码：</td><td><input id="txtPsw"  type="password" placeholder="输入登录密码" style="width:200px;" /></td></tr>
    <tr><td></td><td>
        <span id="dvIp"></span>
        <label ><input id="chkRemember" type="checkbox" checked="checked" />下次记住我（一周）</label>
    </td></tr>
    </table>
    <div style="margin-top:30px;text-align:center;width:300px;">
        <button id="bttnLogin" style="width:80px;height:30px; ">登陆</button>
        <a href="http://www.cnblogs.com/aac-wf/category/375098.html" target="_blank">使用说明</a>
        <a href="http://www.cnblogs.com/aac-wf/archive/2012/08/16/2642145.html" style=" font-weight:bold;" target="_blank">手机版使用说明</a>
    </div>
    </div>
    </div>
    <div class="yui-u register_pnl" >
        <div class="register_pic"></div>
        <ul>
        <li>商海茫茫，千舟竞发。自信使我们在这个“竞争与发展同在，机遇与挑战并存”的环境中信心更足；努力让我们学会脚踏实地和孜孜不倦，坚持让我们不言放弃、不懈追求。欧美姿创业，经过11年的发展历程，建设成今天以生产，研发，销售为一体的具有坚实竞争力和坚强生命力的公司，公司拥有占地面积十二万平米的生产和仓储基地，一直致力于“打造中国面部保湿第一品牌”为目标，凭借高品质的产品和优秀竟争力的销售团队，为面对激烈的市场竟争奠定了坚实的基础。 回顾过去，我们充满自豪；展望未来，我们依然充满自信。我们将矢志不移的秉承“诚信为本，以人为尊”的经营理念。我们坚信，有了你们的支持和厚爱，欧美姿的目标一定能实现！欧美姿的明天一定更美好！“长风破浪会有时，直挂云帆济沧海”，让我们一起来感受欧美姿青春的脉息、畅想共同成长的快乐！ </li>
        </ul>
    </div>
</div>
</div>
</div>
<div id="ft">
   
</div>
</div>
 
</body>
</html>
