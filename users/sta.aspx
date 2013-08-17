<%@ Page Language="VB" AutoEventWireup="false" CodeFile="sta.aspx.vb" Inherits="users_sta" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>会员公司统计</title>
<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/tmp.css" rel="stylesheet"  />
<link href="../css/details.css" rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />

<link href="../js/dwpe-code-public-latest/charting/css/visualize.css" rel="stylesheet"  />
<link href="../js/dwpe-code-public-latest/charting/css/visualize-light.css" rel="stylesheet"  />
<link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
<script src="../js/jquery-ui-1.8.10/js/jquery-1.4.4.min.js" ></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../js/jqueryplugin/jquery.pagination.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/dwpe-code-public-latest/charting/js/visualize.jQuery.js" ></script>
<script src="../js/users/sta.js" ></script>
<style  >
.commentlist .comment_content_wrapper {  width: 320px;} /* 评论宽度 */
#dv_static table thead a{color:White;cursor:pointer;}
#dv_service table tbody tr{cursor:pointer;}
#dv_service table tbody tr:hover{color:Red;}
#dv_service .dv_submit textarea{padding:5px; width:96%;height:50px;}
#dv_service .dv_submit input[type=button]{height:25px;font-size:large;width:120px;}

#dv_cusservice{width:200px;padding:10px;}
#dv_cusservice .content{margin-top:10px;}

.main5 tbody{font-size:small;}
.main5 tbody td.company_s0{font-weight:bold;color:Gray;text-decoration:line-through;}
.main5 tbody td.company_s1{}
.main5 tbody td.company_s2{font-weight:bold;color:Red;}
.main5 tbody td.alike:hover{text-decoration:underline;}
.main5 tbody td.alike{cursor:pointer;}
#dv_register table input[type=text]{width:100%;padding:1px;}
#dv_register table tr{height:28px;}
#dv_register table th{text-align:right;}
</style>	
</head>
<body>

<div id="doc4" class="yui-t1">
<div style="height:5px;"></div>
<div id="hd">
    <div class="company">会员管理</div>
    <div class="address">统计信息、客服代表指定</div>
</div>
<div id="bd">
    <div class="yui-b" >
        <div class="lft_menu">
            <ul>
                <li _id="static">会员统计(静态)</li>
                <li _id="service">客服代表</li>
                <li _id="register">会员注册</li>
                <li _id="currency">汇率调整</li>
            </ul>
         </div>
    </div>
    <div id="yui-main"><div class="yui-b body">
    <div class="content" >
        <div id="dv_static" class="target">
            <div class="yui-g">
                <div class="yui-u first"><div class="pagination"></div></div>
                <div class="yui-u" style="text-align:right;"><a href="javascript://" class="restatic">重新统计</a></div>
            </div>
            <table class="main5">
                <thead><tr class="header">
                    <th style="width:5%;">序号</th>
                    <th style="width:24%;">会员公司</th>
                    <th style="width:13%;"><a _value="激活用户">激活/用户数</a></th>
                    <th style="width:6%;"><a _value="分部">分部</a></th>
                    <th style="width:6%;"><a _value="平台">平台</a></th>
                    <th style="width:8%;"><a _value="现货">现货</a></th>
                    <th style="width:7%;"><a _value="登录">登录</a></th>
                    <th style="width:8%;"><a _value="询价">询价</a></th>
                    <th style="width:8%;"><a _value="订单">订单</a></th>
                    <th style="width:8%;"><a _value="图片">图片</a></th>
                    <th style="width:7%;"><a _value="测试">测试</a></th>
                </tr></thead>
                <tbody></tbody>
            </table>
        </div>

        <div id="dv_service" class="target">
        <div class="yui-g">
            <div class="yui-u first">
                <div class="yui-g">
                    <div class="yui-u first"><div class="pagination"></div></div>
                    <div class="yui-u" style="text-align:right;">
                        <input type="text" class="txtCompany" placeholder="客户公司" style="width:80px;" />
                        <select class="cmbusers" style="width:60px;"></select>
                        <input type="button" class="bttnsearch" value="查询" />
                    </div>
                </div>
                <table class="main5">
                    <thead><tr class="header">
                        <th style="width:60%;">会员公司</th>
                        <th style="width:20%;">客服代表</th>
                        <th style="width:20%;">注册日期</th>
                    </tr></thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="yui-u">
                <div class="yahei">
                    <ol class="commentlist" ></ol>
                    <div class="dv_submit">
                        <textarea class="txtcomment radius5" title="每次培训情况请及时记下" placeholder="每次培训情况请及时记下"></textarea>
                        <div style="padding-top:5px;"><input type="button" class="bttnsave" value="发表培训日志" /></div>
                    </div>
                </div>
            </div>
        </div>
        </div> 

        <div id="dv_register" class="target">
            <div class="yui-g">
                <div class="yui-u first">
                    <table style="width:100%;">
                        <tr><th style="width:20%;">公司名</th><td style="width:80%;"><input class="txtCompany" placeholder="根据提示选择，如不存在先到公司池添加" type="text" /></td></tr>
                        <tr><th>备注</th><td><input type="text" placeholder="简短说明，如：某某推广" /></td></tr>
                        <tr><th>性质</th><td>
                            <select>
                                <option value="0">IC分销售(只做国内)</option>
                                <option value="1">IC分销售(只做国外)</option>
                                <option value="2" selected="selected">IC分销售(国内国外都做)</option>
                                <option value="3">生产工厂</option>
                                <option value="4">IC翻新工厂</option>
                            </select>
                        </td></tr>
                        <tr><td colspan="2" style="text-align:center;">
                        <input class="btnReg" type="button" value="注册" style="width:90px;height:30px;" /></td></tr>
                    </table>
                </div>
                <div class="yui-u">
                    <div>
                        <input type="text" class="txtkey" placeholder="可以使用%,如：%华联"  /><input type="button" value="查询" class="btnSearch" />
                        <ul class="ulcompany"></ul>
                    </div>
                    <div class="dvInfo"></div>
                </div>
            </div>
            
        </div>

        <div id="dv_currency" class="target">
            <table class="main5" style="width:300px;">
                <thead><tr>
                    <th style="width:40%;">货币</th>
                    <th style="width:40%;">跟人民币汇率</th>
                    <th style="width:20%;"></th>
                </tr></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    </div>
</div>
<div id="ft"></div>
</div>    
</div>

<div id="dv_cusservice" class="gwin">
    <img src="../images/close3.gif" class="close" alt="关闭"  />
    <div class="title">指定客服代表</div>
    <div class="content">
        <select style="width:120px;"></select>
        <input type="button" class="bttnsave" value="确定" />
    </div>
</div>


<div id="dvCompanySet" class="gwinbill" style="width:230px;">
    <div class="close noheadclose"></div>
    <div class="body">
        <div class="bar">设定会员公司</div>
        <select style="width:90%;">
            <option value="0">冻结</option>
            <option value="1">普通会员</option>
            <option value="2">高级会员</option>
        </select>
    </div>
    <div class="toolbar">
        <input type="button" class="bttnSave" value="确定保存" />
        <input type="button" class="close" value="离开" />
    </div>
</div>

<div id="dvViewLog" class="gwinbill" style="width:400px;">
    <div class="close"></div>
    <div class="title"><b></b>最近20条登录记录</div>
    <div class="body">
        <table><thead><tr class="header">
            <th style="width:30%;">用户</th>
            <th style="width:50%;">日期</th>
            <th style="width:20%;">登录类型</th>
        </tr></thead> <tbody></tbody> </table>
    </div>
</div>

</body>
</html>