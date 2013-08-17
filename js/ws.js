/// <reference path="jquery-1.8.0.min.js" />
/// <reference path="base.js" />


var ws = (function () {
    var o = { unread: {} }, msg = { from: null, to: null, content: '' }, times = 10, timeout = 10000, retry = times, closed = true;
    //判断浏览器是否支持
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!WebSocket) {
        return;
    }
    var connection = null;

    var onListener = function () {//重新注册监听
        //连接完成后传递用户信息
        connection.onopen = function () {
            closed = false;
            if (ur.user().id) {
                connection.send(ur.user().id);
                if (ws.friend.friends) {
                    ws.send({ friends: ws.friend.friends });
                }
                retry = times;
            }
        };
        //连接出错
        connection.onerror = function () {
            closed = true;
            setTimeout(connect, timeout);
        };

        //连接关闭
        connection.onclose = function () {
            closed = true;
            setTimeout(connect, timeout);
        };

        //接收到消息
        connection.onmessage = function (message) {
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.data);
                return;
            }
            //接收消息的类型
            if (json.type === 'color') {

            } else if (json.type === 'history' || json.type === 'message') {
                for (var i = 0, b; b = json.data[i]; i++) {
                    if (o.unread[b.from]) {
                        o.unread[b.from].his.push(b);
                    }
                    else {
                        o.unread[b.from] = { his: [b] };
                    }
                    if (o.chat.id != b.from)//当前显示的对话用户不是发送消息的用户则闪烁
                        ws.friend.hasMessage(b.from);
                    else {//如果是当前对话的用户则直接显示消息
                        ws.chat.showMsg({ id: b.from });
                    }
                }
            } else if (json.type === 'cmd') {
                evel(json.data);
            } else if (json.type === 'admin') {
                addMessage(json.data.author, JSON.stringify(json.data),
                       json.data.color, new Date(json.data.time));
            } else if (json.type === 'status') {
                ws.friend.updateFriendStatus(json.id, json.data);
            } else {
                console.log('Hmm..., I\'ve never seen JSON like this: ', json);
            }
        };
    }

    var connect = function () {
        //初始化连接
        if (!retry)
        { return; }
        if (connection == null || connection.readyState != 1 || closed) {
            connection = new WebSocket('ws://58.53.128.165:1337');
            //onopen();
            onListener();
            //setTimeout(connect, timeout);
            retry--;
        }
    };

    if (ur.user().id) {
        connect();
    }

    o.send = function (msg) {
        if (connection.readyState != 1 || closed) {//如果连接关闭
            setTimeout(function () { o.send(msg); }, timeout * 2);
        }
        else {
            connection.send(JSON.stringify(msg));
        }
    };
    return o;
})()

ws.friend = (function () {
    var o = { dv: null },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvWS');
            gf.noPagination('get_friend', [ur.user().id], function (a) {
                var c = [], d = [];
                for (var b, i = 0; b = a[i]; i++) {
                    c.push(fdata(b));
                    d.push(b[0]);
                }
                ws.send({ friends: d }); //将好友信息传递到后台
                o.friends = d;
                o.dv.find('.friends').html(c.join(''));
            }, 2);
            o.dv.find('.friend').live('click', function () {
                var u = {}; u.name = $(this).find('.name').text(); u.code = $(this).find('.number').text(); u.id = $(this).attr('data-id');
                ws.chat.show(u);
            })
        }
    },
    fdata = function (a) {
        var format = ' <div class="friend {3}" data-id="{0}"><div class="number"><small>{1}</small></div><div class="name">{2}</div></div>';
        return formatStr(format, a);
    };
    o.hasMessage = function (uid) {
        o.dv.find('.friend[data-id=' + uid + ']').addClass('unread');
    };
    o.noMessage = function (uid) {
        o.dv.find('.friend[data-id=' + uid + ']').removeClass('unread');
    };
    o.updateFriendStatus = function (id, status) {
        //如果已经获取到用户，则直接更新用户并把用户提到最前
        var friend = o.dv.find('.friend[data-id=' + id + ']');
        if (friend.size() > 0) {
            if (status === 'o') {
                friend.parent().prepend(friend.removeClass('d').addClass('o'));
            }
            else {
                friend.parent().find('.o').not(friend).last().after(friend.removeClass('o').addClass('d'));
            }
        }
        //如果未获取用户，则在对象上标记用户在线，然后根据获取用户后标记为在线，应该不存在这种状态
    };
    var base = base || null;
    if (base)
        base.iniFun.push(ini);
    else
        $(function () { ini(); })
    return o;
})()

ws.chat = (function () {
    var o = { dv: null },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvChat');
            o.dv.modal({ backdrop: false }).on('hide', function () {
                o.id = null;
            });
            o.dv.find('.btn-success').click(function () {
                var msg = o.dv.find('.content').html().trim();
                if (msg) {
                    var m = {};
                    m.from = ur.user().id;
                    m.to = o.id;
                    m.fromName = ur.user().name;
                    m.content = msg;
                    ws.send(m);
                    o.dv.find('.content').html('');
                    fdataHis([{ time: (new Date()), fromName: ur.user().name, text: msg}]);
                }
            });
        }
    };
    o.showMsg = function (u) {
        if (ws.unread[u.id] && ws.unread[u.id].his.length > 0) {
            var his = ws.unread[u.id].his;
            fdataHis(his);
            ws.unread[u.id].his = [];
            ws.friend.noMessage(u.id);
        }
    };
    var fdataHis = function (his) {
        var format = '<div><div class="title">{1} {0}</div><div class="con">{2}</div></div>', c = [];
        for (var i = 0, b; b = his[i]; i++) {
            c.push(formatStr(format, [parseDate(b.time), b.fromName, b.text]));
        }
        var msg=o.dv.find('.msg').append(c.join(''));
        msg[0].scrollTop = msg[0].scrollHeight;
    }
    o.show = function (u) {
        ini();
        o.dv.find('.modal-header').find('c').html(u.name).end().find('small').html(u.code);
        o.dv.modal('show');
        o.id = u.id;
        o.showMsg(u);
    };
    return o;
})()

var parseDate = function (date) {
    var d = new Date(Date.parse(date));
    function fq(n) {
        if (n.toString().length === 1) {
            return '0' + n.toString();
        }
        return n.toString();
    }
    return fq(d.getMonth()) + '-' + fq(d.getDate()) + ' ' + fq(d.getHours()) + ':' + fq(d.getMinutes()) + ':' + fq(d.getSeconds());
}
//$(function () {
//    window.WebSocket = window.WebSocket || window.MozWebSocket;

//    if (!WebSocket) {
//        return;
//    }

//    var connection = new WebSocket('ws://58.53.128.165:1337');
//    //连接打开后
//    connection.onopen = function () {
//        if (ur.user().id) {
//            connection.send(ur.user().id);
//        }
//    };
//    //接收到消息
//    connection.onmessage = function (message) {
//        try {
//            var json = JSON.parse(message.data);
//        } catch (e) {
//            console.log('This doesn\'t look like a valid JSON: ', message.data);
//            return;
//        }
//        //接收消息的类型
//        if (json.type === 'color') {

//        } else if (json.type === 'history') {

//        } else if (json.type === 'message') { // it's a single message

//        } else if (json.type = 'cmd') {
//            evel(json.data);
//        } else if (json.type === 'admin') {
//            addMessage(json.data.author, JSON.stringify(json.data),
//                       json.data.color, new Date(json.data.time));
//        } else {
//            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
//        }
//    };
//})