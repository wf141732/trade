<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="m_index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>欧美姿会员管理系统</title>
    <script src="../js/version.js" type="text/javascript"></script>
    <script src="js/zepto.min.js" type="text/javascript"></script>
    <script src="js/zepto/zepto.cookie.min.js" type="text/javascript"></script>
    <script src="js/baidu.json.min.js" type="text/javascript"></script>
    <script src="js/common.min.js?ver=1.1" type="text/javascript"></script>
    <meta name="viewport" content="user-scalable=yes,width=device-width,initial-scale=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <link rel="apple-touch-icon-precomposed" href="img/icon.png"/>
    <link rel="apple-touch-icon" href="img/icon.png"/>
    <link rel="apple-touch-startup-image" href="img/icon.png" />
    <script>
        var wl = window.location.toString();
        //alert(wl.indexOf('#') < 0);
        if (wl.indexOf('#')<0)
            window.scrollTo(100, 0);
        $(function () {
            checkLogin();
            //window.location = '#bd';
            var oli = null;
            var a = [ur.user().name, ur.user().coName, gaRank[ur.user().rank]];
            $('#hd .logininfo b').each(function (i) { $(this).text(a[i]) });

            var _category = function () {
                if (!ur.user().erpID) return;
                pgf.codeData('category', [ur.user().erpID], function (a) {
                    var c = [];
                    for (var i = 0, b = []; b = a[i]; i++) {//<input type="checkbox" />
                        c.push('<tr id="' + b[0] + '"><td><a href="#' + b[0] + '" class="c" data-id=' + b[0] + '><div class="exp"></div>' + b[1] + '<b></b></a><table class="detail" style="display:none"><tbody></tbody></table></td></tr>');
                    }
                    $('#category').html(c.join(''));
                });
            }
            _category();

            $('#category>tr>td>a.c').live('click', function () {//点击系列后
                var o = $(this).parent();
                if ($(this).find('div').hasClass('exp')) {
                    $(this).find('div').removeClass('exp').addClass('col');
                    if (o.find('.detail tr').length > 0) {
                        o.find('.detail').show(); return;
                    }
                }
                else {
                    $(this).find('div').removeClass('col').addClass('exp');
                    o.find('.detail').hide();
                    return false;
                }
                var cid = $(this).attr('data-id');
                pgf.codeData('product', [cid], function (a) {
                    var c = [], l = a.length; //<input type="checkbox"/>
                    var tr = '';
                    for (var i = 0, b = []; b = a[i]; i++) {
                        if (i % 3 == 0) {
                            tr = '<tr>';
                        }
                        tr += '<td data-id=' + b[0] + ' data-cid="' + cid + '"><a href="#ctrl" class="c" title="单击添加"><e>' + b[1] + '</e>[￥<c>' + b[2] + '</c>]</a><b title="单击删除"></b></td>';
                        if (i % 3 == 2 || i == a.length - 1) {
                            tr += '</tr>';
                            c.push(tr);
                        }
                    }
                    o.find('.detail').show().find('tbody').html(c.join(''));
                });
            })

            var detailId = 0, cid = 0, detail = null;
            $('.detail a.c').live('click', function () {
                detail = $(this);
                detailId = detail.parent().attr('data-id');
                cid = $(this).parent().attr('data-cid');
                $('#hd').hide();
                var ctrl = $('#ctrl')
                ctrl.show().find('input').val(detail.next().html()).focus().keypress(function (evt) {
                    if (evt.keyCode == 13)
                        _confrim();
                });
                ctrl.find('.title h3').html($(this).html());
            })
            function _total() {
                var num = 0;
                $('#' + cid).find('.detail td.hasNum b').each(function () {
                    num += $(this).html() ? parseInt($(this).html()) : 0;
                });
                $('#' + cid).find('a>b').html(num || '');
            }
            function _return() {
                $('#ctrl').hide();
                $('#hd').show();
                window.location = "#" + cid;
            }
            function _confrim() {
                var num = $('#ctrl .main input').val();
                detail.next().html(num || '');
                if (num) {
                    detail.parent().addClass('hasNum');
                }
                else {
                    detail.parent().removeClass('hasNum');
                }
                _total();
            }
            var b = $('.bar button');
            b.eq(0).click(function () {
                _return();
                _confrim();
            });
            b.eq(1).click(function () {
                _return();
            });

            $('.dvBtnM button').on('click', function () {
                var lines = $('.dvMain').find('.hasNum');
                if (lines.length) {
                    $('.dvMain,.dvBtnM').hide();
                    var c = [], price = 0, qty = 0, total = 0;
                    for (var i = 0, b = []; b = lines[i]; i++) {
                        price = parseFloat($(b).find('c').html());
                        qty = parseFloat($(b).find('b').html());
                        c.push('<tr><td><div data-id="' + $(b).attr('data-id') + '">' + (i + 1) + '.' + $(b).find('a>e').html() +
                                    '</div><div><p>￥<e>' + price + '</e></p><p>' +
                                 qty + '</p><p>0</p><p>' + (price * qty) + '</p></div></td></tr>');
                        total += price * qty;
                    }
                    $('#order table tbody').html(c.join(''));
                    $('.dvBtnO b').html(total);
                    $('#order,.dvBtnO').show();
                }
                else {
                    alert('未选择产品!');
                }
            })


            $('.dvBtnO button.u').on('click', function () {//上一步
                $('.dvMain,.dvBtnM').show();
                $('#order,.dvBtnO').hide();
            });
            var _getLines = function (o, a) {
                var line = [], lines = [];
                o.each(function () {
                    var obj = $(this).find('div').eq(0), price = $(this).find('p').eq(0).find('e').html(),
                        qty = $(this).find('p').eq(1).html(),
                        discount = $(this).find('p').eq(2).html();
                    line = [];
                    line.push(a[0]);
                    line.push(obj.attr('data-id'));
                    line.push(qty);
                    line.push(discount || 0);
                    line.push(price);
                    line.push(ur.user().id);
                    lines.push(line)
                });
                return lines;
            }
            var _submitEnd = function () {
                alert('保存成功！');
                $('#order,.dvBtnO').hide();
                $('.dvOrder').show();
                _showOrders();
            }
            var td = function (v) {
                return '<td>' + v + '</td>'
            }
            var tr = function (v, att) {
                return '<tr ' + att + '>' + v + '</tr>'
            }
            var _fdata = function (a) {
                var c = [];
                c.push(td(a[1]));
                c.push(td(a[7]));
                c.push(td(a[3]));
                c.push(td(a[8] ? a[8] : '否'));
                c.push(td("<progress value=" + (parseFloat(a[5]) * 100 || 0) + " max=100>" + (parseFloat(a[5]) * 100 || 0) + "%</progress>"));
                return tr(c.join(""), '_id="' + a[0] + '"');
            }
            var _showOrders = function () {
                var t = [];
                pgf.codeTableData('soHead', [ur.user().erpID, '1=1'], function (a) {
                    for (var i = 0, l = a.length; i < l; i++) {
                        t.push(_fdata(a[i]));
                    }
                    if (t.length)
                        $('.dvOrder tbody').html(t.join(''));
                    else
                        $('.dvOrder tbody').html('查询无记录');
                });
            }
            var _submit = function () {
                var head = [], lines = [], uid = ur.user().id;
                head.push(ur.user().erpID || ur.user().agentId);
                head.push($('.dvBtnO label b').html() || 0);
                head.push($('#order textarea').val());
                head.push('null')//analytic;
                var o = $('#order table tr td');
                if (o.size) {
                    pgf.codeData('createSoHead', head, function (a) {
                        lines = _getLines(o, a);
                        pgf.batchUpdate('createSoLine', lines, function () { _submitEnd(); })
                    })
                }
            }

            $('.dvBtnO button.s').on('click', function () {
                _submit();
                _clear();
            })
            $('.dvBtnM a').on('click', function () {
                $('.dvMain,.dvBtnM').hide();
                $('.dvOrder').show();
                _showOrders();
            })
            $('.dvOrder button').eq(0).click(function () {
                _showOrders();
            });
            $('.dvOrder button').eq(1).click(function () {
                $('.dvMain,.dvBtnM').show();
                $('.dvOrder').hide();
            });
            var _clear = function () {
                $('.dvMain b').html('');
                $('.dvMain .hasNum').removeClass('hasNum');
                $('#order body tbody').html('');
                $('#order textarea').val('');
            }
        })
    </script>
    <style>
        input{width:30px;height:20px;}
        button{width:90px;height:30px;margin: 7px 7px 7px 0px;}
        #category>tr{cursor:pointer;padding-bottom:10px;font-size:25px;float:none;}      
        #category td .detail td{font-size:18px;width:31%;border: 1px solid gray;border-radius:5px;margin: 1%;text-align:center;position:relative;}
        #category td>ul{padding-left: 5px;margin-top: 5px;}  
        table{width:100%;}
        #category{padding-left: 5px;}
        #category td>a.c>div{width:20px;height:16px;float: left;margin-top: 5px;}
        #category td>a.c>div.exp{background-image: url(/images/toggle-expand-dark.png);}
        #category td>a.c>div.col{background-image: url(/images/toggle-collapse-dark.png);}
        b{ color:Blue;}
        #category a:link {color: #323E32;text-decoration:none;} 
        #category a:visited {color: #323E32;text-decoration:none;} 
        #category a:hover {color: #323E32;text-decoration:none;}
        #category a:active {color: #323E32;text-decoration:none;}
        #ctrl {display:none;}
        #ctrl .main div{float:left;text-align:center;}
        #ctrl .main button,#ctrl .main input{height:45px;font-size:30px;}
        .wait,.notice{position:fixed;top:5px;right:5px;}
        #ctrl td button{margin:3px;}
        #ctrl td{text-align:center;}
        #ctrl .bar {text-align:center;}
        #ctrl .bar button{height:30px;font-size:20px; }
        #order,.dvBtnO{display:none;}
        #order div{width:100%}        
        #order p{float:left;width: 20%;padding-left: 3%;margin-top: 5px;margin-bottom: 7px;text-align:right}
        .dvOrder table th {border-bottom: 1px solid #8DBBE7;font-weight: bold;background: -webkit-linear-gradient(#DAEDFF,#ABD1F6);}
        .dvOrder table th,.dvOrder table td {text-align: left;border: 1px solid #B9DDFF; border-width:1px 0px 0px 0px;white-space:nowrap; }
        table {border-spacing: 0px;}
    </style>
</head>
<body>
    <div id="bd"></div>
    <div id="hd">
        <div>
            <h1>欧美姿会员管理系统</h1>
            <span class="logininfo">欢迎<b></b>,来自<a href="l.aspx"><b></b>[<b></b>]</a></span>
        </div>
        <div class="dvBtnM" style="padding-top: 8px;"><button>下一步</button><a href="#">查看订单</a></div>
        <div class="dvBtnO" style="padding-top: 8px;"><button class="u">上一步</button><button class="s">提交订单</button><label style="white-space:nowrap">合计：￥<b></b></label></div>
        <div class="dvMain" style="font-size:20px;">
            <table><tbody id="category"></tbody></table></div>        
        <div id="order"><table><thead></thead><tbody></tbody></table>
            <div><textarea style="width: 100%;" placeholder="留言"></textarea></div></div>
        <div class="dvBtnM"><button>下一步</button><a href="#">查看订单</a></div>
        <div class="dvBtnO"><button class="u">上一步</button><button class="s">提交订单</button><label>合计：￥<b></b></label></div>
        <div class="dvOrder" style="display:none;">
            <div><button>刷新</button><button>返回</button></div>
            <table><thead><tr><th style="width:15%;min-width:60px;">编号</th><th style="width:15%;min-width:60px;">日期</th>
                            <th style="width:20%;min-width:60px;">总金额</th><th style="width:15%;min-width:50px;">确认</th>
                            <th style="width:30%;min-width:60px;">已发货</th></tr></thead><tbody></tbody></table></div>
     </div>
     <table id="ctrl" class="ctrl" style="width:100%; padding:0px;">
                        <tr class="title"><td colspan=3 style="background:green;"><h3 style="margin: 12px;">名称</h3></td></tr>
                        <tr class="main"><td style="width:100%;min-width:60px;overflow:hidden;" colspan=2><input style="width:99%" type="number"/></td></tr>
                        <!--<tr class="main"><td style="width:50%;min-width:20px;"><button>+</button></td>
                            <td style="width:50%;min-width:20px;"><button style="margin-left:5px;">-</button></td></tr>-->
                        <tr class="bar"><td><button>确定</button></td><td><button>取消</button></td></tr></table>    
</body>
</html>
