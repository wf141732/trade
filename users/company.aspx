<%@ Page Language="VB" AutoEventWireup="false" CodeFile="company.aspx.vb" Inherits="users_company" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>公司设置</title>
<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />
<link href="../js/dwpe-code-public-latest/charting/css/visualize.css" rel="stylesheet"  />
<link href="../js/dwpe-code-public-latest/charting/css/visualize-light.css" rel="stylesheet"  />
<link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
<script src="../js/jquery-ui-1.8.10/js/jquery-1.4.4.min.js" ></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../ckeditor/ckeditor.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/dwpe-code-public-latest/charting/js/visualize.jQuery.js" ></script>
<script src="../js/users/company.js" ></script>
<script src="../js/jqueryplugin/jquery.pagination.js" ></script>
<style  >
body,html{background-color:#eee; margin:0;padding:0;}
#hd{ background-color:White; 
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        text-indent:20px;
        height:60px;
        padding:10px;
        }
#hd .company{font-size:30px; }
#hd .address{color:Gray;font-size:15px; }
.gwinbill .content {padding: 14px;}

a {text-decoration: none;color: #7a8e12;}
a:focus {outline: none;}
a:hover {color: #33420a;}
    
.lft_menu{min-height:500px;   
            margin-top:20px;
            background-color:White;      
        -moz-border-radius:10px;-webkit-border-radius:10px;}
.lft_menu ul{padding:10px;}    
.lft_menu ul li
{
    display:block;
        -moz-border-radius:5px;
        -webkit-border-radius:5px;
        padding:5px;
        margin-bottom:10px;
        cursor:pointer;
                }
.lft_menu ul li.on{background-color:#AA8839;color:White;-webkit-box-shadow: 0 0 7px #AA8839;}
.lft_menu ul li:hover{background-color:#AA8839;
                        -webkit-box-shadow: 0 0 7px #AA8839;
                        }       
#bd .body>.content{min-height:500px;width:100%;background-color:White; margin-top:20px;
                 -moz-border-radius:10px; -webkit-border-radius:10px;
        }        
#bd .content .target{display:none; padding:10px; }     
    

tbody td.modify{background:url(../images/edit.gif) no-repeat center center; cursor:pointer;}

fieldset {padding:10px;margin:10px;color:#333; border:#06c dashed 1px;}
legend {color:#06c;font-weight:800; background:#fff;} 

#dvwebreg{width:320px;}
#dvwebreg .operate input[type=text]{}


#dvoutput{padding:25px;}
#dvoutput .itm
{
    width:300px;display:inline-block;margin-right:20px;margin-bottom:20px;padding:15px;
    min-height:150px;vertical-align:top;
  background: -webkit-gradient(linear,0% 0%, 0% 100%, from(#EFEFEF), to(#aaa));
    -moz-border-radius:10px; -webkit-border-radius:10px;
             -webkit-box-shadow: 5px 5px 7px gray;
    }
#dvoutput .itm h4{line-height:30px;}    
#dvoutput .toolbar{margin-top:15px;}
#dvoutput .toolbar input[type=button]{min-width:70px;height:25px;}
#dvoutput .date_range input[type=text]{width:90px;}
#dvoutput .date_range{margin-bottom:10px;}
#dvoutput .bar{min-height:40px;}

#dvbbs{padding:30px 70px;}
#dvbbs table{width:90%;}
#dvbbs table thead a{margin-left:15px;}
#dvbbs table .name{line-height:25px;font-weight:bold;}
#dvbbs table .name b{color:Gray;}
#dvbbs table .comment{color:Gray;}
#dvbbs table tbody td{border-bottom:1px dotted gray;padding:10px 0;}
#dvbbs table tbody tr{cursor:pointer;}
#dvbbs table tbody tr.selected{background-color:#66CCCC!important;}
#dvbbs .topclss table tbody tr:hover{background-color:#ACE6E6;}

.bbsupdate{width:300px;}
.bbsupdate table td{text-align:left;}
.bbsupdate .toolbar input[type=button]{width:35%;margin-right:10px;height:25px;}


#dvCompanyBaseInfo .gwinbill{
    border:0;
    position:static;
               /*css3属性*/
         -moz-border-radius:0;
         -webkit-border-radius:0;
        -webkit-box-shadow: 0px 0px 0px white;
        display:block;
    }
#dvCompanyBaseInfo .body table{display:none;}
#dvCompanyBaseInfo .body table tbody textarea{height:40px;}

#dvfuncmodule select{width:100%;
                     height:300px;
                     }
#dvfuncmodule input{width:100%;margin-bottom:20px;}                     
</style>	
</head>
<body>


<div id="doc4" class="yui-t1">
<div style="height:5px;"></div>

<div id="hd">
    <div class="company"></div>
    <div class="address"></div>
</div>

<div id="bd">
    <div class="yui-b" >
        <div class="lft_menu">
            <ul>
                <li _id="CompanyBaseInfo">基本设置</li>
                <li _id="groupauthorization">权限设置</li>
                <li _id="pts">平台设置</li>
                <li _id="output">导出数据</li>
                <li _id="bbs">内部论坛</li>
                <li _id="funcmodule">功能模块</li>
                <li _id="dailyAccount">银行(财务)账户</li>
                <li _id="mailServer">邮件服务器</li>
                <li _id="topConfig">同步淘宝信息配置</li>
            </ul>
         </div>
    </div> 
    <div id="yui-main"><div class="yui-b body">
    <div class="content" >
        <div id="dvCompanyBaseInfo" class="target">
            <div class="dvLock">
                <div id="dvRefurbish"></div>
                <label class="iplock" style="display:block;margin:10px 0;"><input type="checkbox"  />只有注册IP才能登录本系统(公司管理员账户不受此条件限制)</label>
                <div class="ptlock">
                    <div style="display:block;">选择限制类型严格限制平台类型(用户只能操作授权平台)</div>
                    <label><input type="checkbox" value="0" />不限制平台</label>
                    <label><input type="checkbox" value="1" />销售报价</label>
                    <label><input type="checkbox" value="2" />采购询价</label>
                    <label><input type="checkbox" value="4" />销售单</label>
                    <label><input type="checkbox" value="8" />采购单</label>
                    <input type="button" class="btnSave" value="确定" />
                </div>
            </div>

            <div class="gwinbill">
            <table class="head">
                <tr>
                    <th style="width:9%;">公司编号</th><td style="width:25%;"><input type="text" disabled="disabled" /></td>
                    <th style="width:9%;">货币</th><td style="width:24%;">
                    <select>
                        <option value="0" selected="selected">多货币模式</option>
                        <option value="1">美元</option>
                        <option value="2">日元</option>
                        <option value="3">人民币</option>
                        <option value="4">欧元</option>
                    </select></td>
                    <th style="width:9%;">级别</th><td style="width:24%;"><select disabled="disabled">
                        <option value="0">非会员</option>
                        <option value="1">普通会员</option>
                        <option value="2">高级会员</option>
                    </select></td>
                </tr>
                <tr>
                    <th>公司名</th><td><input type="text" /></td>
                    <th>简称</th><td><input type="text" /></td>
                    <th>拼音码</th><td><input type="text" /></td>
                </tr>

                <tr>
                    <th>现货分享</th><td><select>
                        <option value="0">不共享</option>
                        <option value="1">会员间共享</option>
                    </select></td>
                    <th>货位管理</th><td><select>
                        <option value="0">不执行货位管理</option>
                        <option value="1">执行货位管理</option>
                    </select></td>
                    <th>默认货位</th><td><input type="text" class="txtStockLocal" /></td>
                </tr>
                <tr>
                    <th>对外平台</th><td><select class="cmbPts"></select></td>
                    <th>网址</th><td><input type="text"  /></td>
                    <th>主营</th><td rowspan="2"><textarea></textarea></td>
                </tr>
                <tr>
                    <th>运营模式</th><td><select disabled="disabled">
                        <option value="0">只做国内（或者主要国内）</option>
                        <option value="1">只做国外（或者主要做外单）</option>
                        <option value="2">国内国外都做</option>
                        <option value="3">生产工厂</option>
                        <option value="4">芯片翻新工厂</option>
                    </select></td>
                    <th>柜台</th><td><input type="text" /></td>
                    <th></th>
                </tr>
            </table>
            <div class="toolbar">
                <input type="button" class="btnSave" value="保存" />
                <input type="button" class="btnBillInfo" value="添加发票信息" />
            </div>

            <div class="body">
                <div class="bar yui-gc">
                    <div class="yui-u first"  style="text-align:left;">
                        <a href="javascript://" index="0" class="on">地址</a>
                        <a href="javascript://" index="1">快递账号</a>
                        <a href="javascript://" index="2">公司分部</a>
                        <a href="javascript://" index="3">分组</a>
                    </div>
                    <div class="yui-u" style="text-align:right;">
                        <a href="javascript://" class="btnCopyGroup" style="display:none;" title="从管理公司复制分组相应权限也一起复制过来" >复制默认分组</a>
                        <a href="javascript://" class="btnNewLine">新行</a>
                        <a href="javascript://" class="btnRefresh">刷新</a>
                    </div>
                </div>
                <table><thead><tr>
                    <th style="width:8%;" >编号</th>
                    <th style="width:40%;">地址</th>
                    <th style="width:15%;">简称</th>
                    <th style="width:10%;">类型</th>
                    <th style="width:17%;">备注</th>
                    <th style="width:10%;" ></th>
                </tr></thead><tbody></tbody></table>
                <table><thead><tr>
                    <th style="width:10%;" >编号</th>
                    <th style="width:20%;">快递</th>
                    <th style="width:60%;">账号</th>
                    <th style="width:10%;" ></th>
                </tr></thead><tbody></tbody></table>
                <table><thead><tr>
                    <th style="width:10%;" >编号</th>
                    <th style="width:25%;">名称</th>
                    <th style="width:35%;">备注</th>
                    <th style="width:10%;">用户数</th>
                    <th style="width:10%;" ></th>
                </tr></thead><tbody></tbody></table>

                <table><thead><tr>
                    <th style="width:10%;" >编号</th>
                    <th style="width:25%;">名称</th>
                    <th style="width:35%;">备注</th>
                    <th style="width:10%;">用户数</th>
                    <th style="width:10%;" ></th>
                </tr></thead><tbody></tbody></table>
            </div>
            </div>
        </div>

        <div id="dvgroupauthorization" class="target">
            <div  class="tbar yui-g">
                <div class="yui-u first" style="text-align:left;">
                    <a href="javascript://" class="btnSpeRight">管理特殊权限</a>
                </div>
                <div class="yui-u" style="text-align:right;">
                    <input type="button" class="btnAdd" value="添加" title="选择组名和功能" />
                    <input type="button" class="btnSave" value="保存" />
                    <input type="button" class="btnSearch" value="Search" />
                </div>
            </div>
            <table class="main5"><thead>
            <tr class="search_bar">
                <th style="width:8%;"><input type="text" placeholder="编号" /></th>
                <th style="width:17%;"><select class="cmbGroups"></select></th>
                <th style="width:25%;"><select class="cmbCode"></select></th>
                <th style="width:15%;">
                <select>
                    <option value="">全部</option>
                    <option value="0">无权限</option>
                    <option value="1">有权限</option>
                </select>
                </th>
                <th style="width:15%;">
                <select>
                    <option value="">全部</option>
                    <option value="0">无权限</option>
                    <option value="1">有权限</option>
                </select>
                </th>
                <th style="width:15%;"><input type="text" placeholder=">0" /></th>
                <th style="width:5%;"></th>
            </tr>

            <tr class="header">
                <th>编号</th>
                <th>组名</th>
                <th>功能</th>
                <th>查看</th>
                <th>修改</th>
                <th>导出数量</th>
                <th></th>
            </tr>
            </thead><tbody></tbody></table>
        </div>

        <div id="dvpts" class="target">
            <h3>
                <a href="javascript://" class="bttn btnAdd">添加平台</a>
                <label>状态
                    <select class="cmbState">
                        <option value="1" selected="selected" >激活</option>
                        <option value="0">失效</option>
                    </select>
                </label>
            </h3>
 
            <table class="main5"> 
            <thead><tr class="header">
            <th style="width:8%;">ID</th> 
            <th style="width:20%;">平台</th> 
            <th style="width:28%;">对外名</th> 
            <th style="width:8%;" title="自动生成PI使用">银行费用</th>
            <th style="width:13%;">在线平台</th> 
            <th style="width:15%;">PI#生成规则</th> 
            <th style="width:5%;">状态</th>
            <th style="width:3%;"></th> <%--修改--%>
            </tr></thead>
            <tbody></tbody>
            </table>
        </div> 

        <div id="dvoutput" class="target">
            <div class="itm rfq">
                <h4>导出询价记录</h4>
                <div class="bar">
                    <div class="date_range"></div>
                    <div>
                        <label><input type="radio" name="rfq_type" value="0" checked="checked" />销售报价</label>
                        <label><input type="radio" name="rfq_type"  value="1" />采购询价</label>
                    </div>
                </div>
                <div class="toolbar">
                    <input type="button" class="action" value="确定导出" />
                </div>
            </div>

            <div class="itm">
                <h4>导出订单记录</h4>
                <div class="bar">
                    <div class="date_range"></div>
                </div>
                <div class="toolbar"><input type="button" value="确定导出" /></div>
            </div>
            
            <div class="itm">
                <h4>导出客户、供货商信息</h4>
                <div class="bar">
                <div>
                    <label><input type="radio" name="rfq_crm" value="0" checked="checked" />公司信息</label>
                    <label><input type="radio" name="rfq_crm"  value="0" />联系人信息</label>
                    <label><input type="radio" name="rfq_crm"  value="0" />联系人和联系方式</label>
                </div>
                </div>
                <div class="toolbar"><input type="button" value="确定导出" /></div>
            </div>

            <div class="itm">
                <h4>导出本公司用户信息</h4>
                <div class="bar"></div>
                <div class="toolbar"><input type="button" value="确定导出" /></div>
            </div>
        </div>

        <div id="dvbbs" class="target">
            <div class="yui-g">
                <div class="yui-u first topclss">
                    <table><thead><tr><th style="width:100%;">主板块<a href="javascript://" class="bttnadd">添加主板块</a></th></tr></thead><tbody></tbody></table>
                </div>
                <div class="yui-u subclss">
                    <table><thead><tr><th style="width:100%;">子版块<a href="javascript://" class="bttnadd">添加子板块</a></th></tr></thead><tbody></tbody></table>
                </div>
            </div>
        </div>

        <div id="dvfuncmodule" class="target">
            <table style="width:70%;margin:50px 0 0 50px;">
                <tr>
                    <td style="width:40%;">
                        <select multiple="multiple"></select>
                    </td>
                    <td style="width:20%;padding:5px;">
                        <input type="button" value="添加>>>" class="btnAdd" />
                        <input type="button" value="删除<<<"  class="btnDel" />
                    </td>
                    <td style="width:40%;">
                        <select multiple="multiple"></select>
                    </td>
                </tr>
            </table>
        </div>


        <div id="dvdailyAccount" class="target">
            <div style="text-align:left;">
                <input type="button" class="bttnAdd" value="添加" />
                <a href="javascript://" class="btnShowSalary">员工固定工资</a>
                <a href="javascript://" class="btnShowSalaryItem">管理工资项目</a>
                <a href="javascript://" class="btnIniSalaryItem" title="公司第一次使用时使用">初始化工资项</a>
            </div>
            <table class="main5" >
            <thead>
                <tr class="search_bar">
                    <th style="width:5%;"><input type="text" placeholder="" /></th> 
                    <th style="width:28%;"><input type="text" placeholder="" /></th> 
                    <th style="width:8%;"></th> 
                    <th style="width:7%;">
                        <select>
                            <option value="">全部</option>
                            <option value="0">激活</option>
                            <option value="1">失效</option>
                        </select>
                    </th> 
                    <th style="width:5%;"></th> 
                    <th style="width:5%;"></th> 
                    <th style="width:8%;"><select>
                            <option value="">全部</option>
                            <option value="0">现金账户</option>
                            <option value="1">银行存款</option>
                            <option value="2">销售账户</option>
                    </select></th> 
                    <th style="width:22%;"><input type="button" class="btnSearch" value="Search" /></th> 
                    <th style="width:8%;"></th> 
                    <th style="width:4%;"></th> 
                </tr>
                <tr class="header">
                    <th>编号</th> 
                    <th>名称(账号)</th> 
                    <th>余额</th> 
                    <th>状态</th> 
                    <th>权限</th> 
                    <th>平台</th> 
                    <th>账户类型</th> 
                    <th>说明</th> 
                    <th>日期</th> 
                    <th></th> 
                </tr>
            </thead>
            <tbody></tbody>
            </table>           
        </div>

        <div id="dvmailServer" class="target">
            <div style="text-align:right;">
                <input type="button" class="bttnAdd" value="添加邮件服务器" /> 
            </div>
            <table class="main5">
                <thead>
                    <tr class="header">
                        <th style="width:14%;">名称</th> 
                        <th style="width:16%;">POP3</th> 
                        <th style="width:16%;">SMTP</th> 
                        <th style="width:5%;">加密</th> 
                        <th style="width:5%;">状态</th> 
                        <th style="width:5%;">共享</th> 
                        <th style="width:20%;">备注</th> 
                        <th style="width:13%;">日期</th> 
                        <th style="width:3%;"></th> 
                        <th style="width:3%;"></th> 
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <div id="dvtopConfig" class="target">
            <fieldset class="dvTopArea">
                 <legend>发货地址</legend>          
                <div><select class="cmbProvince"></select><select class="cmbCity"></select></div>
                <div><input type="button" value="确定修改" class="btnSave" /></div>
            </fieldset>
            <fieldset class="dvCompanyProfile">
                <legend>公司简介</legend>
                <textarea id="txtContent"></textarea>
                <input type="button" value="保存" class="btnSave" />
            </fieldset>
        </div>

    </div>
    </div>
</div>
<div id="ft"></div>
</div>    
</div>

<div id="dvsalary" class="gwinbill" style="width:700px;">
    <img alt="关闭" src="../images/common/close.png" class="close" />
    <div class="body">
        <div class="bar yui-gd">
            <div class="yui-u first">
                <div class="pagination"></div>
            </div>
            <div class="yui-u" style="text-align:right;">
            <input type="text" class="txtUser" style="width:90px;" placeholder="用户" />
            <select class="cmbItem" style="width:80px;"></select>
            <input type="button" class="btnSearch" value="查询" />
            <a href="javascript://" class="btnAdd">添加</a>
            <a href="javascript://" class="btnSave">保存</a>
            </div>
        </div>
        <table><thead><tr>
            <th style="width:10%;" >编号</th>
            <th style="width:14%;">用户</th>
            <th style="width:14%;">工资项</th>
            <th style="width:10%;">金额</th>
            <th style="width:10%;">起算日期</th>
            <th style="width:10%;">截止日期</th>
            <th style="width:20%;">备注</th>
            <th style="width:7%;">类型</th>
            <th style="width:5%;" ></th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>

<div id="dvSalaryItem" class="gwinbill" style="width:450px;">
    <img alt="关闭" src="../images/common/close.png" class="close" />
    <div class="body">
        <div class="bar" style="text-align:left;">
            <a href="javascript://" class="btnNewLine">添加新行</a>
        </div>
        <table><thead><tr>
            <th style="width:10%;" >编号</th>
            <th style="width:30%;">名称</th>
            <th style="width:10%;">类型</th>
            <th style="width:35%;">备注</th>
            <th style="width:15%;" ></th>
        </tr></thead><tbody></tbody></table>
    </div>

</div>

<div id="dvMailServerUpdate" class="gwin" style="width:550px;">
    <div class="title">添加/修改邮箱服务器</div>
    <img alt="关闭" src="../images/f/close.gif" class="close" />
    <table class="update">
    <tr>
        <th style="width:15%;">名称</th><td style="width:35%;" contenteditable="true"></td>
        <th style="width:15%;">网址</th><td style="width:35%;" contenteditable="true"></td>
    </tr>

    <tr>
        <th>pop3</th><td contenteditable="true"></td>
        <th>pop3端口</th><td contenteditable="true"></td>
    </tr>

    <tr>
        <th>smtp</th><td contenteditable="true"></td>
        <th>smtp 端口</th><td contenteditable="true"></td>
    </tr>

    <tr>
        <th>加密方式</th><td contenteditable="true"></td>
        <th>状态</th>
        <td>
            <select>
                <option value="0">失效</option>
                <option value="1">激活</option>
            </select>
        </td>
    </tr>
    <tr>
        <th>备注</th><td contenteditable="true"></td>
        <th>共享</th>
        <td>
            <select>
                <option value="0">私有</option>
                <option value="1">共享</option>
            </select>
        </td>
    </tr>
    </table>
    <div class="toolbar">
        <input type="button" value="保存" class="bttnsave" />
        <input type="button" value="离开" class="close" />
    </div>
</div>


<div id="dvwebreg" class="gwin" style="width:380px;">
    <img src="../images/f/close.gif" class="close" alt="关闭"  />
    <div class="title" style="margin-bottom:10px;">添加交易平台账号密码(用于自动登录和下载询价)</div>
    <div class="upd">
    <input type="text" style="width:100px;"  title="登录名，netComponents 公司代号和登录名间用'|'分隔" />
    <input type="password" style="width:80px;" title="密码" />
    <select style="width:70px;" class="cmbWebType"></select>
    <input type="button" value="修改" class="bttnModify" onclick="webreg.update(this);" />
    <input type="button" value="添加" class="bttnAdd" onclick="webreg.add(this);" />
    </div>
    <table class="main5">
    <thead><tr class="header">
        <th style="width:35%;">登录名</th>
        <th style="width:21%;">登录密码</th>
        <th style="width:30%;">网站类型</th>
        <th style="width:7%;"></th>
        <th style="width:7%;"></th>
    </tr></thead>
    <tbody></tbody>
    </table>
</div>


<div id="dvupdate_top" class="gwin bbsupdate">
    <table class="update">
    <tr><th style="width:20%;">名称</th> <td style="width:80%;"> <input type="text" /> </td> </tr>
    <tr class="type"><th>隐私</th> <td >
    <select style="width:80px;">
        <option value="1">公开</option>
        <option value="2" selected="selected">内部</option>
    </select>
    </td> </tr>
    <tr><th>说明</th> <td><textarea style="width:100%;height:50px;"></textarea> </td> </tr>
    </table>
    <div class="toolbar"><input type="button" value="确定保存" class="bttnsave" /><input type="button" class="close" value="离开" /></div>
</div>

<div id="dvupdate_sub" class="gwin bbsupdate">
    <table class="update">
    <tr><th style="width:20%;">名称</th> <td style="width:80%;"> <input type="text" /> </td> </tr>
    <tr><th>说明</th> <td><textarea style="width:100%;height:50px;"></textarea> </td> </tr>
    </table>
    <div class="toolbar"><input type="button" value="确定保存" class="bttnsave" /><input type="button" class="close" value="离开" /></div>
</div>

<div id="dvAccountPt" class="gwinbill" style="width:500px;">
    <img alt="关闭" src="../images/common/close.png" class="close" />
    <div class="body">
        <div class="bar" style="text-align:left;">
            平台<select style="width:150px;"></select><input type="button" class="btnAdd" value="添加" />
        </div>
        <table><thead><tr>
            <th style="width:30%;" >平台</th>
            <th style="width:30%;">作者</th>
            <th style="width:30%;">日期</th>
            <th style="width:10%;" >操作</th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>

<div id="dvDailyAccount" class="gwinbill" style="width:500px;">
    <div class="close noheadclose"></div>
    <table class="head">
    <tr>
        <th style="width:10%;">名称</th><td style="width:40%" ><input type="text" placeholder="输入银行账号"  /></td>
        <th style="width:15%;">期初余额</th><td style="width:35%" ><input type="number" /></td>
    </tr>
    <tr><th>账号</th><td><input type="text" placeholder="银行账号" /></td><th>备注</th><td rowspan="3"><textarea placeholder="输入简短说明"></textarea></td></tr>
    <tr><th>类型</th><td><select>
        <option value="0">现金账户</option>
        <option value="1">银行存款</option>
        <option value="2">销售账户</option>
    </select></td>
    <th></th>
    </tr>
    <tr><th>状态</th><td>
        <select>
            <option value="0">激活</option>
            <option value="1">失效</option>
        </select>
    </td><th></th></tr>
    </table>
    <div class="toolbar">
        <input type="button" value="保存" class="bttnSave" />
        <input type="button" value="离开" class="close" />
    </div>
</div>

<div id="dvDailyAccountRight" class="gwinbill" style="width:500px;"> 
    <div class="close noheadclose"></div>
    <div class="body">
        <div class="bar" style="text-align:left;">指定账户<b></b>的权限
        <input type="text" style="width:100px;" placeholder="输入用户" class="txtUser" />

        <select class="cmbRight" style="width:70px;">
            <option value="0">无权限</option>
            <option value="1">查看</option>
            <option value="2">修改</option>
            <option value="3">审核</option>
        </select>
        <input class="bttnAdd" type="button" value="添加" />
        </div>
        <table><thead><tr>
            <th style="width:15%;" >编号</th>
            <th style="width:60%;">用户名</th>
            <th style="width:15%;">权限</th>
            <th style="width:10%;" ></th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>


<div id="uPingtai" class="gwin" style="width:400px;">
    <img src="../images/f/close.gif" class="close" alt="关闭" />
    <div class="title">添加平台</div>
    <div>
    <table class="update">
        <tr><th style="width:25%;">平台</th><td style="width:75%;"><input type="text" title="平台名"  /></td></tr>
        <tr><th>对外名</th><td><input type="text" title="该平台对外的名称，主要用于业务向客户发送录价页面" /></td></tr>
        <tr><th>银行费用</th><td><input type="text" title="银行费用，用于自动生成PI" /></td></tr>
        <tr><th>PI#前缀</th><td><input type="text" title="银行费用，用于自动生成PI" /></td></tr>
        <tr><th>PI#生成规则</th><td>
            <select>
                <option value="0">系统编号(与订单编号一致)</option>
                <option value="1">序号(每生成一次递增一)</option>
                <option value="2">年月日+序号(序号每日早7点清零)</option>
                <option value="3">年月+序号(序号每月清零)</option>
            </select>
        </td></tr>
    </table>
    </div>
    <div class="toolbar">
        <input class="bttnsave" type="button" value="保存" />
        <input class="close" type="button" value="取消" />
    </div>
</div>


<div id="dvSpeRight" class="gwinbill" style="width:500px;">
    <div class="close noheadclose"></div>
    <div class="body">
        <div class="bar" style="text-align:left;">
            <label>角色<select class="cmbRoles" style="width:100px;"></select></label>
            <label><select>
                <option value="0">销售(退货)单</option>
                <option value="1">采购(退货)单</option>
                <option value="2">销售报价</option>
                <option value="3">采购询价</option>
            </select></label>
            <label><select class="cmbSpeNames" style="width:90px;">
                <option value="0">公司名</option>
                <option value="1">价格</option>
            </select></label>
            <input type="button" class="bttnAdd" value="添加" />
            屏蔽敏感信息
        </div>
        <table><thead><tr>
            <th style="width:30%;" >角色</th>
            <th style="width:30%;">模块</th>
            <th style="width:30%;">类型</th>
            <th style="width:10%;" ></th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>

<div id="dvCoBillInfo" class="gwinbill" style="width:600px;">
    <img src="../images/common/close.png" class="close" alt="关闭" />
    <div class="toolbar"><input type="button" class="btnSave" value="保存" /></div>
    <div class="content">
        <table class="head">
            <tr>
                <th style="width:15%;">公司名(中文)</th><td style="width:35%;"><input type="text"  /></td>
                <th style="width:10%;">电话</th><td style="width:40%;"><input type="text"  /></td>
            </tr>
            <tr>
                <th>公司名(英文)</th><td><input type="text"  /></td>
                <th>传真</th><td><input type="text"  /></td>
            </tr>
            <tr>
                <th>邮件</th><td><input type="text"  /></td>
                <th>网址</th><td><input type="text"  /></td>
            </tr>
            <tr>
                <th>地址</th><td colspan="3"><input type="text"  /></td>
            </tr>
        </table>
        <div class="body">
            <div class="bar" style="text-align:left;">
                <a href="javascript://" class="btnNewLine">添加条款</a>
                <a href="javascript://">添加默认条款</a>
            </div>
            <table><thead><tr>
                <th style="width:10%;">编号</th>
                <th style="width:80%;">条款</th>
                <th style="width:10%;"></th>
            </tr></thead><tbody></tbody></table>
        </div>
    </div>
</div>

<div id="dvUserOfGroup" class="gwinbill" style="width:450px;">
    <div class="close noheadclose"></div>
    <div class="body">
        <table><thead><tr>
            <th style="width:10%;">编号</th>
            <th style="width:40%;">用户名</th>
            <th style="width:40%;">组名</th>
            <th style="width:10%;">操作</th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>



</body>
</html>
