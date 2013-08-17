<%@ Page Language="VB" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>回收站</title>
<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/taobao/nav0906.css" rel="stylesheet"  />
<link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />
<script src="../js/jquery-1.6.2.min.js"></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/jqueryplugin/jquery.pagination.js" ></script>
<script src="../js/users/rubbish.js"></script>

<style >
    #dvTopToolbar a.on{color:White;background-color:Red;}
</style>
</head>
<body>

<div id="doc4">
<div id="hd"></div>
<div id="bd">
<div class="yui-b">
<div id="dvTopToolbar">
    <a href="javascript://" _t="RfqCaigou" _id="0">采购询价</a>
    <a href="javascript://" _t="RfqSale" _id="1">销售报价</a>
    <a href="javascript://" _t="OrderSo" _id="2">销售单</a>
    <a href="javascript://" _t="OrderPo" _id="3">采购单</a>
</div>

<div id="dvRfqCaigou" class="target">
    <div class="yui-gd" style="width:100%;" >
        <div class="yui-u first" ><div class="pagination" style="float:left;"></div></div>
        <div class="yui-u" class="dvWhere" style="text-align:right;">
            <span class="date"></span>
            <input type="button" class="btnSearch" value="Search" />
        </div>
    </div>
    <table class="main5">
    <thead>
    <tr class="search_bar">
        <th style="width:3%;"></th>
        <th style="width:8%;"><input type="text" placeholder="编号" /></th>
        <th style="width:25%;"><input type="text" placeholder="型号"  /></th>
        <th style="width:8%;"></th>
        <th style="width:10%;"><select class="cmbPts"></select></th>
        <th style="width:10%;"><input type="text" placeholder="添加者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:10%;"><input type="text" placeholder="删除者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:6%;"></th>
    </tr>
    <tr class="header"> 
        <th><input type="checkbox"/></th>
        <th>编号</th>
        <th>型号</th>
        <th>数量</th>
        <th>平台</th>
        <th>添加者</th>
        <th>添加日期</th>
        <th>删除者</th>
        <th>删除日期</th>
        <th></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table> 
</div>

<div id="dvRfqSale" class="target">
    <div class="yui-gd" style="width:100%;" >
        <div class="yui-u first" ><div class="pagination" style="float:left;"></div></div>
        <div class="yui-u" class="dvWhere" style="text-align:right;">
            <span class="date"></span>
            <input type="button" class="btnSearch" value="Search" />
        </div>
    </div>
    <table class="main5">
    <thead>
    <tr class="search_bar">
        <th style="width:3%;"></th>
        <th style="width:8%;"><input type="text" placeholder="编号" /></th>
        <th style="width:25%;"><input type="text" placeholder="型号"  /></th>
        <th style="width:8%;"></th>
        <th style="width:10%;"><select class="cmbPts"></select></th>
        <th style="width:10%;"><input type="text" placeholder="添加者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:10%;"><input type="text" placeholder="删除者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:6%;"></th>
    </tr>
    <tr class="header"> 
        <th><input type="checkbox"/></th>
        <th>编号</th>
        <th>型号</th>
        <th>数量</th>
        <th>平台</th>
        <th>添加者</th>
        <th>添加日期</th>
        <th>删除者</th>
        <th>删除日期</th>
        <th></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table> 
</div>

<div id="dvOrderSo" class="target"> <%--销售单--%>
    <div class="yui-gd" style="width:100%;" >
        <div class="yui-u first" ><div class="pagination" style="float:left;"></div></div>
        <div class="yui-u" class="dvWhere" style="text-align:right;">
            <span class="date"></span>
            <input type="button" class="btnSearch" value="Search" />
        </div>
    </div>
    <table class="main5">
    <thead>
    <tr class="search_bar">
        <th style="width:3%;"></th>
        <th style="width:8%;"><input type="text" placeholder="编号" /></th>
        <th style="width:8%;"></th>
        <th style="width:20%;"></th>
        <th style="width:8%;"></th>
        <th style="width:10%;"><select class="cmbPts"></select></th>
        <th style="width:10%;"><input type="text" placeholder="添加者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:10%;"><input type="text" placeholder="删除者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:6%;"></th>
    </tr>
    <tr class="header"> 
        <th><input type="checkbox"/></th>
        <th>编号</th>
        <th>PO#</th>
        <th>客户</th>
        <th>金额</th>
        <th>平台</th>
        <th>添加者</th>
        <th>添加日期</th>
        <th>删除者</th>
        <th>删除日期</th>
        <th></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table> 
</div>

<div id="dvOrderPo" class="target"> <%--采购单--%>
    <div class="yui-gd" style="width:100%;" >
        <div class="yui-u first" ><div class="pagination" style="float:left;"></div></div>
        <div class="yui-u" class="dvWhere" style="text-align:right;">
            <span class="date"></span>
            <input type="button" class="btnSearch" value="Search" />
        </div>
    </div>
    <table class="main5">
    <thead>
    <tr class="search_bar">
        <th style="width:3%;"></th>
        <th style="width:8%;"><input type="text" placeholder="编号" /></th>
        <th style="width:8%;"></th>
        <th style="width:20%;"></th>
        <th style="width:8%;"></th>
        <th style="width:10%;"><select class="cmbPts"></select></th>
        <th style="width:10%;"><input type="text" placeholder="添加者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:10%;"><input type="text" placeholder="删除者" class="txtUser" _id="" /></th>
        <th style="width:10%;"></th>
        <th style="width:6%;"></th>
    </tr>
    <tr class="header"> 
        <th><input type="checkbox"/></th>
        <th>编号</th>
        <th>PO#</th>
        <th>供货商</th>
        <th>金额</th>
        <th>平台</th>
        <th>添加者</th>
        <th>添加日期</th>
        <th>删除者</th>
        <th>删除日期</th>
        <th></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table> 
</div>

</div>
</div>
<div id="ft"></div>
</div>

</body>
</html>

