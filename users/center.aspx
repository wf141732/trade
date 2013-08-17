<%@ Page Language="VB" AutoEventWireup="false" CodeFile="center.aspx.vb" Inherits="users_center" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>用户中心</title>

<link href="../css/yui/reset-fonts-grids.css" rel="stylesheet"  />
<link href="../css/general_new.css" rel="stylesheet"  />
<link href="../js/dwpe-code-public-latest/charting/css/visualize.css" rel="stylesheet"  />
<link href="../js/dwpe-code-public-latest/charting/css/visualize-light.css" rel="stylesheet"  />
<link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
<script src="../js/jquery-ui-1.8.10/js/jquery-1.4.4.min.js" ></script>
<script src="../js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
<script src="../js/jquery.aac.js" ></script>
<script src="../js/dwpe-code-public-latest/charting/js/visualize.jQuery.js" ></script>
<script src="../js/users/center.js" ></script>
<script src="../js/pic/client.js" type="text/javascript"></script>
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
.lft_menu ul li:hover{background-color:#AA8839; -webkit-box-shadow: 0 0 7px #AA8839;} 
.content{min-height:500px;width:100%;background-color:White; margin-top:20px;
          -moz-border-radius:10px; -webkit-border-radius:10px;
         }        
.content .target{display:none; padding:10px; }         

#dv_sta_rfq{padding:20px;}
#dv_sta_rfq table.data{
    border-collapse:collapse;
    font-size:13px;
    width:100%;
    word-break:break-all;
    word-wrap:break-word;
    table-layout:fixed;
}
#dv_sta_rfq table.data thead th,#dv_sta_rfq table.data td{text-align:center;}
#dv_sta_rfq table.data caption{text-shadow:2px 2px 5px #333333; font-size:large;text-align:center;}
#dv_sta_rfq table.data th{background-color:#eee; border:1px solid Gray; line-height:25px;}
#dv_sta_rfq table.data td{border:1px solid gray;}

#dv_sta_rfq  .alert{display:none;
background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0, rgb(128,58,58)),
    color-stop(0, rgb(154,101,86)),
    color-stop(0.76, rgb(171,38,38))
);
background-image: -moz-linear-gradient(
    center bottom,
    rgb(128,58,58) 0%,
    rgb(154,101,86) 0%,
    rgb(171,38,38) 76%
);

font-size:25px;
color:White;
width:500px;         
          -moz-border-radius:10px;-webkit-border-radius:10px;      
padding:20px;
line-height:50px;
margin:30px auto 0 auto;       
-moz-box-shadow:5px 5px 8px #382C1E; -webkit-box-shadow:5px 5px 8px #382C1E; box-shadow:5px 5px 8px #382C1E;
                    }
#dv_base{padding:20px;}                    
#dv_base .photo{padding:3px; width:50px; -moz-border-radius:5px; -webkit-border-radius:5px; display:inline-block; border:solid 1px gray;}
#dv_base .photo img{width:50px;height:50px;-moz-border-radius:5px; -webkit-border-radius:5px;}    
#dv_base .info{display:inline-block;}      

#dv_base .edit,#dv_base .contact{width:500px;margin-top:10px; border:solid gray 1px;-moz-border-radius:10px;-webkit-border-radius:10px; padding:15px;}        
#dv_base .edit .toolbar{text-align:center;}
#dv_base .edit table td{padding-right:10px;}
#dv_base .edit table tr{height:25px;}
#dv_base .contact table{width:80%;}
#dv_base .contact table thead tr{line-height:30px;}
#dv_base .contact table tbody tr{line-height:25px;}
#dv_base .contact table tbody td a.done{display:inline-block;padding-left:18px;background:url(../images/done2.gif) no-repeat center left;}

.button {
   border-top: 1px solid #96d1f8;
   background: #386380;
   background: -webkit-gradient(linear, left top, left bottom, from(#54a7de), to(#386380));
   background: -moz-linear-gradient(top, #54a7de, #386380);
   padding: 8px  10px;
   -webkit-border-radius: 10px;
   -moz-border-radius: 10px;
   border-radius: 10px;
   -webkit-box-shadow: rgba(0,0,0,1) 0 1px 0;
   -moz-box-shadow: rgba(0,0,0,1) 0 1px 0;
   box-shadow: rgba(0,0,0,1) 0 1px 0;
   text-shadow: rgba(0,0,0,.4) 0 1px 0;
   color: white;
   font-size: 18px;
   font-family: Georgia, serif;
   text-decoration: none;
   vertical-align: middle;
   }
.button:hover {
   border-top-color: #28597a;
   background: #28597a;
   color: #ccc;
   }
.button:active {
   border-top-color: #1b435e;
   background: #1b435e;
   } 

#dv_modify_number input[type=text]{margin-left:3px;}
#dv_modify_number input[type=text],#dv_modify_number select{padding:2px;}

#dv_online_code{width:320px;}
#dv_online_code textarea{width:99%;height:70px;}
#dv_online_code .toolbar input[type=button]{height:25px;width:70px;}

#dv_base .edit .toolbar{margin-top:10px;}
#dv_psw{width:220px;}
#dv_psw table{width:100%;}
#dv_psw table tr{line-height:25px;}
#dv_psw table td input{width:97%;height:100%;}
#dv_psw table td,#dv_psw table th{border:solid 1px white;}

#dv_focus>div,#dv_other>div{vertical-align:top; padding:5px; width:320px;display:inline-block; border:solid 1px gray; margin-left:10px;margin-bottom:10px; -moz-border-radius:10px;-webkit-border-radius:10px;}
#dv_focus h3,#dv_other h3{line-height:25px;}
#dv_focus label{width:90px;line-height:20px;font-size:15px;margin:5px;display:block;float:left;}

#dv_ptusers{padding:20px;}
#dv_mailbox{width:280px;}
#dv_other table{width:100%;}
#dv_other table tr{line-height:25px;}
#dv_other table th{font-weight:bold;}
#dv_base .contact table tr.del{text-decoration:line-through;color:Gray;}

#dv_friends .groups li{}
#dv_friends li{line-height:22px; cursor:pointer;}
#dv_friends li:hover{color:Blue;font-weight:bold;}
#dv_friends li.on{color:Red!important;font-weight:bold;}
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
                <li _id="base">基本信息</li>
                <li _id="focus">设定我的关注</li>
                <li _id="ptusers">我负责平台关注情况</li>
                <li _id="other">其他设置</li>
                <li _id="friends">我的聊天好友</li>
                <li _id="piTemplate">我的PI模板</li>
            </ul>
         </div>
    </div>
    <div id="yui-main"><div class="yui-b">
    <div class="content" >
        <div id="dv_base" class="target">
            <div class="level1 yui-gf baseview">
                <div id="drop-area" class="photo" title="点击上传您的头像" onclick="mUserPicUpload.show(this);" ><img src="../images/noavatar.gif" /></div>
                <div class="info">
                    <div class="name">您好，<b></b></div>
                    <div class="name">您属于，<b></b></div>
                    <div class="name">您的角色是<b></b></div>
                </div>
            </div>

            <div class="edit">
                <table>
                <tbody >
                    <tr>
                    <th style="width:15%;">姓</th><td style="width:40%;"><input type="text"  /></td>
                    <th style="width:10%;">名</th><td style="width:35%;"><input type="text"  /></td>
                    </tr>
                    <tr><th>出生年月</th> <td><input class="birthday datepick" type="text"  /></td>
                    <th>性别</th><td>
                    <select style="width:70px;">
                    <option value="f">女</option>
                    <option value="m">男</option>
                    </select>
                    </td>
                    </tr>
                    
                    <tr>
                    <th>职务</th> <td><select class="title"></select></td>
                    <th>隐私</th> <td><select><option value="1">仅公司内部可见</option><option value="2">对外公开</option></select></td>
                    </tr>
                </tbody>
                </table>        
                
                <div class="toolbar">
                    <button class="button bttnsave" >确定修改</button>
                    <button class="button bttnshowpsw">修改登录密码</button>
                </div>        
            </div>

            <div class="contact">
                <a href="javascript://" class="bttnaddway">添加联系方式</a>
                <table>
                    <thead><tr>
                        <th style="width:10%;">类型</th>
                        <th style="width:60%">电话号码/账号</th>
                        <th style="width:5%;"></th>
                        <th style="width:25%;"></th>
                    </tr></thead>
                    <tbody class="body"></tbody>
                </table>
            </div>
        </div>

        <div id="dv_focus" class="target">
        <div>
            <h3>我是采购，设定我关注的平台</h3>
            <div class="pts" _type="0"></div>
        </div>

        <div style="display:none;">
            <h3>我是业务，设定我关注的平台</h3>
            <div class="pts" _type="1"></div>
        </div>

        <div>
            <h3>我的订单进度关注平台</h3>
            <div class="pts" _type="2"></div>
        </div>

        <div>
            <h3>我的默认操作平台</h3>
            <div class="pts" _type="3"></div>
        </div>
        </div> 

        <div id="dv_ptusers" class="target">
            <div class="yui-g" style="width:100%;">
                <div class="yui-u first">
                    <h3>选择平台</h3>
                    <select multiple="multiple" class="pts" style="width:100%;height:300px;"></select>
                </div>
                <div class="yui-u">
                    <h3 id="pnlType">关注者 
                    <label><input type="radio" checked="checked"  name="type" otbl="rfq.caigou_focus" value="rfq.vwcaigou_focus" />采购</label> 
                   <%-- <label><input type="radio" name="type" value="rfq.vwsales_focus" otbl="rfq.sales_focus" />销售</label> --%>
                    <label><input type="radio" name="type" value="po.vw进度_关注" otbl="po.进度_关注"  />订单进度</label> 
                    </h3>
                    <select multiple="multiple" id="cmbAuthor" style="width:100%;height:300px;">
                    </select>
                </div>
            </div>            
        </div>

        <div id="dv_other" class="target">
            <div class="mail">
                <h3> 我负责平台默认发件邮箱</h3>
                <table>
                <thead><tr><th style="width:30%;">平台</th> <th style="width:70%;">默认邮箱</th></tr> </thead>
                <tbody></tbody>
                </table>
            </div>

            <div class="cocaigou body">
                <h3>添加我的协作采购</h3>
                <div>
                    <select></select>
                    <input class="bttnadd" type="button" value="添加" />
                </div>
                <table style="width:60%;">
                <thead><tr><th style="width:90%">协作采购</th> <th style="width:10%;"></th></tr> </thead>
                <tbody></tbody>
                </table>
            </div>


            <div class="sckmsgs">
                <h3>消息提示设置</h3>
                <div><ul>
                    <li><label><input type="checkbox" name="sckmsg" value="1" _t="1" />洽谈消息</label></li>
                    <li><label><input type="checkbox" name="sckmsg" value="1" _t="2" />公司内部业务发送询价(我是采购)</label></li>
<%--                    <li><label><input type="checkbox" name="sckmsg" value="1" _t="4" disabled="disabled" />收到系统会员（客户）发送询价</label></li>
                    <li><label><input type="checkbox" name="sckmsg" value="1" _t="5" />收到系统会员（供货商）回复询价</label></li>
--%>
                    <li><label><input type="checkbox" name="sckmsg" value="1" _t="6"  disabled="disabled"/>新订单数通知</label></li>
                </ul></div>
            </div>
        </div>

        <div id="dv_friends" class="target">
            <div class="yui-g" style="width:70%;padding:10px;">
                <div class="yui-u first">
                    <div>
                        <label><input type="text" class="txtGroup" placeholder="输入新组名" style="width:120px;"  /></label>
                        <input type="button" value="添加新组" class="bttnAddGroup" />
                    </div>
                    <div class="groups" style="margin-top:10px;"><ul></ul></div>
                </div>

                <div class="yui-u">
                    <div>
                        <label><input type="text" class="txtMember" style="width:120px;"  placeholder="会员公司" /></label>
                        <label><select style="width:100px;" class="cmbContacts" ></select></label>
                        <input type="button" value="添加" class="bttnAddFriend" />
                    </div>

                    <div class="friends" style="margin-top:10px;">
                        <ul></ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="dv_piTemplate" class="target">
            <label>平台<select class="cmbPts" style="width:100px;"></select></label>
            <label>名称<input type="text" style="width:150px;" class="txtName"  />
            <input type="button" disabled="disabled" class="bttnSave" value="保存" /> </label>
            <table style="width:80%;" class="main5">
            <thead><tr class="header">
                <th style="width:50%;">PI模板名称</th>
                <th style="width:35%;">上传时间/作者</th>
                <th style="width:5%;"></th>
                <th style="width:5%;"></th>
                <th style="width:5%;"></th>
            </tr></thead><tbody></tbody>
            </table>
            <div id="uploader"></div>            
        </div>

    </div>
    </div></div>
</div>
<div id="ft"></div>
</div>    

<div id="dv_modify_number" class="gwin" style="width:400px;">
    <div class="number">
        <select class="type" style="width:80px;"></select>
        <input type="text" style="width:35px;display:none;" value="86" class="ext" placeholder="国家代号" title="国家代号" />
        <input type="text" style="width:40px;"  class="ext" title="区号" placeholder="区号" />
        <input type="text" style="width:140px;" placeholder="号码" />
    </div>
    <div class="toolbar">
        <input type="button" class="bttnsave"  value="确定保存" />
        <input type="button" value="离开" class="close" />
    </div>
</div>

<div id="dv_psw" class="gwin">
    <table>
        <tr><th style="width:20%;">旧密码</th><td style="width:80%;"><input  type="password"  /></td></tr>
        <tr><th>新密码</th><td><input type="password" /></td></tr>
    </table>
    <div class="toolbar">
        <input type="button" class="bttnsave" value="确定修改" />
        <input type="button" class="close" value="取消" />
    </div>
</div>

<div id="dv_online_code" class="gwin">
    <img src="../images/close3.gif" class="close" alt="关闭" />
    <div class="title">修改、添加IM的在线代码</div>
    <div><textarea></textarea></div>
    <div class="toolbar">
        <input type="button" class="bttnsave" value="保存" />
        <a href="javascript://" class="online_code">获取在线代码</a>
    </div>
</div>


<div id="dvUserPicUpload" class="gwinbill" style="width:600px;height:300px;" >
    <div class="close noheadclose"></div>
    <div class="body"><div class="dv_upload"></div></div>
</div>

</body>
</html>
