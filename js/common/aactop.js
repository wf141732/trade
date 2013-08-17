/// <reference path="../jquery-1.6.2.min.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="aacajax.js" />
/// <reference path="aacconfig.js" />
/// <reference path="md5.js" />

aac.top = {
    session: function () {
        var o;
        if (localStorage.topSessionKey) {
            o = JSON.parse(localStorage.topSessionKey);
            if ((new Date().getTime() - o.datetime) >= 1000 * 60 * 5) {
                o = false;
            }
        }
        else {
            o = false;
        }
        return o;
    },
    requestbefore: function () {
        var d = new Date(), t = gf.dateFormat(d, 'yyyy-MM-dd HH:mm:ss'),
         om = aac.config.top, s, o;
        o = om.session();
        return [['timestamp', t], ['v', om.version], ['sign_method', 'md5'], ['app_key', om.appkey], ['format', om.format], ['session', o.key]]; //, ['partner_id', 'top-apitools']
    },
    geturi: function (a) {
        var om = this, b = [], i = 0, m = '';
        a = a.concat(om.requestbefore());
        a.sort();
        b = a.concat();
        for (i = 0; i < b.length; i++) {
            b[i] = b[i].join('');
        };
        b = aac.config.top.appsecret + b.join('') + aac.config.top.appsecret;
        m = calcMD5(b).toUpperCase();
        a.push(['sign', m]);
        for (i = 0; i < a.length; i++) {
            a[i] = (a[i][0] + '=' + encodeURIComponent(a[i][1]));
        }
        return aac.config.top.apiurl + a.join('&');
    },
    executePro: function (a, callback) {
        var om = this;
        aac.ajax({
            url: 'taobao.ashx',
            code: 'Pro',
            data: om.geturi(a),
            success: callback
        });
    },
    execute: function (a, code, callback) {
        var om = this;
        a.push(om.session().key);
        aac.ajax({
            url: 'taobao.ashx',
            code: code,
            data: a,
            success: callback
        });
    }
};