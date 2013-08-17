/// <reference path="jquery-1.6.2.min.js" />
var Host = window.location.protocol + "//" + window.location.host + '/';

var splt1 = "|~";
var splt2 = "-.-";
var splt3 = "^^";
var splt4 = "~.~";

function isNumber(v) {// 判断v是否为数字
    return !isNaN(parseInt(v, 10));
}

function fixStr(str, len) {// 截断字符串到len长度
    if (str.length > len) str = str.substr(0, len - 1) + "..";
    return str;
}

var gtips = {// 消息提示统一方法
    dvNotice: null,
    dvAjax: null,
    dvMask: null,
    ini: function () {
        if (!this.dvAjax) {
            $('body').append('<div id="dvTopNotice" class="notice center"></div><div id="waitTips" class="wait" style="display:none;">正在处理，请稍后...</div>');
            this.dvAjax = $('#waitTips');
            this.dvNotice = $('#dvTopNotice');
            this.dvMask = $('#dvMask');
        }
    },
    showNotice: function (msg) {
        // 在页面顶部，无干扰显示提示信息，替代不重要的alert提示信息
        //this.dvNotice.html(msg).css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 }).slideDown().delay(3000).slideUp(300);
        var om = this;
        this.dvNotice.html(msg);
        if (this.dvNotice.is(':hidden')) {
            this.dvNotice.show().css({ 'top': $('body').scrollTop(), 'left': $('body').width() / 2 - 200 });
            setTimeout(function () {
                om.dvNotice.css({ 'top': $('body').scrollTop() - 100 });
                om.dvNotice.fadeOut(400);
            }, 5000);
        }
    },
    showAjax: function (msg) {
        if (!msg) msg = '正在处理，请稍后...';
        this.ini();
        this.dvAjax.text(msg).show(5);
    },
    showMask: function () {
        this.dvMask.show();
    },
    hideMask: function () { this.dvMask.hide(); },
    hideAjax: function () {
        this.dvAjax.hide(5);
    }
}


function selectRow(crrntRow) {
    // 选择该行 改变样式
    if (crrntRow) {
        if (!$(crrntRow).hasClass('selected')) $(crrntRow).parent().find("tr").removeClass("selected").end().end().addClass('selected');
    } else $("tr.selected").removeClass("selected");
}

$.fn.rowselect = function () {
    // 选择该行 改变样式
    // crrntRow 为空则消除所有选中样式
    return this.each(function () {
        $(this).parent().find("tr").removeClass("selected");
        $(this).addClass("selected");
    });
}
$.fn.selectedrows = function () {
    // 选择该行 改变样式
    // crrntRow 为空则消除所有选中样式
    return $(this).find("tr.selected");
}

var _print = {
    dvPrint: null,
    _iniPrint: function (odiv) {
        var om = this;
        this.dvPrint = odiv;
        this.dvPrint.draggable({ cancel: 'iframe' }).find('.close').click(function () {
            om.dvPrint.hide();
        }).end().find('.btnDoPrint').click(function () {
            om.dvPrint.find('iframe').get(0).contentWindow.focus();
            om.dvPrint.find('iframe').get(0).contentWindow.print();
        });
    },
    print: function (obj, id) {
        this.ini();
        if (id) this.id = id;
        gf.show(obj, this.dvPrint, { x: 'center', y: 'center' });
        this.dvPrint.find('iframe').get(0).contentWindow.setId(this.id);
    },
    resizeIFrame: function (height) {
        this.dvPrint.find('iframe').height(height);
    }
}


var _batch_excel = {// 批量导入父方法
    excel_fun_code: 'lj',
    columnQty: 0, // 有效列数，不包含忽略
    iniBatch: function (aItems) {
        var om = this;
        var a = [], b = [];
        this.columnQty = aItems.length - 1;
        for (var i = 0; i < aItems.length; i++) {
            b[i] = i;
        }
        for (i = 0; i < aItems.length; i++) {
            a.push('<option value="' + i.toString() + '">' + aItems[i] + '</option>');
        }
        var s = a.join('');
        var sorder = localStorage['ltfieldsorder' + this.excel_fun_code];
        if (sorder) b = sorder.split('|');
        this.dvBatch.find('.fieldHead select').each(function (i) {
            $(this).html(s).val([b[i]]);
        });

        this.dvBatch.find('.btnClear').click(function () {
            om.dvBatch.find('textarea').val('');
        }).end().find('.btnBatchDaoru').click(function () {
            om.copyFields();
            om.dvBatch.hide();
        }).end().find('[role=btnCloseBatch]').click(function () {
            om.dvBatch.hide();
        });
    },
    copyFieldsDone: function () {
    },
    copyFields: function () {
        var s = $.trim(this.dvBatch.find('textarea').val()); // textarea 文本框
        if (s) {
            var a = s.split(/\r\n|\n|\r/); //分割行
            var aMir = [];
            this.dvBatch.find('.fieldHead select').each(function (i) {
                aMir[i] = $(this).val();
            });
            localStorage['ltfieldsorder' + this.excel_fun_code] = aMir.join('|');
            var sp = this.dvBatch.find('.cmbSpliter').val();
            var b = [];
            for (j = 0; j < this.columnQty; j++) b[j] = "";
            for (var i = 0; i < a.length; i++) {
                var tabs = this.split2Cells(a[i], sp);  // 关键的一句话，使用tab分割数据
                for (j = 0; j < this.columnQty; j++) b[aMir[j]] = tabs[j];
                a[i] = this.newRowWithValues(b);
            }
            this.dvBody.find('tbody').prepend(a.join(''));
            this.copyFieldsDone();
        } else {
            alert("请输入内容，建议从excel表格copy");
        }
    },
    split2Cells: function (v, spliter) {
        var a;
        if (spliter == "TAB(EXCEL)") {
            a = v.split('\t');
        } else if (spliter == "空格") {
            var re = new RegExp("\\s+", "");
            a = v.split(re);
        }
        return a;
    }
}

var gWhereDateExt = {// 日期查询条件 三个页面日期查询条件都共享
    dvDate: null, // 日期查询面板
    dName: '日期',
    iniDate: function () {
        var om = this;
        this.dvDate.html('日期<input  type="text"  />~<input type="text"  /><select style="margin-left:3px;" _f="日期"></select>');
        var a = [['', '未定'], ['0', '今天'], ['-1', '昨天'], ['-7', '本周'], ['-30', '本月']]; // 快速日期 quick date
        var txt = this.dvDate.find(":text");
        txt.datepicker({ changeMonth: true, changeYear: true });
        gOption.foption(this.dvDate.find("select"), a);

        this.dvDate.find("select").change(function () {
            // 选项发生变化更新文本框内对应日期
            var v = $(this).val();
            localStorage.gwhereDate_selectedvalue = v;
            txt.eq(1).val(gf.getDateAfter(1, false));
            qset(v);
        });

        var v = localStorage.gwhereDate_selectedvalue;
        if (v) { this.dvDate.find("select").val([v]); }
        qset(v);
        function qset(v) {
            if (!v) {
                txt.eq(0).val('');
                txt.eq(1).val('');
            } else {
                txt.eq(0).val(gf.getDateAfter(v, false));
                txt.eq(1).val(gf.getDateAfter(1));
            }
        }

        if (typeof sessionStorage.date_from != 'undefined' && sessionStorage.date_from != 'undefined') {
            txt.eq(0).val(sessionStorage.date_from);
        }
        if (typeof sessionStorage.date_to != 'undefined' && sessionStorage.date_to != 'undefined') {
            txt.eq(1).val(sessionStorage.date_to);
        }
    },
    setDate: function (v) {
        this.dvDate.find("select").val([v]).change();
    },
    whereDate: function () {
        var s = '';
        if (this.dvDate) {
            var txt = this.dvDate.find(':text');
            var frm = txt.eq(0).val();
            var to = txt.eq(1).val();
            if (frm && to) {
                s = "(" + this.dName + ">'" + frm + "' AND " + this.dName + "<'" + to + "')";
            } else if (frm) {
                s = "(" + this.dName + ">'" + frm + "')";
            }
            sessionStorage.date_from = frm;
            sessionStorage.date_to = to;
        }
        return s;
    }
}



String.prototype.length2 = function () {// 返回字符串真实长度，汉字2个字符
    return String(this).replace(/[^\x00-\xff]/g, "ci").length;  // 百度tangram 方法
}

String.prototype.startsWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}

//<!-- 修改substr匹配汉字截取(测试) sina 方法--> 最后一个 this 改成 s
String.prototype.substr2 = function (start, end) { var s = this.replace(/([^\x00-\xff])/g, "\x00$1"); return (s.length < end) ? s : s.substring(start, end).replace(/\x00/g, ''); }
String.prototype.size = function () {
    return this.replace(/[^\u0000-\u00FF]/gmi, "**").length;
}
/*电话，手机号码验证 http://www.cnblogs.com/cxy521/archive/2008/06/05/1214624.html*/
String.prototype.Trim = function () {
    var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    return (m == null) ? "" : m[1];
}
String.prototype.isMobile = function () {
    return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(this.Trim()));
}

String.prototype.isTel = function () {
    //"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"
    //return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(this.Trim()));
    //^(0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}$
    return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.Trim()));
}
String.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

jQuery.fn.extend({
    enterpress: function (ec) {
        $(this).bind('enterpress', ec);
        return $(this);
    }
});



var gf = {// 全局函数变量
    isMobi: function (num) {// 判断是否为手机号
        if (num.startsWith('0')) {
            num = num.substr(1, num.length - 1);
        }
        return /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0|5|6|7|8|9]|147)\d{8}$/.test(num);
    },
    queryValue: function (panstr) {// 获取网址中的query值
        var sorstr = window.location.search;
        var s = "";
        if (!(sorstr && panstr)) return s;
        sorstr = sorstr + "&";
        panstr += "=";
        var pattern = new RegExp("([&|?]" + panstr + ".*?&)", "g");
        if (pattern.test(sorstr)) {
            s = RegExp.$1;
            s = s.replace(/([&|?])/g, "");
            s = s.replace(panstr, "");
        }
        return s;
    },
    mustStartWidth: function (txt, a) {
        $(txt).blur(function () {
            var s = $(this).val();
            if (s && s.length > 1) {
                var isValid = false;
                for (var i = 0; i < a.length; i++) {
                    if (s.startsWith(a[i])) isValid = true;
                }
                if (!isValid) $(this).val(a[0] + $(this).val());
            }
        });
    },
    chineseNumber: function (n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    },
    log: function (msg) {// 控制台输出
        if ($.isArray(msg)) msg = JSON.stringify(msg);
        try {// firefox 不支持
            console.log(msg);
        } catch (err) {
        }
    },
    fSelect: function (a, value) {// 返回 select html
        var b = [], c = [];
        var sel = '';
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            if ($.isArray(b)) {
                sel = b[0] == value ? 'selected' : '';
                c.push('<option value="' + b[0] + '" ' + sel + '>' + b[1] + '</option>');
            } else {
                sel = i == value ? 'selected' : '';
                c.push('<option value="' + i.toString() + '" ' + sel + '>' + b + '</option>');
            }
        }
        return f.select(c.join(''));
    },
    isRoleOrHigh: function (role, uid) {
        ///<summary>
        /// 判断我是否高于等于传递权限，一般判断是系统管理员和我司管理员，如果传递uid,那么如果uid=我的uid也返回true
        ///</summary>
        /// <param name="role" type="int">
        ///     1：系统管理员 2：我司管理员
        /// </param>
        /// <param name="uid" type="int">
        ///     如果传递了uid，如果是我的uid返回
        /// </param>
        var r = false;
        if (uid) r = (uid == ur.user().id);
        return r || ur.user().roleid <= role;
    },
    years: function () { // 获取年份
        var a = [];
        for (var i = 0; i < 10; i++) a[i] = '<option>' + (2011 - i).toString() + '</option>';
        return a.join('');
    },
    round: function (Dight, How) {
        /*   
        *    四舍五入函数
        *    ForDight(Dight,How):数值格式化函数，Dight要   
        *    格式化的  数字，How要保留的小数位数。   
        */
        Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
        return Dight;
    },
    min: function (v) {//
        var n = parseInt(v);
        var s = '分';
        if (n < 0) n = 0;
        if (n > 60) {
            n = parseInt(n / 60);
            if (n < 24) {
                s = '时';
            } else {
                s = '天';
                n = parseInt(n / 24);
            }
        }
        return td(n.toString() + s);
    },
    delHanzi: function (source) {// 去掉汉字和双字节字符
        return String(source).replace(/[^\x00-\xff]/g, "");
    },
    outputMsgInTbl: function (msg, otbl) {// 在主表 mian中显示提示信息
        // 在查询表格中显示 提示信息
        // msg 显示消息 colNo 列数
        if (!msg) msg = "查询无记录，请改变查询条件再试一下";
        if (otbl) {
            var icol = otbl.find('thead tr:eq(0)').find('th,td').size();
            var s = '<tr class="tipsRow"><td colspan="' + icol.toString() + '" style="height:120px"><div style="font-size:16px!important;color:Gray;font-style:italic; margin:auto; text-align:center;">' + msg + '</div></td></tr>'
            otbl.find('tbody').html(s);
        }
    },
    getDateAfter: function (days, isShowTime) {
        var td = new Date();
        var iTime = days * 24 * 60 * 60 * 1000;
        td.setTime(td.getTime() + iTime);
        var t = '';
        if (isShowTime) t = " HH:mm";
        ////yyyy年MM月dd日 HH时mm分ss秒
        return gf.dateFormat(td, 'yyyy-MM-dd ' + t);
    },
    /**
    * 为目标数字添加逗号分隔
    * @name baidu.number.comma
    * @function
    * @grammar baidu.number.comma(source[, length])
    * @param {number} source 需要处理的数字
    * @param {number} [length] 两次逗号之间的数字位数，默认为3位
    *             
    * @returns {string} 添加逗号分隔后的字符串
    */
    comma: function (source, length) {
        if (!length || length < 1) {
            length = 3;
        }
        source = String(source).split(".");
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), "$1,");
        return source.join(".");
    },
    percent: function (Molecular, Denominator) {// 以百分数表示
        var rate = '';
        if (Denominator > 0) {
            rate = Math.round(100 * Number(Molecular) / Number(Denominator)).toString() + '%';
        }
        return rate;
    },
    textareaUnPasre: function (str) {//转换在textarea中输入回车符 空格 http://www.blogjava.net/xtitan/archive/2008/07/22/216518.html
        if (str) {
            str = str.replace(/<br>/gi, "\r\n");
            str = str.replace(/&nbsp;/gi, " ");
        }
        return str;
    },
    textareaPasre: function (str) {//转换在textarea中输入回车符 空格 http://www.blogjava.net/xtitan/archive/2008/07/22/216518.html
        if (str) {
            var reg = new RegExp("\r\n", "g");
            var reg1 = new RegExp(" ", "g");
            str = str.replace(reg, "<br>");
            str = str.replace(reg1, "&nbsp;");
            str = str.replace(/\n/g, '<br>');
        }
        return str;
    },
    /**
    * 对目标数字进行0补齐处理
    * @name baidu.number.pad
    * @function
    * @grammar baidu.number.pad(source, length)
    * @param {number} source 需要处理的数字
    * @param {number} length 需要输出的长度
    *             
    * @returns {string} 对目标数字进行0补齐处理后的结果
    */
    pad: function (source, length) {
        var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
        return (negative ? "-" : "") + pre + string;
    },
    dateFormat: function (source, pattern) {//日期格式化 http://tangram.baidu.com/index.html
        //yyyy年MM月dd日 HH时mm分ss秒
        if ('string' != typeof pattern) {
            return source.toString();
        }
        if (typeof source == 'string') source = new Date(source);
        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }
        var pad = this.pad;
        year = source.getFullYear(),
        month = source.getMonth() + 1,
        date2 = source.getDate(),
        hours = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();
        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(year.toString().slice(2), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);
        return pattern;
    },
    show: function (otrigger, showDv, offsetXy, isIgnore) {// otrigger 参考元素 showDv显示面板 offsetXy 偏离
        var p = $(otrigger).offset();
        if (!offsetXy.y) offsetXy.y = 0;
        var h = $(showDv).height(); // 高
        var totalHeight = document.documentElement.clientHeight + document.body.scrollTop;
        // 下面的边超出了屏幕的底部
        var y;
        if (offsetXy.y == 'center') {
            y = document.body.scrollTop + ($(window).height() - $(showDv).height()) / 2;
            if (y < 10) y = 10;
        } else {
            y = p.top + offsetXy.y;
            if (!isIgnore) {
                // 下面的边超出了屏幕的底部        
                if ((y + h) > totalHeight) y = totalHeight - h - 50;
                if (y < 50) y = document.body.scrollTop + 160;
            }
        }

        if (offsetXy.x == 'center') {
            x = (document.documentElement.clientWidth - $(showDv).width()) / 2;
        } else {
            if (!offsetXy.x) offsetXy.x = 0;
            var x = p.left + offsetXy.x;
            var w = $(showDv).width(); // 宽
            if (x < 10) x = 10;
        }

        showDv.show().css({ left: x, top: y });
    },
    ajax: function (par) {
        var onerror = function (msg) { gf.log(msg); alert("数据操作出错\n异常信息如下："+msg); }
        //if (!par.error) onerror = par.error;
        par = $.extend({
            type: 'post',
            dataType: 'json',
            url: gurl.root + "handlers/Common.ashx",
            success: function () { },
            error: onerror,
            code: '',
            data: {}
        }, par);
        jQuery.ajax({
            type: par.type,
            dataType: par.dataType,
            url: par.url,
            data: { OperationCode: par.code, OperationData: JSON.stringify(par.data, "", "") },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data, textStatus) {
                if (textStatus == "success") {
                    if (data.ISSuccess === 1) {
                        par.success(data);
                    }
                    else {
                        if (par.error)
                            par.error(data.ErrorMessage);
                    }
                }
                else {
                    if (par.error)
                        par.error(data.ErrorMessage);
                }
            },
            error: function (XMLHttpRequest, status) {
                if (par.error)
                    par.error(XMLHttpRequest.responseText);
                //请求出错处理
            }
        })
    },
    toExcel: function (filename, a, showFields) {
        if (!showFields) showFields = a[2];
        showFields = showFields.split(',');
        var data = {
            ObjectName: filename,
            Fields: showFields,
            Values: a
        };
        window.open(gurl.root + 'handlers/Common.ashx?OperationCode=XLS&OperationData=' + JSON.stringify(data));
    },
    pagination: function (aPara, success, config, onError) {
        //isRowNumber, conType
        if (!config) config = {};
        config = $.extend({
            conType: 1,
            isRowNumber: false,
            FieldKey: 'ID',
            ajaxMsg: '正在查询请稍后...'
        }, config);

        var proName = '';
        if (config.isRowNumber) {// 调用row number 分页存储过程
            proName = 'up_page';
        } else {
            proName = 'up_PageView';
            aPara.push(config.FieldKey);
        }
        aPara.push(1);
        var data = {
            ObjectName: proName,
            Values: aPara,
            ConType: config.conType
        }
        gtips.showAjax(config.ajaxMsg);
        this.ajax({
            code: 'PRC',
            data: data,
            success: success,
            error: onError
        });
    },
    noPagination: function (procName, aPara, success, conType, onError) { // 非分页
        var data = {
            ObjectName: procName,
            Values: aPara,
            ConType: conType
        }
        this.ajax({
            code: 'PRC',
            data: data,
            error: onError,
            success: function (jsn) {
                var a = jsn.OutputTable;
                if ($.isArray(a)) {
                    if (a.length > 0) {
                        if (a[0].length == 1) {// 如果只有一列转换成一维数组
                            for (var i = 0; i < a.length; i++) a[i] = a[i][0];
                        }
                    }
                } else a = [];
                success(a, jsn.ReturnValue);
            }
        });
    },
    execSql: function (sql, success, conType) {
        var data = {
            ObjectName: sql,
            ConType: conType
        }
        this.ajax({
            code: 'SQL',
            data: data,
            success: success
        });
    },
    noPaginationSqlPara: function (sWhere, sortField, sFields, tbl, success, conType) {
        if (sWhere) sWhere = ' where ' + sWhere;
        if (sortField) sortField = ' order by ' + sortField;
        var sql = 'select ' + sFields + ' from ' + tbl + sWhere + sortField;
        this.execSql(sql, function (jsn) {
            var a = jsn.OutputTable;
            if ($.isArray(a)) {
                if (a[0]) {
                    if (a[0].length == 1) {// 如果只有一列转换成一维数组
                        for (var i = 0; i < a.length; i++) a[i] = a[i][0];
                    }
                }
            } else {
                a = [];
            }
            success(a);
        }, conType);
    },
    getOneLine: function (procName, aPara, success, conType, onError) {// 单行数据
        this.noPagination(procName, aPara, function (a, returnValue) {
            if ($.isArray(a) && a.length > 0) {
                if ($.isArray(a[0])) a = a[0];
            }
            else a = [];
            success(a, returnValue);
        }, conType, onError);
    },
    getOneLineSqlPara: function (sWhere, sFields, tbl, success, conType, onError) {// 单行数据
        this.noPaginationSqlPara(sWhere, '', sFields, tbl, function (a) {
            if ($.isArray(a)) {
                if ($.isArray(a[0])) a = a[0];
            } else a = [];
            success(a);
        }, conType, onError);
    },
    callProcBatch: function (procName, aPara, success, conType, onError) {// 批量更新 aPara 是二维数组
        var data = {
            ObjectName: procName,
            BatchValues: aPara,
            ConType: conType
        }
        this.ajax({
            code: 'BPR',
            data: data,
            success: success,
            error: onError
        });
    },
    callProc: function (procName, aPara, success, conType, onError) {
        var data = {
            ObjectName: procName,
            Values: aPara,
            ConType: conType
        }
        this.ajax({
            code: 'PRC',
            data: data,
            success: success,
            error: onError
        });
    },
    callProc_with_value: function (procName, aPara, success, conType, onError) {
        this.callProc(procName, aPara, function (jsn) { success(jsn.ReturnValue); }, conType, onError);
    },
    insertBatch: function (tableName, aFields, aValues, success, conType, onError) {
        var data = {
            Fields: aFields,
            BatchValues: aValues,
            ObjectName: tableName,
            ConType: conType
        }
        this.ajax({
            code: 'INS',
            data: data,
            success: success,
            error: onError
        });
    },
    insertBatchCopy: function (tableName, aFields, aValues, success, conType, onError) {
        if (!$.isFunction(onerror)) onerror = function (errmsg) { gf.log(errmsg); }
        var data = {
            Fields: aFields,
            BatchValues: aValues,
            ObjectName: tableName,
            ConType: conType
        }
        this.ajax({
            code: 'BIN',
            data: data,
            success: success,
            error: onError
        });
    },
    updateBatch: function (aId, tableName, aFields, aValues, success, conType, onError) {
        var data = {
            Fields: aFields,
            BatchValues: aValues,
            Condition: aId,
            ObjectName: tableName,
            ConType: conType
        }
        this.ajax({
            code: 'UPD',
            data: data,
            success: success,
            error: onError
        });
    }
}




/*---------------------------
功能:停止事件冒泡
---------------------------*/
function gStopBubble(e) {
    //如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation)
    //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    else
    //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
}


$.fn.edit_dirty = function () {
    // 编辑过的行记录下来
    // 传递 tbody即可
    return this.each(function () {
        $(this).keyup(function (e) {
            var o = $(e.target);
            if (o.is(':text')) {
                if (e.keyCode > 41 || e.keyCode == 8) o.parent().parent().addClass('dirty');
            }
        });
    });
}


$.fn.nav = function () {
    // 表格文本框中导航，模拟excel表格 crlt+箭头
    // 表格行
    return this.each(function () {
        var target = null, s = ':has(":text,input[type=number]")';
        function cellNav(target, dir) {
            var o = null;
            var otr = target.parent();
            if (dir == 'up') {
                //在第一行 再向上有bug
                o = otr.prev();
                if (o.find('table').size() > 0) o = o.prev(); 
                o = o.find('td').eq(target.get(0).cellIndex);
            } else if (dir == 'down') {
                o = otr.next();
                if (o.find('table').size() > 0) o = o.next(); // 该行包含子表格则跳过
                o = o.find('td').eq(target.get(0).cellIndex);
                if (o.size() == 0) o = otr.parent().find('tr:eq(0)').find('td').eq(target.get(0).cellIndex);
            } else if (dir == 'left') {
                o = target.prevUntil('', s);
                if (o.size() == 0) o = otr.prev().find('td' + s + ':last');
            } else if (dir == 'right') {
                o = target.nextUntil('', s);
                if (o.size() == 0) o = otr.next().find('td' + s).eq(0);
                if (o.size() == 0) o = otr.parent().find('td' + s + ':eq(0)');
            }
            o.children().first()[0].focus();
        }

        $(this).keydown(function (evt) {
            target = $(evt.target);
            var etarg = target.parent(), keyValue = '', keyCode = evt.keyCode;
            var isCtrl = evt.ctrlKey || evt.shiftKey;
            switch (keyCode) {
                case 9: //tab                                                   
                    cellNav(etarg, 'right');
                    return false;
                    break;
                case 27: //esc
                    etarg[0].focus();
                    target.selectionRange(-1);
                    return false;
                    break;
                case 13: //enter
                    cellNav(etarg, 'down');
                    break;
                case 37: //left
                    !isCtrl || cellNav(etarg, 'left');
                    break;
                case 38: //up
                    !isCtrl || cellNav(etarg, 'up');
                    break;
                case 39: //right
                    !isCtrl || cellNav(etarg, 'right');
                    break;
                case 40: //down
                    !isCtrl || cellNav(etarg, 'down');
                    break;
                default:
                    break;
            }
        });
    });
}

$.fn.selectionRange = function (start, end) {
    this[0].selectionStart = start || 0;
    this[0].selectionEnd = end || this.val().length;
    return this;
};

var _toexcel = {// 导出到excel表格
    fileNamePrefix: '', // 文件名前缀
    toexcel_fields: '',
    iniToExcel: function () {
        var om = this;
        this.dv.find('.bttnOutput2Excel').click(function () {
            var num = gls.toExcelNum(om.code);
            //num = 500; // 以后要注释掉这一句 hwm
            if (num > 0) {
                if (!om.toexcel_fields) om.toexcel_fields = om.fields;
                var sfilename = om.fileNamePrefix + (new Date().getTime().toString()) + '.xls';
                gf.toExcel(sfilename, [num, om.tbl, om.toexcel_fields, om.sort.sort_str(), om.where()]);
            } else {
                alert('您无权限导出到excel表格，请与管理员联系');
            }
        });
    }
}

function u_sort(f, d) {
    this.field = f; // 字段
    if (!d) d = '';
    this.dir = d.toLowerCase();  //排序方向 asc desc
    this.sort_str = function () {
        return this.field + ' ' + this.dir;
    };
    this.turn = function () {// 改变顺序
        this.dir = this.dir == 'desc' ? 'asc' : 'desc';
    }
}

var gPaginationModel = {// 分页查询父类，供所有分页查询继承
    tbl: '',
    ps: 30, // pagesize 每页显示记录数
    fields: '',
    sort: new u_sort('ID', 'desc'),
    dv: null, // 采购页面总面板
    dv_pagination: null,
    oTbl: null,
    btnSearch: null,
    contype: 1,
    code: '',
    isAuthorized: true,
    isEditDirty: false,
    isNav: false, // 使用键盘导航
    isEnterSearch: true, // 在thead 中按回车执行查询
    isRowNumber: false,
    ini_after: function () {
        var om = this;
        this.dv_pagination = this.dv.find('.pagination');
        this.oTbl.find('thead .header th a').click(function () {
            var sf = $(this).attr("_value");
            if (sf) {
                $(this).parent().parent().find("th.sort").removeClass("sort");
                if (om.sort.field == sf) om.sort.turn();
                else om.sort.field = sf;
                $(this).parent().addClass('sort').end().removeClass().addClass(om.sort.dir);
                om.search(-1);
            }
        });

        if (this.code) this.isAuthorized = gls.isAuthorized(this.code, 0);

        if (this.isEditDirty) this.oTbl.find('tbody').edit_dirty();
        if (this.isNav) this.oTbl.nav();

        if (this.isEnterSearch) this.oTbl.find('thead').find(':text,input[type=number]').enterpress(function () {
            om.search();
        });
    },
    search_done: function () { },
    showAjax: function () {
    },
    search: function (pIndex) {
        if (arguments.length < 1) pIndex = -1;
        if (pIndex < 2) { // 第一页检查权限，以后的翻页不在进行权限检查
            if (!this.isAuthorized) {
                gf.outputMsgInTbl('您无权限查看代号:《' + this.code + '》的数据 <br />请联系贵公司的管理员', this.oTbl);
                return false;
            }
        }

        var om = this;
        $(this.btnSearch).disable();
        this.showAjax();
        gf.pagination([this.tbl, pIndex, this.ps, this.fields, this.sort.sort_str(), this.where()], function (jsn) {
            gtips.hideAjax();
            $(om.btnSearch).enable();
            var pageTotal = jsn.OutputValue;
            if (pageTotal != -1) om.create_pagination(pageTotal);
            var a = jsn.OutputTable;
            if (a.length > 0) {
                om.fillin(a);
            } else {
                gf.outputMsgInTbl('查询无记录', om.oTbl);
            }
        }, {
            isRowNumber: this.isRowNumber,
            conType: om.contype
        });
    },
    fillin: function (a) {
        for (var i = 0; i < a.length; i++) a[i] = this.fdata(a[i], i);
        this.oTbl.find('tbody').html(a.join(''));
        this.search_done();
    },
    getDirtyRows: function () { return this.oTbl.find('tbody tr.dirty'); },
    fdata: function () { return '' },
    del: function (obj) {
        if (gls.isAuthorized(this.code, 1)) { this.do_del(obj); } else {
            alert("您无删除权限\n请与贵司管理员联系，在组权限中给您分配该表格的删除权限");
        }
    },
    do_del: function (obj) {// 执行删除操作
    },
    create_pagination: function (total) {// 创建分页
        var om = this;
        this.dv_pagination.pagination(total, {
            current_page: 0,
            items_per_page: this.ps,
            num_display_entries: 5, //总共显示的页码
            num_edge_entries: 2,
            callback: function (pageIndex) {
                om.search(pageIndex + 1);
            }
        });
    }
}

var gjd = {
    oaction_button: null,
    dv: null,
    otxt: null,
    otd: null,
    id: '', // 当前进度ID，主要用于更新和删除
    relatedid: '', // 业务询价ID,不管采购还是业务，进度都跟业务表格相关联
    type: '', //1：订单 2：询价 3：退货
    etype: {
        po: '1', //订单进度
        rfq: '2', //询价进度
        roitem: '4', // 翻新进度 总
        ro: '5'// 翻新进度 工序
    },
    f: function (v, relatedid, type) {
        var s = 'rfqj';
        if (v > 0) s = 'rfqj hasjindu';
        return td('', 'class="' + s + '" onclick="gjd.show(this,event)" relatedid="' + relatedid + '" _type="' + type + '" title="添加进度"');
    },
    fJindu: function (relatedid, jindu, author, sdate, type) { // 进度
        //格式化 最新PO进度信息
        // data格式：关联ID,进度,作者,日期 使用splt1分割
        if (!jindu) { jindu = '无进度'; sdate = ''; }
        else {
            if (sdate) sdate = f.date(sdate);
        }
        return '<span class="jindu" onclick="gjd.show(this,event);" relatedid="' + relatedid + '" _type="' + type + '"><span class="con">' + jindu + '</span><span class="author" title="' + author + '">' + sdate + '</span></span>';
    },
    ini: function () {
        if (!this.dv) {
            var s =
'<div id="dvJindu" class="float_box order_read" style="width:350px;"><div class="header_floatbox"><h4 class="fleft">订单进度详情</h4><a href="#"><i class="icon_close"></i></a></div>' +
'<ul></ul>' +
'<fieldset><textarea id="bio" placeholder="请在这里添加进度"></textarea></fieldset><fieldset class="pos_relative"><input type="checkbox" /> 公开进度 <input type="button" value="添加进度" class="second-button"/><i class="icon_add"></i></fieldset></div>';
            $('body').append(s);
            var om = this;
            this.dv = $('#dvJindu');
            this.oaction_button = this.dv.find('.icon_add').click(function () { om.add(this); });
            this.dv.find('.icon_close').click(function () { om.dv.hide(); }).end().draggable({ handle: this.dv.find('.toolbar,.title') });
            this.otxt = this.dv.find('textarea');
        }
    },
    add: function (obj) {// 添加或者修改
        var a = [];
        a[0] = this.id;
        a[1] = this.relatedid; // cusinqid
        a[2] = document.getElementById("txtPojindu").value;
        a[3] = ur.user().id;
        a[4] = this.type;
        a[5] = this.dv.find('checkbox').is(':checked') ? '1' : '0';
        if (a[2] == '你想说什么?') a[2] = '';
        if (a[2]) {
            a[2] = f.turn(a[2]);
            if (myValidator.maxlen(this.otxt, 199)) {
                $(obj).disable();
                var om = this;
                gf.callProc_with_value('up_jindu_update', a, function () {
                    gtips.showNotice('更新添加成功');
                    $(obj).enable();
                    if (!$(om.otd).hasClass('hasjindu')) $(om.otd).addClass('hasjindu');
                    om.search();
                });
            } else {
                alert('进度内容不能超过100个字符');
            }
        } else alert('进度不能为空');
    },
    show: function (obj, e) {
        // 显示添加进度面板
        this.otd = obj;
        this.id = ''; //清空ID
        this.oaction_button.val('添加进度');
        this.relatedid = $(obj).attr('relatedid');
        this.type = $(obj).attr('_type');
        gf.show(obj, this.dv, { x: 'center', y: 30 });
        this.search();
        gStopBubble(e);
    },
    showByMenu: function (t, type) {
        this.id = ''; //清空ID
        this.oaction_button.val('添加进度');
        this.relatedid = $(t).attr('_id');
        this.type = type;
        gf.show(t, this.dv, { x: 300, y: 30 });
        this.search();
    },
    search: function () {
        var om = this;
        var coid = ur.company().id;
        //id,进度,作者,dbo.fDateWeek(日期),uID,公司ID,isPublic
        gf.noPagination('up_jindu_search', [this.relatedid, this.type], function (a) {
            if (a.length > 0) {
                //id,进度,日期,作者
                for (var i = 0; i < a.length; i++) a[i] = fOne(a[i]);
                om.dv.find('ul').html(a.join(''));
            } else {
                om.dv.find('ul').empty();
            }
        });
        function fOne(b) {
            if (b[6] == '1' || (b[6] == '0' && b[5] == coid))
                return '<li><h5>' + b[1] + '</h5><a href="javascript://">' + b[2] + '</a><span>' + b[3] + '</span> <a href="javascript://" onclick="gjd.del(this)"  title="只有该文作者才有权限删除"><i class="icon_delete"></i>删 除</a> <a href="javascript://" onclick="gjd.modify(this)" title="只有该文作者才有权限修改"><i class="icon_edit"></i>编 辑</a></li>'
        }
    },
    del: function (obj) {
        var uid = $(obj).parent().attr('uid');
        if (gf.isRoleOrHigh(2, uid)) {
            var id = $(obj).parent().attr('_id');
            gf.callProc('up_jindu_del', [id, this.type], function () {
                $(obj).parent().parent().addClass('del');
            });
        } else { alert('您不能删除其他人添加的进度'); }
    },
    modify: function (obj) {
        var uid = $(obj).parent().attr('uid');
        if (gf.isRoleOrHigh(2, uid)) {
            this.id = $(obj).parent().attr('_id');
            var txt = $(obj).parent().parent().find('blockquote p').text();
            this.otxt.val(txt);
            this.oaction_button.val('修改进度');
        } else { alert('您无权修改其他人添加的进度'); }
    }
}



function group_array(a, pos) {
// 数组分组，p 一定要注意对分组字段进行排序
    var b = [], c = [], d = [];
    var t = '';
    for (var i = 0; i < a.length; i++) {
        b = a[i];
        if (i != 0 && t != b[pos]) {
            d[t] = c;
            c =[];
        }
        c.push(a[i]);
        t = b[pos];
    }
    d[t] = c;
    return d;
}


$.fn.disable = function () { return this.each(function () { this.disabled = true; }); }
$.fn.enable = function () { return this.each(function () { this.disabled = false; }); }

// 我的验证函数
var myValidator = {
    maxlen: function (otext, len) {
        var v = $(otext).val();
        if (v && v.length2() > len) { $(otext).addClass("error"); return false; }
        else { $(otext).removeClass("error"); return true; }
    },
    hasId: function (otext) {
        if ($(otext).attr('_id') > 0) {
            $(otext).removeClass('error');
            return true;
        } else {
            $(otext).addClass('error');
            return false;
        }
    },
    minlen: function (otext, len) {
        var v = $(otext).val();
        if (!v || v.size() < len) { return false; }
        else { return true; }
    },
    int: function (o) {// 整数
        var s = $(o).val();
        if (s) {
            s = s.replace(/\$|￥|pcs|PCS|,/g, "");
            $(o).val(s);
            if (isNumber(s)) {
                if (s < 1) {
                    $(o).addClass("error");
                    return false;
                } else {
                    $(o).removeClass("error");
                    return true;
                }
            } else {
                $(o).addClass("error");
                return false;
            }
        } else return true;
    },
    number: function (otext) {// 判断是否是数字，可以有小数点
        var s = $(otext).val();
        if (!s) return true;
        s = s.replace(/\$|￥|,|pcs/gi, "");
        s = s.replace(/k/gi, "000");
        if (!isNumber(s)) {
            $(otext).addClass("error");
            return false;
        } else {
            $(otext).val(Number(s));
            $(otext).removeClass("error");
            return true;
        }
    },
    notNull: function (otext) {
        if ($(otext).val()) { $(otext).removeClass("error"); return true; }
        else { $(otext).addClass("error"); return false; }

    }
}

function tr(value, attr) { return fTag('tr', value, attr); }
function td(value, attr) { return fTag('td', value, attr); }
function fTag(tag, value, attr) {
    if (!attr) attr = "";
    return '<'+tag +' ' + attr + ' >' + value + '</'+tag+'>';
}

var f = {
    trim_array: function (a) {
        if ($.isArray(a)) {
            for (var i = 0; i < a.length; i++) {
                if (typeof a[i] == "string") a[i] = $.trim(a[i]);
                else if (a[i] == null) a[i] = '';
            }
        }
        return a;
    },
    validSql: function (s) {
        if (typeof s == 'string' && s) {
            s = $.trim(s);
            return s.replace(new RegExp("'", "gm"), "''");
        } else return s;
    },
    select: function (value, attr) { return fTag('select', value, attr); },
    table: function (value, attr) { return fTag('table', value, attr); },
    tr: function (value, attr) { return fTag('tr', value, attr); },
    td: function (value, attr) { return fTag('td', value, attr); },
    th: function (value, attr) { return fTag('th', value, attr); },
    tbody: function (value, attr) { return fTag('tbody', value, attr); },
    thead: function (value, attr) { return fTag('thead', value, attr); },
    div: function (value, attr) { return fTag('div', value, attr); },
    label: function (value, attr) { return fTag('label', value, attr); },
    li: function (value, attr) { return fTag('li', value, attr); },
    span: function (value, attr) { return fTag('span', value, attr); },
    text: function (value, attr) { return this.input(value, 'text', attr); },
    input: function (value, type, attr) {
        if (!value) value = "";
        if (!attr) attr = "";
        return '<input type="' + type + '" value="' + value + '" ' + attr + ' />';
    },
    checkbox: function (attr) {// checkbox
        if (!attr) attr = "";
        return '<input type="checkbox" ' + attr + ' />';
    },
    authorDate: function (author, sDate, uId) {
        var a = ['', ''], s = '';
        var odate = this._date(sDate);
        if (uId) s = ' onclick="gExtHook.fireChat(\'' + uId + '\',this)" onmouseout="guser.out();" onmouseover="guser.over(\'' + uId + '\',this)"';
        a[0] = '<span style="margin-right:2px;cursor:pointer;" ' + s + ' >' + author + '</span>';
        a[1] = this.date(sDate, true);
        return a.join('');
    },
    _date: function (sDate) {
        if (sDate) {
            var d = this.oDate(sDate);
            var sOri = gf.dateFormat(d, "yyyy-MM-dd HH:mm");
            var dToday = new Date();
            var h = (dToday - d) / (60 * 60 * 1000); // 日期和今天之差 单位小时
            var s = '';
            if (h > 24 && h < 48) {
                s = '昨天';
            } else if (h > 48) {
                var y = dToday.getFullYear() - d.getFullYear();
                s = y > 0 ? gf.dateFormat(d, "yyyy-M-d") : gf.dateFormat(d, "M月d日");
            } else s = gf.dateFormat(d, "HH:mm");
            return { formated: s, ori: sOri };
        } else return { formated: '', ori: sDate };
    },
    date: function (sDate, isOri) {
        ///<summary>
        /// 格式化 日期，使用span包含
        ///</summary>
        /// <param name="sDate" type="String">
        ///     日期字符串
        /// </param>
        /// <param name="isOri" type="String">
        ///     True:用span包裹显示完整日期
        /// </param>
        if (sDate) {
            var d = this._date(sDate);
            sDate = isOri ? '<span  title="' + d.ori + '">' + d.formated + '</span>' : d.formated;
        }
        return sDate;
    },
    dateFormat: function (sDate) {
        if (sDate) {
            var d = this.oDate(sDate);
            return gf.dateFormat(gf.dateFormat(d, "yyyy-MM-dd HH:mm"));
        } return sDate;
    },
    oDate: function (sDate) {// 返回 date对象
        if (sDate) {
            return new Date(parseInt(sDate.replace("/Date(", "").replace(")/", ""), 10));
        } else return new Date();
    },
    fix: function (v, dig) {
        if (!v) return '';
        if (!isNaN(parseInt(v))) {
            if (v == parseInt(v) || !dig) {
                dig = 0;
            }
            v = Number(v).toFixed(dig);
        }
        return v.toString();
    },
    qq: function (qq) {
        if (qq)
            return '<a class="a_qq_chat" target="_blank" href="http://wpa.qq.com/msgrd?V=1&amp;Uin=' + qq + '&amp;Exe=QQ&amp;Site=IC全能王(www.icprice.cn)&amp;Menu=Yes"><img border="0" src="http://wpa.qq.com/pa?p=1:' + qq + ':1" alt="给我发消息"></a>';
        else return '';
    },
    price: function (v, digit) {
        if (!v || isNaN(v)) return '';
        if (v < 0) return f.fix(v);
        // 替换掉尾数全部为0
        v = Math.round(Number(v) * 10000) / 10000;
        v = v.toString();
        var a = v.split('.');
        if (!digit) digit = 0;
        if (a.length == 2) {
            a[1] = a[1].replace(/0{1,4}$/g, ""); // 小数部分
            var d = digit - a[1].length;
            if (d > 0) {
                for (var i = 0; i < d; i++) {
                    a[1] += '0';
                }
            }
            return a[0] + '.' + a[1];
        } else return v;
    },
    getWhere_root: function (aF, aV) {
        var a = [];
        var j = 0;
        var reg = new RegExp("r_r", "g");
        for (var i = 0; i < aF.length; i++) {
            if (aV[i] && aF[i]) {
                if (typeof aV[i] == "string") aV[i] = aV[i].trim();
                a[j++] = aF[i].replace(reg, aV[i]);
            }
        }
        var s = a.join(" AND ");
        if (!s) s = '1=1';
        return s;
    },
    turn: function (str) {//转换在textarea中输入回车符 空格 http://www.blogjava.net/xtitan/archive/2008/07/22/216518.html
        if (str) {
            var reg = new RegExp("\r\n", "g");
            var reg1 = new RegExp(" ", "g");
            str = str.replace(reg, "<br>");
            str = str.replace(reg1, "&nbsp;");
            str = str.replace(/\n/g, '<br />');
        }
        return str;
    }
};


//-------------------------------------------------------------------------------------------------------------auto complete end
$.fn.foption2 = function (a, default_value) {
    gOption.foption(this, a, default_value);
    return this;
}

var gOption = {
    config: {
        noneStr: '无选项',
        firstItem: [],
        bufferid: '',
        callback: function () { },
        conType: 1// 数据库连接类型
    },
    option: function (ocmb, procName, aPara, defaultValue, config) {
        var om = this;
        if (!config) config = {};
        $.extend(this.config, config);
        gf.noPagination(procName, aPara, function (a) {
            if (om.config.firstItem.length > 0) a.unshift(om.config.firstItem);
            om.foption(ocmb, a, defaultValue);
            if ($.isFunction(om.config.callback)) { om.config.callback(ocmb); }
        }, config.conType);
    },
    foption: function (ocmb, av, defaultValue, firstItem) {
        var sel = '';
        var b = [];
        var a = av.concat();
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                if ($.isArray(a[i])) {
                    sel = (defaultValue && defaultValue == a[i][0]) ? "selected" : "";
                    if (!defaultValue && i == 0) sel = "selected";
                    b.push('<option value="' + a[i][0] + '" ' + sel + ' >' + a[i][1] + '</option>');
                } else {
                    sel = (defaultValue && defaultValue == a[i]) ? "selected" : "";
                    if (!defaultValue && i == 0) sel = "selected";
                    b.push('<option value="' + i.toString() + '" ' + sel + ' >' + a[i] + '</option>');
                }
            }

            if (firstItem) b.unshift('<option value="' + firstItem[0] + '" >' + firstItem[1] + '</option>');
        } else {
            b[0] = '<option value="" >' + this.config.noneStr + '</option>';
        }
        ocmb.html(b.join(''));
    }
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++工具结束


/*-----------------------------------------------------------------------------------------------------------------------------------------cookie插件*/
jQuery.cookie = function(name, value, options) {
    ///<summary>
    ///  set,get,delete cookie
    ///</summary>
    ///<param name="name" optional="true">(optional) cookie name</param>
    ///<param name="value" optional="true">(optional) The value to set the cookie to.</param>
    ///<param name="options" optional="true">(optional) { expires: 7, path: '/', domain: 'jquery.com', secure: true } </param>
    ///<returns type="jQuery" /> 
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = cookie.substring(name.length + 1);
                    //cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


//------------------------------------------------------------------------------------------------------------------------------------timer 插件
jQuery.fn.extend({
    everyTime: function(interval, label, fn, times, belay) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times, belay);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        guid: 1,
        global: {},
        regex: /^([0-9]+)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseInt(result[1], 10);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times, belay) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
                return;

            if (times && times.constructor != Number) {
                belay = !!times;
                times = 0;
            }

            times = times || 0;
            belay = belay || false;

            if (!element.$timers)
                element.$timers = {};

            if (!element.$timers[label])
                element.$timers[label] = {};

            fn.$timerID = fn.$timerID || this.guid++;

            var handler = function() {
                if (belay && this.inProgress)
                    return;
                this.inProgress = true;
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
                this.inProgress = false;
            };

            handler.$timerID = fn.$timerID;

            if (!element.$timers[label][fn.$timerID])
                element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);

            if (!this.global[label])
                this.global[label] = [];
            this.global[label].push(element);

        },
        remove: function(element, label, fn) {
            var timers = element.$timers, ret;

            if (timers) {

                if (!label) {
                    for (label in timers)
                        this.remove(element, label, fn);
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.$timerID) {
                            window.clearInterval(timers[label][fn.$timerID]);
                            delete timers[label][fn.$timerID];
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }
                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for (ret in timers) break;
                if (!ret)
                    element.$timers = null;
            }
        }
    }
});

if (jQuery.browser.msie)
    jQuery(window).one("unload", function() {
        var global = jQuery.timer.global;
        for (var label in global) {
            var els = global[label], i = els.length;
            while (--i)
                jQuery.timer.remove(els[i], label);
        }
    });
