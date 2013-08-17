<%@ Page Language="VB" AutoEventWireup="false" CodeFile="set.aspx.vb" Inherits="users_set" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>用户管理（添加用户、设置权限、冻结用户等操作)</title>
<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />
<link href="../css/taobao/nav0906.css" rel="stylesheet"  />
<script src="../js/jquery-1.6.2.min.js"></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/users/set.js" ></script>
<script src="../js/jqueryplugin/jquery.pagination.js" ></script>
<script src="../js/jqueryplugin/contextmenu/jquery.contextmenu.r2.packed.js" ></script>

<style  >
.main5 tbody td.username{padding-left:25px;}
.main5 tbody td.m{background:url(../images/pic_photo.gif) no-repeat 0 center; }
.main5 tbody td.f{background:url(../images/pic_photonv.gif) no-repeat 0 center;}

.main5 tbody tr.s2{ text-decoration:line-through; color:Gray;} /*冻结*/
.main5 tbody td.state{cursor:pointer;color:Blue;}
.main5 tbody td.state:hover{color:Red;}

#dvUserList .uright fieldset{margin-bottom:10px;}
#dvUserList .uright fieldset ul{width:100%;}
#dvUserList .uright fieldset ul li{line-height:25px; width:100%;}
#dvUserList .uright fieldset ul li a{margin-left:10px;}
#dvUserList .uright fieldset select{width:200px; margin-right:5px;}


#dv_state{width:100px;}

    #dv_registerip{width:280px;}
    #dv_registerip label{width:100%;display:block;margin-bottom:5px;text-align:left;}
    #dv_registerip label span{min-width:65px;display:inline-block; text-align:left;font-size:13px;}
    #dv_registerip label input[type=text],#dv_registerip label select{padding:1px}
    #dv_registerip label input[type=text]{width:200px;}
    #dv_registerip input[type=button]{width:70px; line-height:20px; font-size:15px;  margin-top:5px;}
    .main5 tbody tr.alert td,.main5 tbody tr.alert td a{color:Red;}


fieldset {
    padding:10px;
    margin:10px;
    color:#333; 
    border:#06c solid 1px;
} 
legend {
    color:#06c;
    font-weight:800; 
    background:#fff;
    padding:3px 6px;
} 

</style>    
</head>
<body>

<div id="doc4" class="yui-t6">
    <div id="hd"></div>
    <div id="bd">
    <div id="dvUserList" class="target">
    <div class="yui-gc">
        <div id="dvUsers" class="yui-u first" >
            <div class="yui-g" style="width:100%;margin-left:0;">
            <div class="yui-u first"><div class="pagination"></div></div>
            <div class="yui-u" style="text-align:right;">
                <input type="button" value="添加" class="bttnAddUser" title="添加用户" />
                <input type="button" value="Search" class="btnSearch"  />
            </div>
            </div>        
            <table class="main5">
            <thead>
                <tr class="search_bar">
                    <th style="width:7%;"><input type="text" placeholder="ID" /></th> 
                    <th style="width:13%;"><input type="text" placeholder="登录名" /></th> 
                    <th style="width:13%;"><input type="text" placeholder="真实姓名" /></th> 
                    <th style="width:8%;"><input type="text" placeholder="拼音码" /></th> 
                    <th style="width:10%;"><select></select></th> 
                    <th style="width:10%;"><select></select></th> 
                    <th style="width:8%;"><select>
                        <option value="">全部</option>
                        <option value="1">激活</option>
                        <option value="2">冻结</option>
                    </select></th> 
                    <th style="width:12%;"></th> 
                    <th style="width:16%;"></th> 
                </tr>
                <tr class="header">
                    <th>ID</th> 
                    <th>登录名</th> 
                    <th>真实姓名</th> 
                    <th>拼音码</th> 
                    <th>分部</th> 
                    <th>角色名</th> 
                    <th>状态</th> 
                    <th>注册日期</th> 
                    <th>备注</th> 
                </tr>
            </thead>
            <tbody></tbody>
            </table>
        </div>
        <div class="yui-u uright" >

        <fieldset class="pts" _index="1">
            <legend>添加平台</legend>
            <table class="main5">
            <thead><tr>
            <th style="width:85%;"><select class="cmbPts"></select></th>
            <th style="width:15%;"><input type="button" class="btnAdd" _index="1" value="添加" /></th>
            </tr></thead><tbody></tbody>
            </table>
        </fieldset>
        <fieldset class="groups" _index="2" >
            <legend>添加分组</legend>
            <table class="main5">
            <thead><tr>
            <th style="width:85%;"><select></select></th>
            <th style="width:15%;"><input type="button" class="btnAdd" _index="2" value="添加" /></th>
            </tr></thead><tbody></tbody>
            </table>
        </fieldset> 
        <fieldset class="mailbox"  _index="3">
            <legend>添加邮箱</legend>
            <table class="main5">
            <thead><tr>
            <th style="width:85%;"><select></select></th>
            <th style="width:15%;"><input type="button" class="btnAdd" _index="3" value="添加" /></th>
            </tr></thead><tbody></tbody>
            </table>
        </fieldset>    

        </div>
    </div>
    </div>
    <div id="dvAudit" class="target">
        <div class="yui-g">
        <div class="yui-u first"><div class="pagination"></div></div>
        <div class="yui-u" style="text-align:right;">
            <a href="javascript://" id="bttnReg">注册IP</a>
            <a href="javascript://" id="bttnShowIpBook" title="我司所有注册的IP">IP地址薄</a>
            <input type="button" class="btnSearch" value="Search" /> 
        </div>
        </div>
        <table class="main5">
            <thead><%--ID,u_id,用户,状态,日期,类型,IP,备注--%>
                <tr class="search_bar">
                    <th style="width:8%;"><input type="text" placeholder="编号" /></th> 
                    <th style="width:12%;"><input type="text" placeholder="用户" /></th> 
                    <th style="width:15%;"></th> 
                    <th style="width:20%;"><input type="text" placeholder="IP" /></th> 
                    <th style="width:30%;"></th>
                    <th style="width:15%;"></th> 
                </tr>

                <tr class="header">
                    <th >编号</th> 
                    <th>用户</th> 
                    <th>操作描述</th> 
                    <th>IP</th> 
                    <th>IP注册信息</th>
                    <th >日期</th> 
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="dvMailLst" class="target">
        <div class="yui-g">
        <div class="yui-u first"><div class="pagination"></div></div>
        <div class="yui-u" style="text-align:right;">
            <input type="button" class="btnAdd" value="添加" /> 
            <input type="button" value="Search" class="btnSearch"  />
        </div>
        </div>
        <table class="main5">
            <thead>
                <tr class="search_bar">
                    <th style="width:5%;"><input type="text" placeholder="ID" /></th> 
                    <th style="width:15%;"></th> 
                    <th style="width:15%;"><input type="text" placeholder="用户名" /></th> 
                    <th style="width:20%;"><input type="text"  placeholder="EMail"  /></th> 
                    <th style="width:7%;">
                    <select>
                        <option value="">全部</option>
                        <option value="1" selected="selected" >激活</option>
                        <option value="0">失效</option>
                    </select>
                    </th> 
                    <th style="width:15%;"></th> 
                    <th style="width:13%;"></th> 
                    <th style="width:10%;">&nbsp;</th> 
                </tr>
                <tr class="header">
                    <th >ID</th> 
                    <th>名称</th> 
                    <th>用户名</th> 
                    <th>EMail</th> 
                    <th>状态</th> 
                    <th>服务器</th> 
                    <th>备注</th> 
                    <th >日期</th> 
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    </div>
    <div id="ft"> </div>
</div>



<div id="dvUserUpdate" class="gwinbill" style="width:380px;">
    <div class="close noheadclose"></div>
    <table class="head">
    <tr>
        <th style="width:15%;">登录名</th> <td style="width:35%;"><input type="text"  /> </td> 
        <th style="width:15%;">隐私</th> <td style="width:35%;">
        <select>
            <option value="1">仅公司内部可见</option>
            <option value="2">对外公开</option>
        </select>
        </td> 
    </tr>
    <tr>
        <th>姓</th><td><input type="text"  /></td> 
        <th>名</th><td><input type="text"  /></td> 
    </tr>

    <tr>
    <th>性别</th> <td>
    <select> 
        <option value="f">女</option>
        <option value="m">男</option>
    </select>
    </td> 
    <th>分部</th><td><select class="fb"></select></td> 
    </tr>
    <tr>
    <th>角色</th> <td><select class="role"></select></td> 
    <th>备注</th><td rowspan="2"><textarea placeholder="输入简短说明"></textarea></td> 
    </tr>
    <tr>
    <th>拼音码</th> <td><input type="text"  /></td> 
    </tr>
    </table>

    <div style="margin-top:5px;" class="toolbar">
        <input class="btnSave" type="button" value="保存" />
        <input type="button" value="关闭" class="close" />
    </div>
</div>

<div id="dvGroupRightLst" class="gwinbill" style="width:350px;">
    <div class="close noheadclose"></div>
    <div class="body">
    <table>
    <thead>
        <tr>
            <th style="width:55%;">功能</th> 
            <th style="width:15%;">查看</th> 
            <th style="width:15%;">修改</th> 
            <th style="width:15%;">导出</th> 
        </tr>
    </thead>
    <tbody></tbody>
    </table> 
    </div>
</div>


<div id="dvMailBoxUpdate" class="gwinbill" style="width:600px;">
    <div class="close"></div>
    <div class="toolbar">
        <input type="button" value="保存" class="bttnsave" />
        <input type="button" value="离开" class="close" />
        <input type="button" value="测试" class="btnCheck" />
    </div>

    <table class="head">
    <tr>
        <th style="width:15%;">您的姓名</th><td style="width:35%;"><input type="text"  placeholder="发邮件显示的名称" /></td>
        <th style="width:15%;">电子邮件地址</th><td style="width:35%;"><input type="text" placeholder="例如:susan@qq.com" /></td>
    </tr>

    <tr>
        <th>用户名</th><td><input type="text" placeholder="邮箱登录名：如susan@qq.com" title="邮箱登录名：如susan@qq.com" /></td>
        <th>密码</th><td style="text-align:left;"><input placeholder="邮箱登录密码" type="password"  /></td>
    </tr>

    <tr>
        <th>服务器</th><td><select class="servers"></select></td>
        <th>备注</th><td rowspan="2"><textarea></textarea></td>
    </tr>
    <tr>
    <th>状态</th>
    <td><select>
        <option value="0">失效</option>
        <option value="1">激活</option>
    </select></td>
    <th></th>
    </tr>
    </table>

    <div class="tips">
        请正确填写登录信息,含义与outlook邮箱设置一致。"用户名"是邮箱登录名，一般跟"电子邮件地址"一样。
        如果填写错误会引起系统不能正确接收邮件，如果修改了邮箱密码，这里要相应的修改过来。
    </div>
</div>



<div id="dvServer" class="gwin" style="width:360px;">
    <div class="title">邮箱服务器配置信息<a href="#"></a></div>
    <img alt="关闭"  src="../images/f/close.gif" class="close" />
    <table class="update">
    <tr><th style="width:15%;">POP3</th> <td style="width:40%;"></td> <th style="width:15%;">port</th> <td style="width:30%;"></td></tr>
    <tr><th>SMTP</th> <td></td> <th>port</th> <td></td></tr>
    <tr><th>加密</th> <td></td> <th>备注</th><td colspan="3"></td> </tr>
    </table>
</div>


<div id="dvIpBook" class="gwinbill" style="width:600px;">
    <div class="close noheadclose"></div>
    <div class="body">
        <div class="bar yui-g">
            <div class="yui-u first">
                <div class="pagination"></div>
            </div>
            <div class="yui-u" style="text-align:right;">
                <input type="text" class="txtIp" style="width:90px;" placeholder="输入IP" />
                <input class="btnSearch" type="button" value="查询" />
            </div>
        </div>
        <table>
        <thead >
            <tr> 
            <th style="width:23%;" >IP</th> 
            <th style="width:35%;">位置(名称)</th> 
            <th style="width:14%;">权限</th>
            <th style="width:18%;">作者/注册日期</th>
            <th style="width:5%;"></th> 
            <th style="width:5%;"></th> 
             </tr>
        </thead>
        <tbody></tbody>
        </table>
    </div>
</div>

<div id="dv_registerip" class="gwin">
    <img src="../images/f/close.gif" class="close" alt="关闭" />
    <div class="title">注册IP</div>    
    <label><span>IP</span><input type="text" class="txtIp"  /></label>
    <label><span>位置(名称)</span><input type="text" title="输入一个有意义的名字,如：武汉分公司办公室IP" /></label>
    <label><span>权限</span><select style="width:90px;"><option value="1">允许登录</option> <option value="0">拒绝登录</option> </select></label>
    <div>
        <input class="bttnsave" type="button" value="确定注册" />
        <input type="button" value="离开"  class="close" />
    </div>
</div>

<div class="contextMenu" id="myMenu_userlst">
    <ul>
        <li id="dm_userlst_rightlst"><img src="../images/menu/pohis.ico" />查看权限</li>
        <li id="dm_userlst_setdefaultpsw"><img src="../images/menu/pohis.ico" />重置密码</li>
        <li id="dm_userlst_edit"><img src="../images/menu/edit.ico" />修改</li>
        <li id="dm_userlst_del"><img src="../images/menu/delete.ico" />删除</li>
    </ul>
</div>
<div class="contextMenu" id="myMenu_mailbox">
<ul> 
    <li id="menu_mailbox_checkserver" title=""><img src="../images/menu/mailserver.ico" /> 服务器配置</li> 
    <li id="menu_mailbox_edit"><img src="../images/menu/edit.ico" /> 修改</li> 
    <li id="menu_mailbox_del"><img src="../images/menu/delete.ico" /> 删除</li> 
</ul> 
</div>
</body>
</html>