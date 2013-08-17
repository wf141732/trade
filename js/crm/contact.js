/// <reference path="../jquery.aac.js" />
/// <reference path="../common/aacdb.js" />
/// <reference path="../jquery-1.7.1.js" />

var gchat = {
    dv: null,
    dvOuter: null,
    dvMin: null,
    dvSide: null, // 右则面板
    dvMoreWays: null, //更多的联系方式
    dvDial: null, // 拨号面板
    tblRfq: null,
    buf: {}, // 聊天记录缓存 key,val结构
    tit: null,
    msg: null,
    crrnt: { uid: '', name: '', company: '', ac: '', mainnum: '' },
    code: '',
    txt: null,
    mylocal: {},
    ini: function () {
        if (!this.dv) {
            var om = this;
            var al = gls.myLocalphoneSet();
            this.mylocal = {
                ac: al[1]
            }
            this.dvOuter = $('#chat_box');
            this.dv = $('#chat_box .chat_box');
            this.dvSide = this.dv.find('.chat_box_side');
            this.tblRfq = this.dv.find('.rfqpnl');
            this.txt = this.dv.find('.chat_box_post_ta');
            this.dvDial = this.dv.find('.dialpanel');
            this.dvDial.find('.btnDial').click(function () {// 拨号
                om.callto();
            }).end().find('.btnHandup').click(function () {// 挂断
                om.dvDial.find('.btnDial').enable().val('拨号');
                om.dvDial.find('.dialing').find(':text').enable();
            });

            this.dvMin = this.dvOuter.find('.chat_box_ts').click(function () {
                om.dv.fadeIn(1000);
                om.dvMin.hide();
            });

            this.dvMoreWays = $('#dvChatPhoneLst');
            this.dvMoreWays.find('.num').live('click', function () { // 根据电话类型决定如何拨打
                var type = $(this).attr('_type');
                if (type == '1' || type == '2') {
                    om.dvMoreWays.fadeOut();
                    om.dv.find('.chat_box_msg').hide();
                    om.dvDial.fadeIn().find('.dialing :text').val($(this).text());
                    om.callto();
                }
            });

            this.dv.find('.chat_ico_x').click(function () {//关闭
                om.dv.fadeOut();
            }).end().find('.chat_ico_mini').click(function () {//最小化
                om.dv.hide();
                om.dvMin.show().find('.chat_num').text(om.crrnt.name);
            }).end().find('.chat_bt_post').click(function () {
                om.send();
            }).end().find('.btnMoreWays').click(function () {//显示更多的联系方式
                om.dvMoreWays.fadeIn();
                // 获取更多的电话
                gf.noPagination('up_co_get_phoneNumOfContact', [om.crrnt.uid], function (a) {
                    var b = [], num = '';
                    //cc,ac,号码,类型ID,类型
                    for (var i = 0; i < a.length; i++) {
                        b = a[i];
                        num = b[2];
                        if (b[3] == '1') {//手机
                            if (om.mylocal.ac != b[1]) {
                                num = '0' + num;
                            }
                        } else if (b[3] == '2') { //座机
                            if (om.mylocal.ac != b[1]) {
                                num = b[1] + num;
                            }
                        } else if (b[3] == '10') { //QQ
                            num = '<a target="_blank" href="http://wpa.qq.com/msgrd?V=1&amp;Uin=' + num + '&amp;Exe=QQ&amp;Site=《IC全能王》&amp;Menu=No">QQ洽谈</a>';
                        } else if (b[3] == '12') { // skype
                            num = '<a class="skype" href="skype:' + num + '" title="点击skype呼叫">skype呼叫</a>';
                        }
                        a[i] = '<li><span class="phonetype">' + b[4] + '</span><span class="num" _type="' + b[3] + '">' + num + '</span><span class="edit">修改</span></li>';
                    }
                    om.dvMoreWays.html(a.join(''));
                    om.dv.one('click', function () {
                        om.dvMoreWays.hide();
                    });
                });
            }).end().draggable({ handle: '[dragable=dragable]' });
            this.tit = this.dv.find('.chat_box_tit .chat_box_name a');
            this.msg = this.dv.find('.chat_box_msg');
        }
    },
    callto: function () {
        this.dvDial.find('.btnDial').disable().val('正在呼叫..').end().find('.dialing :text').disable();
        var num = this.dvDial.find('.dialing :text').val();
        gExtHook.callto('', num);
    },
    save: function (obj) {
        var otrs = $(obj).parent().parent().parent().parent().find('tbody tr');
        var note = $(obj).parent().find(':text').val();
        var code = $(obj).attr('code'), reply_code = '';
        var b = [], a = [], ato = [];
        var senderid = $(obj).attr('senderid');
        var procName = '';
        if (code == 'inquiry_s2c') {//采购报价
            reply_code = 'quote_c2s';
            procName = 'up_rfq_chat_caigouReply';
            b[0] = ur.user().id;
            b[1] = note;
            otrs.each(function () {
                otxt = $(this).find(':text');
                b[2] = $(this).attr('_id');
                b[3] = otxt.eq(0).val(); //型号
                b[4] = otxt.eq(1).val(); //数量
                b[5] = otxt.eq(2).val(); //报价
                b[6] = otxt.eq(3).val(); //批号
                b[7] = otxt.eq(4).val(); //厂牌
                b[8] = otxt.eq(5).attr('_id'); //芯片状态
                b[9] = otxt.eq(6).attr('ptid'); //供货商平台ID
                a.push(b);
                ato.push([b[3], b[4], b[5], b[6], b[7], otxt.eq(5).val(), otxt.eq(6).val()]);
            });
        } else if (code == 'inquiry_c2g') {//供货商报价
            reply_code = 'quote_g2c';
            procName = 'up_rfq_chat_sureply';
            var otxt = null;
            b[0] = ur.user().id;
            b[1] = senderid;
            b[2] = note;
            otrs.each(function () {
                otxt = $(this).find(':text');
                b[3] = $(this).attr('_id');
                b[4] = otxt.eq(0).val(); //型号
                b[5] = otxt.eq(1).val(); //数量
                b[6] = otxt.eq(2).val(); //报价
                b[7] = otxt.eq(3).val(); //批号
                b[8] = otxt.eq(4).val(); //厂牌
                b[9] = otxt.eq(5).attr('_id'); //芯片状态
                a.push(b);
                ato.push([b[4], b[5], b[6], b[7], b[8], otxt.eq(5).val()]);
            });
        }
        $(obj).disable().val('...');
        gf.callProcBatch(procName, a, function () {
            $(obj).val('已发送');
        });
        gExtHook.sendMsg(ur.user().id, senderid, note, { code: reply_code, data: ato });
    },
    arrive: function (jsn) {// 消息到达
        gf.log(jsn);
        var o = JSON.parse(jsn);
        this.msgpush(1, o.SenderID, o.SenderName, o.SentTime, o.Message);
        if (this.crrnt.uid == o.SenderID || !this.crrnt.uid) {
            this.append(o.SenderName, o.Message, o.SentTime, o.SenderID);
        }
        if (!this.crrnt.uid) this._chat(o.SenderID, o.SenderName);
    },
    switchmode: function (mode) {
        if (mode == 'n') {//窄模式
            this.dv.width(373);
            this.dvSide.hide();
        } else { //宽模式
            this.dv.width(502);
            this.dvSide.show();
        }
    },
    caigouRfq: function (caigouid, name, adata) {// 业务向采购询价
        var om = this;
        //显示询价记录
        var b = [], c = [];
        this.code = 'inquiry_s2c';
        this._chat(caigouid, name);
        for (var i = 0; i < adata.length; i++) {
            b = adata[i];
            c.push(td(f.text(b[1]))); //型号
            c.push(td(f.text(b[2]))); //数量
            c.push(td(f.text('', 'placeholder="目标价"'))); //单价
            c.push(td(f.text(b[3]))); //批号
            c.push(td(f.text(b[4], 'placeholder="厂牌"'))); //厂牌
            c.push(td(f.text('', 'placeholder="芯片状态"'))); //芯片状态
            adata[i] = tr(c.join(''), '_id="' + b[0] + '"');
            c = [];
        }
        this.tblRfq.show().find('tbody').html(adata.join(''));
        // 显示聊天窗口
        this._show();
        this.switchmode('n');
        this.resize();
    },
    surfq: function (adata, coid) {// 显示询价窗口
        var om = this;
        //显示询价记录
        this._surfq(adata);
        this.switchmode('w');
        aac.db.query_icontact_byco(coid, function (a) {
            //conid,nickname,py,gender,avatar,company,ismember,igroupid,isrecent
            if (a.length == 0) { // 如果本地没有继续搜索在线的
                gf.noPagination('up_co_get_icontactofcom', [coid], function (a) {
                    om._member(a);
                });
            } else {
                om._member(a);
            }
        });
    },
    _surfq: function (adata) {//向供货商询价
        var b = [], c = [];
        this.code = 'inquiry_c2g';
        for (var i = 0; i < adata.length; i++) {
            b = adata[i];
            c.push(td(f.text(b[1]))); //型号
            c.push(td(f.text(b[2]))); //数量
            c.push(td(f.text('', 'placeholder="目标价"'))); //单价
            c.push(td(f.text(b[3]))); //批号
            c.push(td(f.text('', 'placeholder="厂牌"'))); //厂牌
            c.push(td(f.text('', 'placeholder="芯片状态"'))); //芯片状态
            adata[i] = tr(c.join(''), '_id="' + b[0] + '"');
            c = [];
        }
        this.tblRfq.show().find('tbody').html(adata.join(''));
        // 显示聊天窗口
        this._show();
        this.resize();
    },
    _show: function () {
        if (this.dv.is(':hidden')) { // 如果没有打开则打开
            this.dv.fadeIn(1000);
            this.dvMin.hide();
        }
        this.dv.find('.chat_box_msg').show();
        this.dvDial.hide();
    },
    _member: function (a) {
        var b = [];
        var om = this;
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            if (!b[3]) b[3] = 'm';
            a[i] = '<div class="item" _id="' + b[0] + '" _name="' + b[1] + '"><img class="chat_user_pic" src="../images/taobao/' + b[3] + '.png"><p class="chat_user_name"><span class="name">' + b[1] + '</span></p><span class="tips-count-gray" style="display: none;">99+</span><a onclick="this.blur()" href="javascript://" target="_blank" class="chat_ico_home"></a></div>';
        }
        this.dvSide.find('.chat_list_s').html(a.join('')).find('div.item').hover(function () {
            $(this).addClass('item_hover');
        }, function () {
            $(this).removeClass('item_hover');
        }).click(function () {
            om._chat($(this).attr('_id'), $(this).attr('_name'));
        });
    },
    resize: function () {// 重新调整窗口个元素尺寸
        var h = this.dv.find('.chat_box_cont').height();
        this.dvSide.find('.chat_list_s').height(h - 31);
    },
    autoscroll: function () {
        var o = this.msg.get(0);
        o.scrollTop = o.scrollHeight;
    },
    send: function () {
        // 发送消息
        var txt = this.txt.text();
        var a = [];
        var name = ur.user().name;
        var osendto = null, ohidden = '', s = '';
        if (this.tblRfq.find('tbody tr').length > 0) {
            var b = [], c = [], otds;
            this.tblRfq.find('tbody tr').each(function () {
                otds = $(this).find(':text');
                b.push($(this).attr('_id'));
                b.push(otds.eq(0).val()); //型号
                b.push(otds.eq(1).val()); //数量
                b.push(otds.eq(2).val()); //目标价
                b.push(otds.eq(3).val()); //批号
                b.push(otds.eq(4).val()); //厂牌
                b.push(otds.eq(5).val()); //芯片状态
                a.push(b);
                b = [];
            });
            ohidden = { code: this.code, data: a };
            txt = '发给' + this.crrnt.name + ' <b>' + a.length + '</b> 条询价';
            this.tblRfq.hide().find('tbody').empty();
            this.resize();
            gChatlist.code = '';
            gChatlist.adata = [];
        } else {
            if (!txt) {
                alert('不能发送空消息');
                return true;
            }
        }
        var omsg = { show: txt, hidden: '' };
        this.append(name, omsg, new Date());
        this.msgpush(0, this.crrnt.uid, name, new Date(), omsg);
        gExtHook.sendMsg(ur.user().id, this.crrnt.uid, this.txt.text(), ohidden);
        this.txt.text('');
    },
    append: function (name, omsg, date, fromid) {
        var stime = gf.dateFormat(date, 'HH:mm:ss');
        if (typeof omsg == 'string') {
            omsg = JSON.parse(omsg);
        }
        var txt = omsg.show;
        var o = null;
        if (omsg.hidden) {
            var a = omsg.hidden.data, ac = [];
            var code = omsg.hidden.code;
            var head = '', colspan = '', footer = '';
            if (code == 'inquiry_c2g' || code == 'quote_g2c') {
                head = '<th style="width:35%;">型号</th>' +
'<th style="width:10%;">数量</th>' +
'<th style="width:10%;">报价</th>' +
'<th style="width:15%;">批号</th>' +
'<th style="width:15%;">厂牌</th>' +
'<th style="width:15%;">状态</th>';
                colspan = '6';
            } else if (code == 'inquiry_s2c' || code == 'quote_c2s') {
                head = '<th style="width:35%;">型号</th>' +
'<th style="width:10%;">数量</th>' +
'<th style="width:10%;">报价</th>' +
'<th style="width:10%;">批号</th>' +
'<th style="width:10%;">厂牌</th>' +
'<th style="width:10%;">状态</th>' +
                '<th style="width:15%;">供货商</th>';
                colspan = '7';
            }
            footer = '<tfoot><tr><td colspan="' + colspan + '"><input type="text" style="width:80%;" placeholder="输入简短说明" /><input type="button" onclick="gchat.save(this);" value="发送报价" title="发送我的报价" senderid="' + fromid + '" code="' + code + '" ' + fromid ? '' : 'disable' + ' /></td></tr></tfoot>';
            for (var i = 0; i < a.length; i++) {
                b = a[i];
                if (code.startsWith('quote')) {//收到采购或者供货商报价直接显示
                    for (var j = 0; j < b.length; j++) ac.push(td(b[j]));
                    footer = '';
                } else {//收到业务或者客户发送的询价 ID,型号,数量,cusPrice,批号,芯片状态,cuNote,芯片状态ID,供货商助记,suId
                    if (code == 'inquiry_c2g') {// 外部 采购发供货商
                        ac.push(td('<input type="text" value="' + b[1] + '" />')); //型号
                        ac.push(td('<input type="text" value="' + b[2] + '" />')); //数量
                        ac.push(td('<input type="text" value="' + b[3] + '" />')); //报价
                        ac.push(td('<input type="text" value="' + b[4] + '" />')); //批号
                        ac.push(td('<input type="text" value="' + b[5] + '" />')); //厂牌
                        ac.push(td('<input type="text" value="' + b[6] + '" class="icstate"  _id="" />')); //状态
                    } else if (code == 'inquiry_s2c') { //内部 销售发采购
                        ac.push(td('<input type="text" value="' + b[1] + '" />')); //型号
                        ac.push(td('<input type="text" value="' + b[2] + '" />')); //数量
                        ac.push(td('<input type="text" value="' + b[3] + '" />')); //报价
                        ac.push(td('<input type="text" value="' + b[4] + '" />')); //批号
                        ac.push(td('<input type="text" value="' + b[5] + '" />')); //厂牌
                        ac.push(td('<input type="text" value="' + b[6] + '" class="icstate" _id="" />')); //状态
                        ac.push(td('<input type="text" value="" class="txtsu"  ptid="" />')); //供货商
                    }
                }
                a[i] = tr(ac.join(''), '_id="' + b[0] + '" class="chatdetail" ');
                ac = [];
            }
            txt = txt + f.table('<thead><tr>' + head + '</tr></thead><tbody>' + a.join('') + '</tbody>' + footer);
            s = '<div class="item" user_name="' + name + '" sign="873082772" style="opacity:0.8;"><div class="chat_item_tool"><div class="chat_item_name"><a href="#" class="from_name">' + name + '</a><span class="chat_item_t">' + stime + '</span></div></div>' + txt + '</div>';
            o = $(s);
            gAutoChipState.auto(o.find('.icstate'));
            gAuto.coptid(o.find('.txtsu'));
        } else {
            s = '<div class="item" user_name="' + name + '" style="opacity:0.8;">' +
'<div class="chat_item_pic"><img src="../images/taobao/m.png" class="chat_user_pic" style="cursor:pointer;"></div>' +
'<div class="chat_item_txt"><div class="chat_item_tool"><div class="chat_item_name"><a href="#" class="from_name">' + name + '</a><span class="chat_item_t">' + stime + '</span></div></div>' + txt + '</div></div>';
            o = $(s);
        }

        this.msg.append(o);
        this.autoscroll();
    },
    msgpush: function (direct, uid, name, date, msg) {
        if (!this.buf[uid]) this.buf[uid] = [];
        this.buf[uid].push([direct, msg, date, name, uid, '', 'm', '0']);
    },
    _chat: function (conid, name) {
        this.ini();
        this.crrnt.uid = conid;
        this.crrnt.name = name;
        this.tit.text(name);

        this._show();
        //改写标题
        //读取本次缓存
        var o = this.buf[conid];
        var a = [], b = [];
        this.msg.empty();
        if (o) {
            for (var i = 0; i < o.length; i++) {
                b = o[i];
                //0:消息类型  0普通 1公告 2结构化消息
                //1:消息体
                //2:消息产生时间
                //3:用户名
                //4:用户ID
                //5:avator
                //6:gender
                //7:方向 0：我发送的 1：我接受的
                this.append(b[3], b[1], b[2]);
            }
        }
    },
    chat: function (conid, name) {
        this._chat(conid, name);
        this.switchmode('n');
        if (gChatlist.code == 'inquiry_c2g') {
            this._surfq(gChatlist.adata.concat());
        }
    }
}



var gChatlist = {
    dv: null,
    crrntmode: 'one', // 当前查询模式 one or group
    txtKey: null,
    code: '', // 聊天模式 chat,inquiry_c2g
    adata: [],
    hisType: 'call', //
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#chat_list');
            this.txtKey = this.dv.find('.chat_search_ipt');
            this.dv.find('.chat_list_one_o').live('click', function () {
                var o = $('#chat_list_one_' + $(this).attr('boxfor'));
                if (o.is(':hidden')) {// 如果隐藏则显示
                    o.show();
                    $(this).find('span.chat_ico_a_r').removeClass('chat_ico_a_r').addClass('chat_ico_a_d');
                } else {
                    $(this).find('span.chat_ico_a_d').removeClass('chat_ico_a_d').addClass('chat_ico_a_r');
                    o.hide();
                }
            }).end().find('.chat_search_ipt').keyup(function () {
                om.search($(this).val());
            }).end().find('.chat_sort>div').click(function () {
                if (!$(this).hasClass('item_now')) {
                    om.crrntmode = $(this).attr('boxfor');
                    $(this).parent().find('.item_now').removeClass('item_now').end().end().addClass('item_now');
                    $('#chat_list_group,#chat_list_one').hide();
                    var o = $('#chat_list_' + $(this).attr('boxfor')).show();
                    if (o.find('.item').length == 0) {
                        om.search();
                    }
                }
            }).end().find('.chat_list_close').click(function () {
                om.dv.find('.chat_list_box').hide().end().find('.chat_ts').show();
                om.dv.height(31).css('margin-top', -31);
            }).hover(function () { $(this).addClass('chat_list_close_hover'); }, function () {
                $(this).removeClass('chat_list_close_hover');
            }).end().find('.chat_ts').click(function () {
                om._open();
            }).hover(function () { $(this).addClass('chat_hover'); }, function () { $(this).removeClass('chat_hover'); });

            $('#chat_list_one').contextMenu('myMenu_ChatLst', {// 右键菜单
                bindings: {
                    'menu_ship_edit': function (t) {
                        mShipUpdate.show(t, $(t).attr('_id'));
                    },
                    'menu_chatlst_refresh': function (t) {
                        if (confirm('真的要刷新联系人吗')) {
                            aac.db.sync_icontact(om.search);
                        }
                    }
                }
            });

            $('#chat_list_group').contextMenu('myMenu_histype', {// 最近记录类型
                bindings: {
                    'menu_histype_call': function (t) {
                        $('#menu_histype_call').find('img').attr('src', '../images/menu/ok.ico');
                        $('#menu_histype_chat').find('img').attr('src', '../images/menu/blank.gif');
                        om.hisType = 'call';
                        om.search();
                    },
                    'menu_histype_chat': function (t) {
                        om.hisType = 'chat';
                        $('#menu_histype_call').find('img').attr('src', '../images/menu/blank.gif');
                        $('#menu_histype_chat').find('img').attr('src', '../images/menu/ok.ico');
                        om.search();
                    }
                }
            });
            this.search();
        }
    },
    _open: function () {// 打开面板
        this.dv.find('.chat_list_box').show().end().find('.chat_ts').hide();
        this.dv.height(372).css('margin-top', -372);
    },
    openForRfq: function (adata) {
        this.code = 'inquiry_c2g';
        this.adata = adata;
        this._open();
    },
    assign: function (obj) {// 给供货商分配询价
        // 收集选中询价
        var c = [];
        var aId = [];
        for (var i = 0; i < this.adata.length; i++) {
            aId.push(this.adata[i][0]);
        }
        c.push($(obj).parent().attr('_id')); // 供货商 联系人
        c.push(aId.join(','));
        c.push(ur.user().id);
        if (c[1]) {
            var oname = $(obj).parent().find('.name');
            var n = oname.text();
            oname.text('分配询价..');
            gf.callProc('up_rfq_assignToMember', c, function () {
                outputMsg("分配成功");
                oname.text(n);
            });
        } else {
            alert("您还未选择询价");
        }
    },
    fitem: function (b) {
        if (!b[3]) b[3] = 'm';
        //conid,nickname,py,gender,avatar,company,ismember,igroupid,coid,cc,ac,mainnum,phonetype,isrecent
        if (!b[1]) b[1] = b[11];
        return '<div class="item" _id="' + b[0] + '" _name="' + b[1] + '" ac="'+b[10]+'" mainnum="'+b[11]+'"><img class="chat_user_pic" src="../images/taobao/' + b[3] + '.png"><p class="chat_user_name"><span class="name">' + b[1] + '</span></p><span class="tips-count-gray" style="display:none;">99+</span><a onclick="this.blur()" href="javascript://" target="_blank" class="chat_ico_home" title="分配询价"></a></div>';
    },
    fitem_recent: function (b) {
        if (!b[3]) b[3] = 'm';
        //conid,nickname,py,gender,avatar,CREATION_DATE,ismember,0,coid,'','',number,'',0 
        b[5] = gf.dateFormat(f.oDate(b[5]), 'HH:mm');
        if (!b[1]) b[1] = b[11];
        return '<div class="item" _id="' + b[0] + '" _name="' + b[1] + '" ac="' + b[10] + '" mainnum="' + b[11] + '"><img class="chat_user_pic" src="../images/taobao/' + b[3] + '.png"><p class="chat_user_name"><span class="name">' + b[1] + '</span></p><span class="tips-count-gray">' + b[5] + '</span><a onclick="this.blur()" href="javascript://" target="_blank" class="chat_ico_home" title="分配询价"></a></div>';
    },
    _flst: function (a) {
        var s = a.join('');
        var om = this;
        $('#chat_list_' + om.crrntmode).html(s).find('div.item').hover(function () {
            $(this).addClass('item_hover');
        }, function () {
            $(this).removeClass('item_hover');
        }).click(function () {
            gchat.chat($(this).attr('_id'), $(this).attr('_name'));
        }).find('.chat_ico_home').click(function (e) {
            om.assign(this);
            gStopBubble(e);
        });
    },
    search: function () {
        var om = gChatlist;
        var key = om.txtKey.val();
        var ismember = '', s = '';
        if (om.crrntmode == 'one') {// 我的商友
            ismember = '1';
            aac.db.query_icontact_bykey(key, ismember, function (a) {
                //conid,nickname,py,gender,avatar,company,ismember,igroupid,coid,cc,ac,mainnum,phonetype,isrecent
                var aColleague = [], afried = [];
                var coid = ur.company().id;
                for (var i = 0; i < a.length; i++) {
                    if (a[i][8] == coid) {
                        aColleague.push(om.fitem(a[i]));
                    } else {
                        afried.push(om.fitem(a[i]));
                    }
                }
                if (!key) {
                    a = ['<div class="chat_list_one_o" boxfor="recent">我司好友[<span class="count_online">0</span>/<span class="count_total">' + aColleague.length.toString() + '</span>]<span class="chat_ico_a_r"></span></div>' +
                '<div class="chat_list_one_f" id="chat_list_one_recent" style="display:none;">' + aColleague.join('') + '</div>' +
                '<div class="chat_list_one_o" boxfor="friend">好友[<span class="count_online">1</span>/<span class="count_total">' + a.length.toString() + '</span>]<span class="chat_ico_a_d"></span></div>' +
                '<div class="chat_list_one_f" id="chat_list_one_friend" style="display:block;">' + afried.join('') + '</div>'];
                }
                om._flst(a);
            });
        } else if (om.crrntmode == 'group') { // 通话记录
            if (om.hisType == 'chat') {
                aac.db.query_icontact_recent(function (a) {
                    //conid,nickname,py,gender,avatar,company,ismember,igroupid,coid,cc,ac,mainnum,phonetype,isrecent
                    for (var i = 0; i < a.length; i++) {
                        a[i] = om.fitem(a[i]);
                    }
                    om._flst(a);
                });
            } else {
                gf.noPagination('up_phone_getHis', [ur.user().id], function (a) {
                    //conid,nickname,py,gender,avatar,CREATION_DATE,ismember,0,coid,'','',number,direct,0 
                    for (var i = 0; i < a.length; i++) {
                        a[i] = om.fitem_recent(a[i]);
                    }
                    om._flst(a);
                });
            }
        }
    }
}