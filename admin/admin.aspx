<%@ Page Language="VB" AutoEventWireup="false" CodeFile="admin.aspx.vb" Inherits="admin_admin" %>

<!DOCTYPE html >
<html>
<head>
<title>错误报告</title>
<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/taobao/nav0906.css" rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />
<link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
<script src="../js/jquery-ui-1.8.10/js/jquery-1.4.4.min.js" ></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../js/jqueryplugin/jquery.pagination.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/admin/admin.js" ></script>
</head>

<body>
<div id="doc4">
    <div id="hd"></div>
    <div id="bd">

    <div id="dvErrLog" class="target">
        <div class="yui-gc">
            <div class="yui-u first"><div id="new_pagination" class="pagination"></div></div>
            <div class="yui-u" style="text-align:right;">
                <input type="button" class="btnClear" value="清空" />
                <button class="btnDel">删除</button>
                <button class="btnSearch">Search</button>
            </div>
        </div>
        <table class="main5">
        <thead>
        <tr class="search_bar">
            <th style="width:50%;"><input type="text" placeholder="内容" /></th>
            <th style="width:20%;"><input type="text" placeholder="来源"/></th>
            <th style="width:10%;"><input type="text" placeholder="作者" class="txtUser" /></th>
            <th style="width:10%;"><input type="text" class="txtCompany" placeholder="公司" /></th>
            <th style="width:7%;"></th>
            <th style="width:3%;">&nbsp;</th>
        </tr>
        <tr class="header">
            <th class="first">内容</th>
            <th >来源</th>
            <th >作者</th>
            <th >公司</th>
            <th >日期</th>
            <th class="last">操作</th>
        </tr>
        </thead>
        <tbody></tbody>
        </table>
    </div>

    <div id="dvRobots" class="target">
    <div class="yui-ge">
    <div class="yui-u first"><div class="pagination"></div></div>
    <div class="yui-u" style="text-align:right;">
        <input type="button" value="Search" class="btnSearch" />
    </div>
    </div>
    <table class="main5" >
    <thead>
    <tr class="header"> <%--ID,L日期,名称,网站ID,状态,型号计数,记录计数,控制位,备注名,间隔--%>
        <th style="width:120px;">更新时间</th>
        <th style="width:100px;">线程名</th>
        <th style="width:100px;">挖掘网站</th>
        <th style="width:150px;">状态</th>
        <th style="width:80px;">型号计数</th>
        <th style="width:80px;">记录计数</th>
        <th style="width:60px;">控制位</th>
        <th style="width:120px;">备注名</th>
        <th style="width:60px;">间隔(秒)</th>
    </tr>
    </thead>
    <tbody></tbody>
    </table>
    </div>

    <div id="dvRefurbishFactory" class="target">
    <table class="main5">
        <thead><tr class="header">
            <th style="width:20%;">编号</th>
            <th style="width:30%;">公司名</th>
            <th style="width:50%;">备注</th>
        </tr></thead>
        <tbody></tbody>
    </table>
    </div>

    <div id="dvPhoneNumber" class="yui-gc target">
        <div class="yui-u first numlst">
        <div class="yui-gc" style="width:100%;">
            <div class="yui-u first dvpagination"></div>
            <div class="yui-u" style="text-align:right;">
                <input type="button" value="更新" class="btnUpdate" title="批量更新" />  
                <input type="button" value="Search" class="btnSearch" /> 
            </div>
        </div> 
        <table class="main5" >
        <thead>
        <tr class="search_bar">
            <th  style="width:60px;" ><input type="text"  /></th>
            <th  style="width:60px;"><input type="text"  /></th>
            <th style="width:200px;"><input type="text" class="txtNum" /></th>
            <th  style="width:100px;">&nbsp;</th>
        </tr>
        <tr class="header">
            <th style="width:60px;">国家代号</th>
            <th style="width:60px;">区号</th>
            <th style="width:200px;">号码</th>
            <th style="width:100px;">操作</th>
        </tr>
        </thead>
            <tbody></tbody>
        </table> 
        </div>
        <div class="yui-u">
            <ul class="ulcontacts"></ul>
        </div>
    </div>

 </div>

    <div id="ft"></div>
</div>
</body>
</html>