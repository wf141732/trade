<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ab.aspx.vb" Inherits="users_ab" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="../css/yui/reset-fonts-grids.css" rel="stylesheet" type="text/css" />
    <link href="../css/taobao/nav0906.css" rel="stylesheet" type="text/css" />

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
<script src="../js/jquery-ui-1.8.10/js/jquery-1.4.4.min.js" type="text/javascript"></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" type="text/javascript"></script>

<script src="../js/jquery.aac.js" type="text/javascript"></script>
<script src="../js/users/ab.js" type="text/javascript"></script>

<style type="text/css" >
    #ulusers{width:100%; background-color:Red;}
    #ulusers>li{ width:300px;min-height:150px; border:solid 1px #66CCCC; display:block; float:left; padding:5px; margin-right:20px; margin-bottom:20px;
                  -webkit-box-shadow: 5px 5px 7px gray;
                 }
    #ulusers>li:hover{border:solid 1px #009999; background-color:#F9FDFD;}
    #ulusers>li .photo,#ulusers>li .info{float:left;}
    #ulusers>li .photo{width:60px; text-align:center;}
    #ulusers>li .photo img{width:55px;}
    #ulusers>li .info{margin-left:5px;}
    #ulusers>li dl{width:100%;}
    
    #ulusers>li .info dd{line-height:18px; width:100%;}
    #ulusers>li .info dt{line-height:20px;font-weight:bold; font-size:16px;}
    #ulusers .splt{height:5px;}
    
    #ulMenu{}    
    #ulMenu li{ line-height:25px; font-size:15px; width:100%; cursor:pointer;}
    #ulMenu li.on{color:Red;font-weight:bold;}
    #ulMenu li:hover{color:Red;}
</style>
</head>
<body>

<div id="doc3" class="yui-t2">
<div id="hd"></div>
<div id="bd">
    <div class="yui-b">
        <ul id="ulMenu">
        </ul>
    </div>
    <div id="yui-main">
        <div class="yui-b">
            <ul id="ulusers"></ul>
        </div>
    </div>
</div>
<div id="ft"></div>
</div>
    
</body>
</html>
