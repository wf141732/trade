<%@ Page Language="VB" AutoEventWireup="false" CodeFile="index.aspx.vb" Inherits="index" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>娇云会员和免费派送系统</title>
    <link href="css/yui/reset-fonts-grids.css" rel="stylesheet" />
    <link href="../js/jquery-ui-1.8.10/css/ui-lightness/jquery-ui-1.8.10.custom.css"  rel="stylesheet"  />
    <% Dim ver As String= "20120615" %>
    <link href="css/base.css" rel="stylesheet"  />
    <link href="css/style.css" rel="stylesheet"  />
    <link href="css/login.css" rel="stylesheet"  />
    <link href="css/general.css" rel="stylesheet"  />
    <link href="css/pos.css?ver=1.10" rel="stylesheet" type="text/css" />
    <script src="js/jquery-1.7.1.min.js"></script>
    <script src="js/jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" ></script>
    <script src="js/jquery.aac.js?ver=<%=ver %>" ></script>
    <script src="js/common/makePy.js" type="text/javascript"></script>
    <script src="js/common.js?ver=<%=ver %>"></script>
    <script src="js/common05.js?ver=<%=ver %>"></script>
    <script src="js/index.js?ver=<%=ver %>"></script>
    <script src="js/index05.js?ver=1.01"></script>
    <script src="js/index06.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/common/capture.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/jquery.treeTable.js" type="text/javascript"></script>
    <link href="css/jquery.treeTable.css" rel="stylesheet" type="text/css" />
    <script src="js/jqueryplugin/jquery.pagination.js"></script>
    <script src="../js/jqueryplugin/contextmenu/jquery.contextmenu.r2.packed.js" ></script>
    <script src="js/version.js?ver=<%=ver %>" type="text/javascript"></script>
    <script src="js/ws.js?ver=1" type="text/javascript"></script>

    <style>
            #hd{line-height:50px;font-size:20px;}
            #hd .logininfo{font-size:15px;font-style:italic;}
            body{height:100%;}
            #dvSide{height:550px;background-color:#eee;}
            #dvSide ul{border-bottom:3px white solid;}
            #dvSide li{line-height:30px;cursor:pointer;text-indent:10px;}
            #dvSide li.on,#dvSide li:hover{background-color:green;color:White;}
            #dvMemberRegister .lstCode li{line-height:20px;cursor:pointer;}
            #dvMemberRegister .lstCode li:hover{background-color:gray;color:White;}
            #dvMemberRegister .register table{width:100%;}
            #dvMemberRegister .register table tr{height:30px;}
            #dvMemberRegister .register table tr th{font-size:15px;text-align:right;padding-right:5px;}
            #dvMemberRegister .register table tr input[type=text]{padding:3px;width:100%;}
            #dvMemberRegister .primary-button{width:200px;height:36px;padding:6px 8px;font-size:18px}
            #dvMemberRegister .register select{padding:2px;}
            #dvMemberRegister .searchbar{margin-bottom:5px;}
            #dvMemberRegister .searchbar input{padding:3px;}
            dv.target{display:none; width:100%;}
            .big-btn{height:25px;width:70px;}
            .float_box .toolbar{padding:5px;margin-bottom:10px;}
            .memberno .content>div{padding:5px;}
            .memberno .content input[type=text]{padding:3px;width:120px;font-size:20px;}
            #dvMemberCardNo .tool select,#dvMemberCardNo .tool input{padding:3px;}
            #dvMemberCardNo .tips{color:Red;}
            .target .tool>label>*{padding:2px;}
            .target .tool input[type=button]{padding:2px;}
            .target .tool{margin-bottom:2px;}
            .target .tool .date input[type=text]{width:90px;padding:2px;}
            .target .tool input[type=text]{width:90px;padding:2px;}
            
            .float_box .content{padding:10px;}
            .float_box .content table{width:100%;}
            .float_box .content table input[type=text]{padding:2px;width:80%;}
            .float_box .content table select{padding:2px;width:30%;}
            .float_box .content table tr{height:25px;}
            .float_box .content table th{text-align:right;}
            .float_box .content .table2{margin: 20px 0px 20px 0px;}
            .float_box .content .table2 th{text-align:center;}
            .float_box .content table td{text-align:left;text-indent:5px;}
            #dvGiftDeliveryAction .content table td b{color:Red;display:inline-block;padding:0 3px;}
            .lstmyNo::-webkit-scrollbar{width:7px;height:7px}
            .lstmyNo::-webkit-scrollbar-thumb{background:#e4e4e4;-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px;-moz-background-clip:padding;-webkit-background-clip:padding-box;background-clip:padding-box;min-height:70px}
            .lstmyNo::-webkit-scrollbar-thumb:hover{background:#b9bbbf;}
            .lstmyNo::-webkit-scrollbar-thumb:active{background:#93969b;}
            
            .error_msg{display:none;color:Red;}
            .error{background-color:Red;color:white;}
            .dvcode{display:inline-block;border:1px solid #eee;background-color:#fff;font-size:16px;}
            .dvcode>span{display:inline-block;padding:2px;margin:2px 4px;color:#ccc;}
            .dvcode input[type=text]{border:0;padding:2px;height:30px;}
            
            .toolbar .btnAdd{font-size:200%;font-weight:bold;border:1px solid gray;
                                -webkit-border-radius: 40px;line-height: 19px;height: 20px;width: 20px;cursor:pointer;}
            .toolbar div{float:left;margin-left:10px;}            
            .toolbar .btnAdd:hover{box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.4);}
            .toolbar .btnAdd:active{background-color:Gray;}
            .help{position: fixed;right: 10px;top: 10px;}
            .order_read .pos ul {padding: 0px 6px;}
            
            progress {border-radius: 2px;border-left: 1px #ccc solid;border-right: 1px #ccc solid;
                      border-top: 1px #aaa solid;background-color: #eee;}
  
            progress::-webkit-progress-bar {background-color: #d7d7d7;}
  
            progress::-webkit-progress-value {background-color: #aadd6a;}
            .pageTotal{white-space:nowrap;}
            
            .treeTable tbody td{border:0px;border-bottom:1px dotted #B9DDFF;}
            .treeTable tbody td:first-child{border-left:1px solid #B9DDFF;}
            .treeTable tbody td:last-child{border-right:1px solid #B9DDFF;}
            table.treeTable td{padding-left:19px;}           
            
            .selector tr label{cursor: pointer;}
            .selector tr:hover {background-color: green;color: white;}
            table.selector tbody td{border:0px;}
            
            .cmbType > label{margin-right:5px;}
            
            .content div.box {position: relative;padding: 10px;background-color: white;vertical-align: top;
                            display: inline-block;width: 90%;min-height: 200px;border: 1px solid #EEE;margin-top: 3%;}
    </style>
</head>
<body>
<div class="help"><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=343181024&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:343181024:41 &r=0.3298569193575531" alt="有问题请联系我" title="有问题请联系我"></a></div>
<div id="doc4" class="yui-t2">
<div id="hd">
    <b>欧美姿会员管理系统</b>
    <span class="logininfo">欢迎您<b></b>,您来自<b></b>[<b></b>]</span>
</div>
<div id="bd">
    <div class="yui-b" id="dvSide">
        <ul class="rank2">
            <li _index="0">会员注册<b href="/pos.shtml" class="toNew1" style="display:none;">试用新版</b></li>
        </ul>

        <ul>
            <li _index="3">会员管理</li>
            <li _index="4">礼品派送&统计</li>
            <li _index="1">产品派送</li>
            <li _index="15">营销活动管理<b href="/factory.shtml" class="toNew2" style="display:none;">试用新版</b></li>
        </ul>

        <ul>            
            <li _index="8">产品销售</li>
            <li _index="9">销售记录</li>
            <li _index="12">我的订货记录<b href="/agent.shtml" class="toNew" style="display:none;">试用新版</b></li><!--我的消费记录-->
            <li _index="16" style="display:none;">我的账户余额</li>
            <li _index="10">产品库存</li>
            <li _index="11">产品类别</li>
            <li _index="13">入库记录</li>
            <li _index="14">出库记录</li>
            <!--<li _index="6">销售库存</li>-->
        </ul>

        <ul>
            <li _index="2">代理商(终端店)管理</li>
            <li _index="7">代理商(终端店)统计</li>
            <li _index="1">会员卡号管理</li>
        </ul>

        <ul>
            <li _index="5">用户管理</li>
            <li _index="">修改密码</li>
            <li _index="21">退出登录</li>
        </ul>
    </div>
    <div id="yui-main">
        <div class="yui-b" >
            <div id="dvMemberRegister" class="target">
                <div class="yui-gf">
                    <div class="yui-u first lstCode">
                        <div class="searchbar">
                            <input type="text"class="txtKey" placeholder="输入会员号" style="width:120px;" />
                            <input type="button" class="btnSearch" value="查询" />
                        </div>
                        <ul class="lstmyNo" style="height:500px;overflow-y:auto;"></ul>
                    </div>
                    <div class="yui-u register">
                        <table>
                            <tr>
                                <th style="width:15%;">会员号</th>
                                <td style="width:55%;"><input type="text" maxlength="8" class="txtNo" placeholder="输入8位会员号，也可以在右边选择" /></td>
                                <td style="width:30%;"><span class="error_msg" >会员号不合法(1,2开头且全部为8位数字)</span></td>
                            </tr>

                            <tr>
                                <th>身份证号</th>
                                <td>
                                    <input type="text" class="txtId" placeholder="输入有效的身份证号或者军官证号" style="width:80%;" />
                                    <input type="button" value="验证" style="padding:2px;"  class="btnCheck" title="验证身份证是否有效并自动获取相关信息" />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>姓名</th>
                                <td><input type="text" placeholder="输入真实姓名" /></td>
                                <td></td>
                            </tr>                            
                            <tr>
                                <th>手机号码</th>
                                <td><input type="text" class="txtMobi" placeholder="输入手机号码"  /></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>性别</th>
                                <td class="gender">
                                    <label style="margin-right:15px;"><input type="radio" value="f" name="gender" checked="checked"   />女</label>
                                    <label><input type="radio" name="gender" value="m" />男</label>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>出生日期</th>
                                <td class="birthday">
                                    <select>
                                        <option value="2012" id="year_0">2012年</option> <option value="2011" id="year_1">2011年</option> <option value="2010" id="year_2">2010年</option> <option value="2009" id="year_3">2009年</option> <option value="2008" id="year_4">2008年</option> <option value="2007" id="year_5">2007年</option> <option value="2006" id="year_6">2006年</option> <option value="2005" id="year_7">2005年</option> <option value="2004" id="year_8">2004年</option> <option value="2003" id="year_9">2003年</option> <option value="2002" id="year_10">2002年</option> <option value="2001" id="year_11">2001年</option> <option value="2000" id="year_12">2000年</option> <option value="1999" id="year_13">1999年</option> <option value="1998" id="year_14">1998年</option> <option value="1997" id="year_15">1997年</option> <option value="1996" id="year_16">1996年</option> <option value="1995" id="year_17">1995年</option> <option value="1994" id="year_18">1994年</option> <option value="1993" id="year_19">1993年</option> <option value="1992" id="year_20">1992年</option> <option value="1991" id="year_21" class="">1991年</option> <option value="1990" id="year_22" class="">1990年</option> <option value="1989" id="year_23" class="">1989年</option> <option value="1988" id="year_24">1988年</option> <option value="1987" id="year_25">1987年</option> <option value="1986" id="year_26">1986年</option> <option value="1985" id="year_27">1985年</option> <option value="1984" id="year_28">1984年</option> <option value="1983" id="year_29">1983年</option> <option value="1982" id="year_30">1982年</option> <option value="1981" id="year_31">1981年</option> <option value="1980" id="year_32">1980年</option> <option value="1979" id="year_33">1979年</option> <option value="1978" id="year_34">1978年</option> <option value="1977" id="year_35" selected="selected">1977年</option> <option value="1976" id="year_36">1976年</option> <option value="1975" id="year_37">1975年</option> <option value="1974" id="year_38">1974年</option> <option value="1973" id="year_39">1973年</option> <option value="1972" id="year_40">1972年</option> <option value="1971" id="year_41">1971年</option> <option value="1970" id="year_42">1970年</option> <option value="1969" id="year_43">1969年</option> <option value="1968" id="year_44">1968年</option> <option value="1967" id="year_45">1967年</option> <option value="1966" id="year_46">1966年</option> <option value="1965" id="year_47">1965年</option> <option value="1964" id="year_48">1964年</option> <option value="1963" id="year_49">1963年</option> <option value="1962" id="year_50">1962年</option> <option value="1961" id="year_51">1961年</option> <option value="1960" id="year_52">1960年</option> <option value="1959" id="year_53">1959年</option> <option value="1958" id="year_54">1958年</option> <option value="1957" id="year_55">1957年</option> <option value="1956" id="year_56">1956年</option> <option value="1955" id="year_57">1955年</option> <option value="1954" id="year_58">1954年</option> <option value="1953" id="year_59">1953年</option> <option value="1952" id="year_60">1952年</option> <option value="1951" id="year_61">1951年</option> <option value="1950" id="year_62">1950年</option> <option value="1949" id="year_63">1949年</option> <option value="1948" id="year_64">1948年</option> <option value="1947" id="year_65">1947年</option> <option value="1946" id="year_66">1946年</option> <option value="1945" id="year_67">1945年</option> <option value="1944" id="year_68">1944年</option> <option value="1943" id="year_69">1943年</option> <option value="1942" id="year_70">1942年</option> <option value="1941" id="year_71">1941年</option> <option value="1940" id="year_72">1940年</option> <option value="1939" id="year_73">1939年</option> <option value="1938" id="year_74">1938年</option> <option value="1937" id="year_75">1937年</option> <option value="1936" id="year_76">1936年</option> <option value="1935" id="year_77">1935年</option> <option value="1934" id="year_78">1934年</option> <option value="1933" id="year_79">1933年</option> <option value="1932" id="year_80">1932年</option> <option value="1931" id="year_81">1931年</option> <option value="1930" id="year_82">1930年</option> <option value="1929" id="year_83">1929年</option> <option value="1928" id="year_84">1928年</option> <option value="1927" id="year_85">1927年</option> <option value="1926" id="year_86">1926年</option> <option value="1925" id="year_87">1925年</option> <option value="1924" id="year_88">1924年</option> <option value="1923" id="year_89">1923年</option> <option value="1922" id="year_90">1922年</option> <option value="1921" id="year_91">1921年</option> <option value="1920" id="year_92">1920年</option> <option value="1919" id="year_93">1919年</option> <option value="1918" id="year_94">1918年</option> <option value="1917" id="year_95">1917年</option> <option value="1916" id="year_96">1916年</option> <option value="1915" id="year_97">1915年</option> <option value="1914" id="year_98">1914年</option> <option value="1913" id="year_99">1913年</option> <option value="1912" id="year_100">1912年</option> <option value="1911" id="year_101">1911年</option> <option value="1910" id="year_102">1910年</option> <option value="1909" id="year_103">1909年</option> <option value="1908" id="year_104">1908年</option> <option value="1907" id="year_105">1907年</option> <option value="1906" id="year_106">1906年</option> <option value="1905" id="year_107">1905年</option> <option value="1904" id="year_108">1904年</option> <option value="1903" id="year_109">1903年</option> <option value="1902" id="year_110">1902年</option> <option value="1901" id="year_111">1901年</option> <option value="1900" id="year_112">1900年</option> <option value="1899" id="year_113">1899年</option> <option value="1898" id="year_114">1898年</option> <option value="1897" id="year_115">1897年</option> <option value="1896" id="year_116">1896年</option> <option value="1895" id="year_117">1895年</option> <option value="1894" id="year_118">1894年</option> <option value="1893" id="year_119">1893年</option>
                                    </select>
                                    <select>
                                        <option value="1" id="month_0" class="">1月</option> <option value="2" id="month_1" class="">2月</option> <option value="3" id="month_2">3月</option> <option value="4" id="month_3">4月</option> <option value="5" id="month_4" class="">5月</option> <option value="6" id="month_5">6月</option> <option value="7" id="month_6">7月</option> <option value="8" id="month_7">8月</option> <option value="9" id="month_8">9月</option> <option value="10" id="month_9">10月</option> <option value="11" id="month_10">11月</option> <option value="12" id="month_11">12月</option>
                                    </select>
                                    <select>
                                    <option value="1" id="day_0" class="">1日</option> <option value="2" id="day_1" class="">2日</option> <option value="3" id="day_2" class="">3日</option> <option value="4" id="day_3" class="">4日</option> <option value="5" id="day_4">5日</option> <option value="6" id="day_5">6日</option> <option value="7" id="day_6">7日</option> <option value="8" id="day_7">8日</option> <option value="9" id="day_8">9日</option> <option value="10" id="day_9">10日</option> <option value="11" id="day_10">11日</option> <option value="12" id="day_11">12日</option> <option value="13" id="day_12">13日</option> <option value="14" id="day_13">14日</option> <option value="15" id="day_14">15日</option> <option value="16" id="day_15">16日</option> <option value="17" id="day_16">17日</option> <option value="18" id="day_17">18日</option> <option value="19" id="day_18">19日</option> <option value="20" id="day_19">20日</option> <option value="21" id="day_20">21日</option> <option value="22" id="day_21">22日</option> <option value="23" id="day_22">23日</option> <option value="24" id="day_23">24日</option> <option value="25" id="day_24">25日</option> <option value="26" id="day_25">26日</option> <option value="27" id="day_26">27日</option> <option value="28" id="day_27">28日</option> <option value="29" id="day_28">29日</option> <option value="30" id="day_29">30日</option> <option value="31" id="day_30">31日</option>
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>所在地</th>
                                <td class="address">
                                    <select style="width:80px;"></select>
                                    <select style="width:90px;"></select>
                                    <select style="width:90px;"></select>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>密码</th>
                                <td><a href="javascript://">使用默认密码</a></td>
                                <td></td>
                            </tr>
                        </table>

                        <div style="text-align:center;margin-top:20px;"><input role="btnRegister"  class="primary-button" type="submit" value="确定注册"/></div>
                    </div>
                </div>
            </div>

            <div id="dvMemberCardNo" class="target">
                <div class="tool">
                    <a href="javascript://" class="btnShowGenerateNum" style="display:none;">生成会员卡号</a>
                    <a href="javascript://" class="btnAssign">分配卡号</a>
                    <span>
                        <select class="cmbState" style="width:110px;">
                            <option value="" selected="selected">选择卡位置</option>
                            <option value="0">在厂家</option>
                            <option value="1">在代理商</option>
                            <option value="2">在终端店</option>
                            <option value="3">在连锁店</option>
                            <option value="4">已分配给会员</option>
                        </select>
                        门店号<div class="dvcode"><span class="parentcode">001</span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                        <span><input type="text" placeholder="输入卡号查询" /></span>
                        <input type="button" class="btnSearch" value="查询" />
                        <span class="tips" style="margin-left:5px;"></span>
                    </span>
                </div>
                <div class="body">
                <table class="table1">
                    <thead><tr>
                        <th style="width:30%;">卡号</th>
                        <th style="width:20%;">当前状态</th>
                        <th style="width:30%;">制卡日期</th>
                        <th style="width:20%;">最后更新日期</th>
                    </tr></thead>
                    <tbody></tbody>
                </table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvAgent" class="target">
                <div class="tool">
                   门店号<div class="dvcode"><span class="parentcode">001</span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                   <label>选择类型<select class="cmbRank" style="width:90px;">
                        <option value="">全部</option>
                        <option value="1">代理商</option>
                        <option value="2">终端店</option>
                        <option value="3">连锁店</option>
                   </select></label>
                   <select class="cmbProvince" style="width:120px;padding:2px;"></select>
                   <label title="24小时之内存在过送霜">正在送霜<input class="hgift" type=checkbox value="0"/></label>
                   <input type="button" value="查询" class="btnSearch" />
                   <a href="javascript://" title="添加下级分销商" class="btnAdd">添加</a>
                   <label class="pageTotal"></label>
                </div>
                <div class="body">
                <table class="table1"><thead><tr>
                    <th style="width:10%;">门店号</th>
                    <th style="width:10%;">等级</th>
                    <th style="width:20%;">名称</th>
                    <th style="width:20%;">联系电话</th>
                    <th style="width:15%;">上级</th>
                    <th style="width:12%;">日期</th>                    
                    <th style="width:12%;">活动中</th>
                    <!--<th style="width:8%;">会员</th>-->
                </tr></thead>
                <tbody></tbody>
                </table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvMember" class="target">
                <div class="tool">
                    
                    门店号<div class="dvcode"><span class="parentcode">001</span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                   <label>会员号<input type="text" placeholder="输入8位会员号" style="width:90px;" /></label>
                   <label>姓名<input type="text" placeholder="输入会员姓名" style="width:120px;" /></label>
                   <!--<span class="date"><input type="text" placeholder="起始日期" />-<input type="text" placeholder="结束日期" /></span>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <a href="javascript://" class="bttnOutput2Excel">导出到excel表格</a>
                   <label class="pageTotal"></label>
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">会员号</th>
                            <th style="width:20%;">手机</th>
                            <th style="width:10%;">总积分</th>
                            <th style="width:10%;">已兑积分</th>
                            <th style="width:10%;">剩余积分</th>
                            <th style="width:10%;">姓名</th>
                            <th style="width:30%;">门店和门店号</th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvGiftDelivery" class="target">
                <div class="tool">
                    <a href="javascript://" class="btnDelivery">派送礼品</a>
                   门店号<div class="dvcode"><span class="parentcode"></span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                   <label>身份证<input type="text" placeholder="输入身份证号" style="width:150px;" /></label>
                   <label>活动<select class="cmbMarketing"></select></label>
                   <input type="button" value="查询" class="btnSearch" /><label class="pageTotal"></label>
                </div>
                <div class="body">
                    <table class="table1"><thead><tr>
                        <th style="width:10%;">姓名</th>
                        <th style="width:20%;">身份证号</th>
                        <th style="width:20%;">电话/手机</th>
                        <th style="width:18%;">地址</th>
                        <th style="width:20%;">赠送礼物</th>
                        <th style="width:12%;">赠送日期</th>
                    </tr></thead>
                    <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvUsers" class="target">
                <div class="tool">
                    门店号<div class="dvcode"><span class="parentcode"></span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                   <label>姓名<input type="text" placeholder="真实姓名" style="width:150px;" /></label>
                   <input type="button" value="查询" class="btnSearch" />
                   <a href="javascript://" class="btnAdd">添加新用户</a>
                </div>
                <div class="body">
                    <table class="table1"><thead><tr>
                        <th style="width:15%;">登录号</th>
                        <th style="width:15%;">密码</th>
                        <th style="width:15%;">姓名</th>
                        <th style="width:20%;">手机号</th>
                        <th style="width:15%;">角色</th>
                        <th style="width:20%;">门店</th>
                    </tr></thead>
                    <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvSaleStock" class="target">
                <div class="tool">
                    <label>发往<select style="width:150px;" class="cmbChildrenAgent"></select></label>                    
                </div>
                <div class="body">
                    <table class="table1"><thead><tr>
                        <th style="width:10%;">产品编号</th>
                        <th style="width:20%;">名称</th>
                        <th style="width:10%;">可售数</th>
                        <th style="width:10%;">单价</th>
                        <th style="width:20%;">发往</th>
                        <th style="width:10%;">日期</th>
                        <th style="width:10%;">操作者</th>
                    </tr></thead><tbody></tbody></table>
                </div>
                <div class="pagination"></div>
            </div>

            <div id="dvAgentSta" class="target">
                <div class="tool">
                    门店号<div class="dvcode"><span class="parentcode">001</span><input type="text" ext="" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                    月份<select class="month"></select>
                   <span class="date"><input type="text" placeholder="起始日期" />-<input type="text" placeholder="结束日期" /></span>
                   <input type="button" value="统计" class="btnSearch" />
                   <a href="javascript://">导出excel表格</a>
                </div>
                <div class="body">
                <table class="table1"><thead><tr>
                    <th style="width:40%;">名称</th>
                    <th style="width:20%;">入会</th>
                    <th style="width:20%;">送霜</th>
                    <th style="width:20%;">入会比例</th>
                </tr></thead>
                <tbody></tbody>
                </table>
                </div>
                <div class="pagination"></div>
            </div>      
            
            <div id="dvPos" class="target pos">
                <div class="max"></div>
                <div class="right">
                    <div class="category">
                        <ul>
                            <!--<li>美白系列化妆</li>-->
                        </ul>
                    </div>
                    <div class="main">
                        <ul class="product"></ul>
                        <ul class="member"></ul>
                    </div>
                </div>
                <div class="left">
                        <div class="title"><p>小计</p><p>折扣</p><p>数量</p><p>单价</p></div>
                    <div class="orderDetail">
                        <ol>
                            <!--<li><div>苹果 the new iPad(16G)wifi版</div><div><p>小计</p><p>折扣</p><p>数量</p><p>单价</p></div></li>
                            <li><div>苹果 the new iPad(16G)wifi版</div><div><p>小计</p><p>折扣</p><p>数量</p><p>单价</p></div></li>-->
                        </ol>
                    </div>
                    <div class="info" style="position:relative;">
                        <div class="money">
                            <div>合计<label>0.00</label></div><div title="点击出现收银台">实收<label>0</label></div><div>找零<label>0</label></div>
                            </div>
                        <div class="pay"><input type="number" style="width:35%;"value="0" readOnly="true" />
                                        <input type="number" class="in" style="width:15%;margin-left:5%;" title="百" step="1" min="0" value="0" onpaste="javascript:return false;" onkeypress="javascript:return false;" />
                                        <input type="number" max="9" class="in" min="0" step="1" maxlength="1" value="0"title="十" onpaste="javascript:return false;" onkeypress="javascript:return false;" />
                                        <input type="number" max="9" class="in" min="0" step="1" value="0"title="元"onpaste="javascript:return false;" onkeypress="javascript:return false;" />
                                        <input type="text" value="." enable="false" onpaste="javascript:return false;" onkeypress="javascript:return false;" />
                                        <input type="number" class="in" min="0" step="1" max="9" value="0" title="角" onpaste="javascript:return false;" onkeypress="javascript:return false;" />
                                        <input type="number" value=0 title="点击结算" style="width:20%;margin-left:5%;" readOnly="true" /></div>
                        <div class="member" title="点击出现输入会员"><div>会员信息<label></label></div><div>积分<label></label></div></div>
                        <div><label>帮助:++/HY输入会员信息;**/QP进入全屏</label></div>
                        <div class="notic"><label>系统:</label><label>等待输入...</label></div>
                        <div class="command" contenteditable="true"></div>
                    </div>
                </div>
            </div>      

            <div id="dvSaleOrder" class="target">
                <div class="tool">
                   <span class="date">日期起<input type="text" placeholder="起始日期" />-日期止<input type="text" placeholder="结束日期" /></span>
                   <!--<label>客户<input type="text" placeholder="选择客户"  style="width:90px;" /></label>-->
                   <label>销售员<select class="cmbSaler" /></label>
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">订单编号</th>
                            <th style="width:10%;">订单日期</th>
                            <th style="width:10%;">客户</th>
                            <th style="width:10%;">销售员</th>
                            <th style="width:10%;">总金额</th>
                            <th style="width:10%;">确认日期</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>  
              
            <div id="dvStock" class="target">
                <div class="tool">
                   <input type="hidden" class="add" value="-1" />
                   <label>名称<input type="text" class="add search" placeholder="输入名称"  style="width:90px;" /></label>
                   <label>编码<input type="text" class="search" placeholder="根据编码查询" title="编码只用在查询，新增类别时，编码会自动生成" style="width:90px;" /></label>
                   <label>类别<select class="cmbCategory search"></select></label>
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:20%;">名称</th>
                            <th style="width:10%;">编码</th>
                            <th style="width:10%;">类别</th>
                            <th style="width:8%;">进货价</th>
                            <th style="width:8%;">零售价</th>
                            <th style="width:8%;">库存数</th>
                            <th style="width:5%;">单位</th>
                            <th style="width:20%;">描述</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>  
              
            <div id="dvProductCateg" class="target">
                <div class="tool">
                   <input type="hidden" class="add" value="-1" />
                   <label>名称<input type="text" class="add search" placeholder="输入名称"  style="width:90px;" /></label>
                   <label>编码<input type="text" class="search add" placeholder="根据编码查询" title="编码只用在查询，新增类别时，编码会自动生成" style="width:90px;" /></label>
                   <!--<label>描述<textarea type="text" class="add" placeholder="输入描述" style="width:150px; height:16px;" ></textarea></label>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <!--<input type="button" value="保存" title="在修改的时候点击保存" class="btnSave" />-->
                   <input type="button" value="新增" title="在重新建立类型的时候点击新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">名称</th>
                            <th style="width:10%;">编码</th>
                            <th style="width:20%;">描述</th>
                            <th style="width:10%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>    

            <div id="dvPurchasOrder" class="target">
                <div class="tool">
                   <!--<label>日期起<input type="text" placeholder="输入查询的起始日期" title="输入查询的起始日期" style="width:90px;" /></label>
                   <label>日期止<input type="text" placeholder="输入查询的截至日期" title="输入查询的截至日期" style="width:90px;" /></label>-->
                   <span class="date">订单日期起<input type="text" placeholder="起始日期" />-订单日期止<input type="text" placeholder="结束日期" /></span>
                   <!--<label>供应商<input type="text" placeholder="选择供应商"  style="width:90px;" /></label>-->
                   <!--<label>采购员<select class="cmbBuyer" /></label>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">订单编号</th>
                            <th style="width:10%;">订单日期</th>
                            <th style="width:10%;">总金额</th>
                            <!--<th style="width:10%;">状态</th>-->
                            <th style="width:20%;">店家</th>
                            <th style="width:10%;">确认日期</th>
                            <th style="width:10%;">已发货</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>  

            <div id="dvStockTranIn" class="target">
                <div class="tool">
                   <!--<label>日期起<input type="text" placeholder="输入查询的起始日期" title="输入查询的起始日期" style="width:90px;" /></label>
                   <label>日期止<input type="text" placeholder="输入查询的截至日期" title="输入查询的截至日期" style="width:90px;" /></label>
                   <label>供应商<input type="text" placeholder="选择供应商"  style="width:90px;" /></label>-->
                   <span class="date">入库日期起<input type="text" placeholder="起始日期" />-入库日期止<input type="text" placeholder="结束日期" /></span>
                   <!--<label>采购员<select class="cmbBuyer" /></label>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>                            
                            <th style="width:8%;">库存单号</th>
                            <th style="width:8%;">订单编号</th>
                            <th style="width:15%;">产品名称</th>
                            <th style="width:10%;">产品类型</th>
                            <th style="width:6%;">数量</th>
                            <th style="width:6%;">单位</th>
                            <!--<th style="width:7%;">进货价</th>-->
                            <th style="width:8%;">出库日期</th>
                            <th style="width:8%;">入库日期</th>
                            <th style="width:15%;">发货通知</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div> 

            <div id="dvStockTranOut" class="target">
                <div class="tool">
                   <!--<label>日期起<input type="text" placeholder="输入查询的起始日期" title="输入查询的起始日期" style="width:90px;" /></label>
                   <label>日期止<input type="text" placeholder="输入查询的截至日期" title="输入查询的截至日期" style="width:90px;" /></label>-->
                   <span class="date">出库日期起<input type="text" placeholder="起始日期" />-出库日期止<input type="text" placeholder="结束日期" /></span>
                   <!--<label>供应商<input type="text" placeholder="选择供应商"  style="width:90px;" /></label>
                   <label>采购员<select class="cmbBuyer" /></label>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">订单编号</th>
                            <th style="width:20%;">产品名称</th>
                            <th style="width:10%;">产品类型</th>
                            <th style="width:6%;">数量</th>
                            <th style="width:6%;">单位</th>
                            <!--<th style="width:10%;">交易价格</th>-->
                            <th style="width:10%;">出库日期</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div> 

            <div id="dvMarketing" class="target">
                <div class="tool">
                   <span class="date">日期起<input type="text" placeholder="起始日期" />-日期止<input type="text" placeholder="结束日期" /></span>
                   <!--<label>采购员<select class="cmbBuyer" /></label>-->
                   <input type="button" value="查询" class="btnSearch" />
                   <input type="button" value="新增" class="btnAdd" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:10%;">活动编号</th>
                            <th style="width:10%;">活动名称</th>
                            <th style="width:20%;">活动描述</th>
                            <th style="width:25%;">活动期间</th>
                            <th style="width:12%;">活动类型</th> 
                            <th style="width:8%;">状态</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div> 

            <div id="dvYe" class="target">
                <div class="tool">                   
                   <span class="date">订单日期起<input type="text" placeholder="起始日期" />-订单日期止<input type="text" placeholder="结束日期" /></span>                   
                    <span>选择类型<select class="cmbAnalytic"></select></span>
                   <input type="button" value="查询" class="btnSearch" />
                </div>
                <div class="body">
                    <table class="table1">
                        <thead><tr>
                            <th style="width:8%;" title="是购买过商品还是打款">类型</th>
                            <th style="width:12%;">活动类型</th>
                            <th style="width:10%;">单号</th>
                            <th style="width:10%;">日期</th>
                            <th style="width:12%;">入账金额</th>
                            <th style="width:12%;">赠送金额</th>
                            <th style="width:12%;">订单金额</th>
                            <th style="width:12%;">消费金额</th>                          
                            <th style="width:10%;">余额</th>
                            <th style="width:5%;"></th>
                        </tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="pagination"></div>
            </div>
        </div>
    </div>
</div>
<div id="ft"></div>
</div>

<div id="dvGenerateNo" class="float_box order_read memberno" style="width:350px;">
    <div class="header_floatbox"><h4 class="fleft">生成会员号</h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <div class="tips">总卡数<b></b>未分配<b></b>最小号<b></b>最大号<b></b></div>
        <div>起始编号<input type="text" placeholder="输入8位起始编号" maxlength="8" style="width:200px;" /></div>
        <div>制卡数量<input type="text" placeholder="最多10万张" title="一次生成最多10万张" style="width:200px;" maxlength="5" /></div>
    </div>
    <div class="toolbar">
        <input type="button" value="生成"  class="big-btn btnGenerate" />
    </div>
</div>

<div id="dvAssignNo" class="float_box order_read memberno" style="width:350px;">
    <div class="header_floatbox"><h4 class="fleft">分配卡号给:<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <div class="tips">总卡数<b></b>未分配<b></b>最小号<b></b>最大号<b></b></div>
        <div>起始编号<input type="text" placeholder="起始编号" maxlength="8" /></div>
        <div>结束编号<input type="text" placeholder="结束编号" maxlength="8" /></div>
    </div>
    <div class="toolbar">
        <input type="button" value="评估"  class="big-btn btnEval" />
        <input type="button" value="分配"  class="big-btn btnAssign" />
    </div>
</div>

<div id="dvUpdateAgent" class="float_box order_read" style="width:500px;">
    <div class="header_floatbox"><h4 class="fleft">添加下级经销商<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">上级</th><td style="width:80%;color:Green;font-weight:bold;" class="parent">
                <span class="parentName">春风日化</span>
                <div class="dvcode" style="display:none;"><span class="parentcode">001</span><input type="text" ext="" class="notinc" placeholder="输入下级门店号"  style="width:150px;" /><input type=button value=".." title="选择门店" /></div>
                <a href="javascript://" class="btnAgentSelector">修改</a>
            </td></tr>
            <tr><th style="width:20%;">类型</th><td style="color:Green;font-weight:bold;"></td></tr>
            <tr><th>本级编号</th><td style="width:30px;font-size:20px;"><div style="border:1px solid #eee;"><b class="parentCode" style="color:#ccc;">001</b>
                    <input type="text" style="width:70%;border:0;" title="仅输入本级编号,不包括上级编号" min="001" maxlength=3 placeholder="输入本级三位编号,不包括上级编号"  /></div></td></tr>
            <tr><th>名称</th><td><input type="text" placeholder="输入分销商或门店名称" /></td></tr>
            <tr><th>ERP对应客户</th><td><select title="输入ERP对应客户" style="width:82%" /></td></tr>
            <tr><th>联系电话</th><td><input type="text" placeholder="手机或者固话" maxlength="30" /></td></tr>
            <tr><th>地址</th><td class="address">
                <select style="width:80px;"></select>
                <select style="width:90px;"></select>
                <select style="width:90px;"></select>
            </tr>
            <tr><th>街道</th><td><input type="text" placeholder="街道和名牌号" maxlength="80" /></td></tr>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSave" type="button" value="确定保存" style="width:90px;height:30px;" />
    </div>
</div>

<div id="dvUpdateMember"  class="float_box order_read" style="width:500px;">
    <div class="header_floatbox"><h4 class="fleft">添加下级经销商<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">上级</th><td style="width:80%;"></td></tr>
            <tr><th>门店号</th><td><input type="text" placeholder="输入6位门店号" maxlength="6" /></td></tr>
            <tr><th>名称</th><td><input type="text" placeholder="输入分销商或门店名称" /></td></tr>
            <tr><th>联系电话</th><td><input type="text" placeholder="手机或者固话" maxlength="30" /></td></tr>
            <tr><th>地址</th><td class="address">
                <select style="width:80px;"></select>
                <select style="width:90px;"></select>
                <select style="width:90px;"></select>
            </tr>
            <tr><th>街道</th><td><input type="text" placeholder="街道和名牌号" maxlength="80" /></td></tr>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSave" type="button" value="确定保存" style="width:90px;height:30px;" />
    </div>
</div>

<div id="dvUpdateUser"  class="float_box order_read" style="width:400px;">
    <div class="header_floatbox"><h4 class="fleft"><c>修改</c>用户</h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">门店</th><td style="width:80%;"><input type="text" readonly=readonly placeholder="选择门店号"  /><input type=button value=".." title="选择门店" /></td></tr>
            <tr><th style="width:20%;">登录号</th><td style="width:80%;"><input type="text" placeholder="登录号只能是数字" /></td></tr>
            <tr><th style="width:20%;">密码</th><td style="width:80%;"><input type="password" style="padding:3px;width:80%;" /></td></tr>
            <tr><th>姓名</th><td><input type="text" placeholder="真实姓名" maxlength="6" /></td></tr>
            <tr><th>角色</th><td ><select class="cmbRole">
                <option value="1">总经理</option>
                <option value="5">员工</option>
            </select></td></tr>
            <tr><th>手机</th><td><input type="text" placeholder="手机" maxlength="30" /><input type="hidden"  /></td></tr>
            <tr><th>地址</th><td class="address">
                <select style="width:80px;"></select>
                <select style="width:90px;"></select>
                <select style="width:90px;"></select>
            </tr>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSave" type="button" value="确定保存" style="width:90px;height:30px;" />
    </div>
</div>

<div id="dvGiftDeliveryAction"  class="float_box order_read" style="width:600px;">
    <div class="header_floatbox"><h4 class="fleft">礼品派送</h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">活动</th><td style="width:80%;"><select class="cmbMarketing"></select></td></tr>
            <tr><th style="width:20%;">身份证</th><td style="width:80%;"><input type="text" class="txtId" placeholder="输入本人真实身份证号" style="width:60%;" />
            <input class="btnCheck" style="padding:3px;margin-left:5px;" type="button" value="审核身份证" /></td></tr>
            <tr class="tips" style="display:none;"><th></th><td>
            改身份证已经于<b></b>在终端店<b></b>领取了<b></b>不能重复领取
            </td></tr>
            <tr><th>姓名</th><td><input type="text" lock placeholder="输入真实姓名" maxlength="6" /></td></tr>
            <tr><th>电话/手机</th><td><input type="text" lock placeholder="手机或者固话" maxlength="30" /></td></tr>
            <tr><th>地址</th><td class="address">
                <select style="width:80px;"></select>
                <select style="width:90px;"></select>
                <select style="width:90px;"></select>
            </tr>
            <tr><th>出生日期</th><td><input lock type="text" class="txtBirthday" placeholder="生日自动从身份证号读取" /></td></tr>
            <tr><th>街道</th><td><input lock type="text" placeholder="街道和名牌号" maxlength="80" /></td></tr>
            <tr><th>选择礼品</th><td><select style="width:80%;" class="cmbGift"></select></td></tr>
            <tr><th>捐赠</th><td><input lock type="text"  placeholder="奉献爱心捐赠1元" style="width:25%;" />&nbsp;元</td></tr>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSave" lock type="button" value="确定派送" style="width:90px;height:30px;" />
    </div>
</div>

<div id="dvUpdateStock" class="float_box order_read" style="width:600px;">
    <div class="header_floatbox"><h4 class="fleft">修改产品<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">分类</th><td style="width:30%;color:Green;font-weight:bold;" class="parent">
                <input type="hidden" value="-1" /><select class="cmbCategory" style="width:85%"></select>       
            </td><td colspan=2 rowspan=5 style="text-align:center;"><canvas id="c" width=200 height=150></canvas></td></tr>
            <tr><th>名称</th><td><input type="text" placeholder="输入产品名称" title="输入产品名称" /></td></tr>
            <tr><th>编码</th><td><input type="text" placeholder="修改产品编码" title="修改产品编码" /></td></tr>
            <tr><th>条形码</th><td><input type="text" placeholder="扫描进来条形码" title="扫描进来条形码" /></td></tr>
            <tr><th>数量</th><td><input type="number" placeholder="现在的库存数量" title="现在的库存数量" maxlength="30" /></td></tr>
            <tr><th>单位</th><td><select class="unit"><option value=0>个</option><option value=1>只</option>
                                <option value=2>盒</option><option value=3>套</option><option value=4>袋</option><option value=5>瓶</option><option value=6>支</option></select></td>
                <th>图像</th><td><button class="btnCam">打开摄像头</button><button class="btnFile">选择文件</button><input type="file" style="display:none;" placeholder="选择此商品的靓照" title="选择此商品的靓照" accept="image/*" /></td></tr>
            <tr><th>进货价</th><td><input type="number" placeholder="购入的产品价格" title="购入的产品价格" /></td>
                <th>零售价</th><td><input type="number" placeholder="售卖价格" title="售卖价格" /></td></tr>
            <tr><th>描述</th><td colspan=2><textarea type="text" placeholder="输入对此商品的描述" title="输入对此商品的描述" ></textarea></td></tr>            
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSaveClose" type="button" value="保存并关闭" style="width:100px;height:30px;" />
        <input class="primary-button btnSaveNew" type="button" value="保存并新增" style="width:100px;height:30px;" />
    </div>
</div>

<div id="dvSoUpdate" class="float_box order_read" style="width:700px;">
    <div class="header_floatbox"><h4 class="fleft">修改订单<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">客户</th><td style="width:30%;color:Green;font-weight:bold;" class="parent">
                <input type="hidden" value="-1" /><input type="text" readonly=readonly placeholder="选择客户" />       
            </td><th>订单日期</th><td><input type=text /></td></tr>
            <tr><th>销售员</th><td><select class="cmbSaler" style="width: 84%;" title="选择销售员" /></td>
                <th>总金额</th><td><input type="text" placeholder="输入实收金额" title="输入实收金额" /></tr>
        </table>
        <table class="table2 line">
            <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>单位</th><th>折扣</th><th>小计</th></tr></thead>
            <tbody style="height:200px"><tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSaveClose" type="button" value="保存并关闭" style="width:100px;height:30px;" />
    </div>
</div>

<div id="dvSoView" class="float_box order_read" style="width:700px;">
    <div class="header_floatbox"><h4 class="fleft">查看订单<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">客户</th><td style="width:30%;color:Green;font-weight:bold;" class="parent">
                <input type="hidden" value="-1" /><input type="text" readonly=readonly placeholder="客户" />       
            </td><th>订单日期</th><td><input type="text" readonly=readonly placeholder="选择订单日期" /></td></tr>
            <tr><th>销售员</th><td><input type="text" readonly=readonly placeholder="销售员" /></td>
                <th>总金额</th><td><input type="text" readonly=readonly placeholder="输入实收金额" title="实收金额" /></tr>
        </table>
        <table class="table2 line">
            <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>单位</th><th>折扣</th><th>小计</th></tr></thead>
            <tbody style="height:200px"><tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
        </table>
    </div>
    
</div>

<div id="dvPoUpdate" class="float_box order_read" style="width:700px;">
    <div class="header_floatbox"><h4 class="fleft">修改订单<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">供应商</th><td style="width:30%;color:Green;font-weight:bold;" class="parent">
                <input type="hidden" value="-1" /><input type="text" placeholder="选择供应商" />
            </td><th>订单日期</th><td><input /></td></tr>
            <tr><!--<th>采购员</th><td><select class="cmbSaler" style="width: 84%;" title="选择销售员" /></td>-->
                <th>总金额</th><td><input type="text" placeholder="输入实收金额" title="输入实收金额" />
                <th></th><td></td></tr>
        </table>
        <div class="toolbar"><div class="btnAdd">+</div></div>
        <table class="table2 line">
            <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>单位</th><th>折扣</th><th>小计</th></tr></thead>
            <tbody style="height:200px"><tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSaveClose" type="button" value="保存并关闭" style="width:100px;height:30px;" />
        <input class="primary-button btnSaveNew" type="button" value="保存并新增" style="width:100px;height:30px;" />
    </div>
</div>

<div id="dvPoView" class="float_box order_read" style="width:700px;">
    <div class="header_floatbox"><h4 class="fleft">修改订单<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">供应商</th><td style="width:30%;color:Green;font-weight:bold;" class="parent">
                <input type="hidden" value="-1" /><input type="text" readonly=readonly placeholder="选择供应商" />   
            </td><th>订单日期</th><td><input type=text readonly=readonly /></td></tr>
            <tr><!--<th>采购员</th><td><input type=text readonly=readonly /></td>-->
                <th>总金额</th><td><input type="text" readonly=readonly placeholder="输入实收金额" title="输入实收金额" />
                <th></th><td></td></tr>
        </table>
        <div class="toolbar"><div class="btnAdd">+</div></div>
        <table class="table2 line">
            <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>单位</th><th>折扣</th><th>小计</th></tr></thead>
            <tbody style="height:200px"><tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
        </table>
    </div>    
</div>

<div id="dvCategoryUpdate" style="width:500px;" class="float_box order_read">
    <div class="header_floatbox"><h4 class="fleft">修改产品类别<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:30%;">名称</th><td>
                <input type="hidden" value="-1" /><input type="text" placeholder="分类名称" />    
            </td>
            </tr>
            <tr><th>分类编号</th><td><input type=text /></td></tr>
            <tr><th>分类描述</th><td><textarea></textarea>
                <th></th><td></td></tr>
        </table>
    </div>
    <div class="toolbar">
        <input class="primary-button btnSaveClose" type="button" value="保存并关闭" style="width:100px;height:30px;" />
        <input class="primary-button btnSaveNew" type="button" value="保存并新增" style="width:100px;height:30px;" />
    </div>
</div>

<div id="dvPoPos" style="width:720px;" class="float_box order_read">
	<div class="header_floatbox"><h4 class="fleft">修改订单<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="pos">
		<div class="right">
			<div class="category">
				<ul>
					<!--<li>美白系列化妆</li>-->
				</ul>
			</div>
			<div class="main">
				<ul class="product"></ul>
				<ul class="member"></ul>
			</div>
		</div>
		<div class="left">
			<div class="title"><p>小计</p><p>优惠%</p><p>数量</p><p>单价</p></div>
			<div class="orderDetail">
				<ol>
				</ol>
			</div>
			<div class="info" style="position:relative;">
				<div class="money">
					<div>合计<label>0.00</label></div><!--<div title="点击出现收银台">实收<label>0</label></div><div>找零<label>123456.90</label></div>-->
					</div>			
                 
                    <select class="cmbAnalytic" style="display:none"></select>	
                <div style="width:60%;height:60%;"><input type="button" value="提交" class="primary-button btnAdd" /></div>
				<div class="notic"><label>系统:</label><label>等待输入...</label></div>
				<div class="command" contenteditable="true"></div>
			</div>
		</div>
	</div>  
</div>

<div id="dvAgentSelector" style="width:400px;" class="float_box order_read selector">
	<div class="header_floatbox"><h4 class="fleft">选择上级代理商<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div style="height:400px;text-align:left;overflow-y:auto;">		
		<table class="tblSelector" width=100%>
        <!--<thead><tr><th>名称</th></tr></thead>
-->        <tbody></tbody>
        </table>
	</div>  
</div>

<div id="dvMarketingUpdate" style="width:700px;" class="float_box order_read">
    <div class="header_floatbox"><h4 class="fleft">修改营销活动<b></b></h4><a href="#"><i class="icon_close"></i></a></div>
    <div class="content">
        <table>
            <tr><th style="width:20%;">营销活动名称</th><td><input type="hidden" value="-1" /><input type="text" placeholder="营销活动名称" /></td>
                <th>营销活动代码</th><td><input type=text placeholder="营销活动代码" /></td></tr>
            <tr class="date"><th>营销活动日期起</th><td><input type="text" placeholder="起始日期" /></td>
                            <th>营销活动日期止</th><td><input type="text" placeholder="结束日期" /></td></tr>
            <tr><th>活动类型</th><td><select></select></td>
                            <th>活动细则</th><td></td></tr>
            <tr><th>活动对象类型</th><td style="position:relative" colspan=3><!--<div class="objType"><a href="#">..</a></div>style="position:absolute;"-->
                            <div class="cmbType"><label><input type=checkbox />代理商</label><label><input type=checkbox />终端</label><label><input type=checkbox />连锁店</label></div></td>
                            <!--<th></th><td></td></tr>-->
        </table>
        <div class="toolbar"><div class="btnAdd">+</div><div>产品及分类</div><div>活动对象</div></div>
        <div class="box"></div>
        <%--<table class="table2 line">
            <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>单位</th><th>折扣</th><th>小计</th></tr></thead>
            <tbody style="height:200px"><tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
        </table>--%>
        <div class="toolbar">
            <input class="primary-button btnSaveClose" type="button" value="保存并关闭" style="width:100px;height:30px;" />
            <input class="primary-button btnSaveNew" type="button" value="保存并新增" style="width:100px;height:30px;" />
        </div>
    </div>    
</div>

<div class="contextMenu" id="myMenu_agent">
<ul> 
    <li id="menu_agent_edit"><img src="../images/menu/edit.ico" /> 修改</li> 
    <li id="menu_agent_addChild"><img src="../images/menu/insert.ico" />添加下级</li> 
    <li id="menu_agent_addManager"><img src="../images/menu/Contact-Add.ico" />添加经理</li> 
    <li id="menu_agent_addStaff"><img src="../images/menu/Contact-Add.ico" />添加员工</li> 
    <li id="menu_agent_del"><img src="../images/menu/delete.ico" /> 删除</li> 
</ul> 
</div>

<div class="contextMenu" id="myMenu_user">
<ul> 
    <li id="menu_user_edit"><img src="../images/menu/edit.ico" /> 修改</li> 
    <li id="menu_user_del"><img src="../images/menu/delete.ico" /> 删除</li> 
</ul> 
</div>

<!--#include file="/ctl/ws.shtml"-->
</body>
</html>
