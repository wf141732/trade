/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />

var gaRank = ['厂家', '代理商', '终端店', '连锁店'];
var Host = window.location.protocol + "//" + window.location.host + '/';
var splt1 = '|~'
var gurl = {
    root: Host
}



function checkLogin() {
    // 检查登录状态 每个页面必须调用该方法
    //var s = localStorage.userdetail;
    var s = $.cookie("user_data");
    if (s) {// 未登录
        return true;
    } else {// 登录
        setTimeout(function () {
            window.location = gurl.root + "shop/my_account.shtml?to=" + window.location.href;
        }, 200);
        return false;
    }
}
function logout() {
    $.cookie("userid", null);
    gls.clear();
    window.location = gurl.root + "shop/my_account.shtml";
}

var gls = {// localStorage 方法   
    aAu: [], // 权限
    aMyFunc: [],
    ini: function () {
    },
    // 以下是加工厂专用，以后要独立出来
    toJson: function (data) {
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                gf.log('toJson:' + data);
                return {};
            }
        } else return {};
    },
    clear: function () {
        localStorage.userdetail = '';
    }
}


var ur = {
    a: [],
    ini: function (index) {
        //        if (this.a.length == 0) {
        //            //this.a = decodeURIComponent(localStorage.userdetail).split(splt1);
        //            var s = decodeURIComponent($.cookie("user_data"));
        //            if (s) this.a = s.split(splt1);
        //        }
        var o = this;
        if (o.a.length == 0) {
            //this.a = decodeURIComponent(localStorage.userdetail).split(splt1);
            if ($.cookie("user_data")) {
                try {
                    var s = JSON.parse(decodeURIComponent($.cookie("user_data")));
                }
                catch (e) {
                    var s = decodeURIComponent($.cookie("user_data"));
                }
                if ($.isArray(s)) {
                    o.a = s;
                }
                else {
                    if (s) o.a = s.split(splt1);
                }
            }
        }
    },
    user: function () {
        //ID,name,DistrictCode,agentId,role,memberDate,total_point,consumed_point,rank,agentId,companyName,children
        this.ini();
        return {
            id: this.a[0],
            name: this.a[1], //真实姓名
            role: this.a[4], //角色
            agentId: this.a[3], // 我的默认平台ID
            DistrictCode: this.a[2],
            rank: this.a[8],
            coid: this.a[9],
            coName: this.a[10],
            code: this.a[11],
            children: this.a[12]
        };
    }
};


var gAuto = {
    code: function (txts, callback) {// 智能提示公司
        this.complete(txts, 1, 15, 2, function (a) {//ID,助记名,全称,拼音码,平台ID
            //code,name,id,rank,DistrictCode
            var c = {}
            c.label = a[0];
            c.value = a[0];
            c.id = a[2];
            c.name = a[1];
            c.dc = a[4];
            c.rank = a[3];
            c.tips = a[1] + gaRank[a[3]]; // 额外提示信息
            return c;
        }, callback);
    },
    complete: function (txts, type, qty, minLength, fResponse, callback) {
        $(txts).blur(function () {
            if (!$(this).val()) {
                $(this).attr('_id', '');
            }
        });
        txts.autocomplete({
            source: function (request, response) {
                var ext = txts.attr('ext');
                gf.noPagination('member_autoComplete', [request.term, qty, ur.user().agentId, ur.user().id, type, ext], function (a) {
                    for (var i = 0; i < a.length; i++) a[i] = fResponse(a[i]);
                    response(a);
                });
            },
            select: function (event, ui) {
                if (ui.item.id) $(this).attr('_id', ui.item.id);
                if ($.isFunction(callback)) callback(ui.item, this);
            },
            close: function (event, ui) {
            },
            change: function (event, ui) {
            },
            minLength: minLength
        });
        if (txts.size() > 0) {
            txts.data("autocomplete")._renderItem = function (ul, item) {
                var line = item.label ? "<a>" + item.label + "<b>" + item.tips + "</b></a>" : '<a>无匹配条件</a>';
                return $("<li></li>")
			.data("item.autocomplete", item)
			.append($(line))
			.appendTo(ul);
            }
        }
    }
}


/**
* @func	checkIdCard
* @desc 身份证验证函数
* @author Lone Chain
* @version 1.0.0
* @date	2011-9-19
*
* @parame {String} idcard 要验证的身份证号码字符串
* @return {Object¦Boolen} 验证成功返回一个包含省份、生日、性别的对象， 失败返回false
*/
function checkIdCard(idcard) {
    var cities = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
        21: "辽宁", 22: "吉林", 23: "黑龙江",
        31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
        41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
        50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
        61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
        71: "台湾",
        81: "香港", 82: "澳门",
        91: "国外"
    };

    idcard = idcard.toString();

    //验证位数是否正确
    var info = idcard.length == 15 ?
		idcard.match(/^([1-9]\d)\d{4}(\d{2})(\d{2})(\d{2})\d{2}(\d)$/i) :
		idcard.match(/^([1-9]\d)\d{4}(\d{4})(\d{2})(\d{2})\d{2}(\d)[\dx]$/i);
    if (info) {
        if (!info.length) {
            return false;
        }
    } else {
        return false;
    }

    //验证省份是否正确
    if (!cities[info[1]]) {
        return false;
    }

    //验证生日是否正确
    var birthday = new Date(info[2], info[3] - 1, info[4]);
    if (!(
		(birthday.getFullYear() == info[2] || birthday.getYear() == info[2]) &&
		birthday.getMonth() + 1 == parseInt(info[3], 10) &&
		birthday.getDate() == parseInt(info[4], 10)
	)) {
        return false;
    }

    //18位身份证校验
    if (info[0].length == 18) {
        var sum = 0;
        info[0] = info[0].replace(/x/i, 'a');
        for (var i = 17; i >= 0; i--) {
            sum += (Math.pow(2, i) % 11) * parseInt(info[0].charAt(17 - i), 11);
        }
        if ((sum % 11) != 1) {
            return false;
        }
    }
    return {
        city: cities[info[1]],
        birthday: gf.dateFormat(birthday, 'yyyyMMdd'),
        gender: info[5] % 2 ? "m" : "f"
    };
}

