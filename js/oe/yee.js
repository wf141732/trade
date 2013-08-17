/// <reference path="js.js" />
/// <reference path="jsext.js" />
/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="common/makePy.js" />
/// <reference path="common.js" />
/// <reference path="common05.js" />


var yee = {
    tbl: null,
    ini: function () {
        this.tbl = $('#tblMain');
        var om = this,
            partner = $('.dvSearch input[name=partner_id]'), partner_id = partner.attr('_id');
        $('.btnSearch').click(function () {
            var p = $('.dvSearch input[name=partner_id]'),pid=p.attr('_id');
            pgf.codeData(pid ? 'zpye' : 'zpye1', [pid ? pid : ''], function (a) {
                var tr = [], m1 = 0, m2 = 0, l = a.length;
                for (var i = 0; i < l; i++) {
                    tr.push(om.fdata(a[i], i));
                    m1 += a[i][6] ? a[i][6] : 0;
                    m2 += a[i][7] ? a[i][7] : 0;
                }
                for (var i = 0; i < 5 - l; i++) {
                    tr.push(om.fdata(['', '', '', '', '', '', '', ''], l + i));
                }
                om.tbl.find('tbody.ui-widget-content').html('').append(tr.join(''));
                om.tbl.find('tfoot').find('tr:first').remove().end().prepend(om.fdata(['', '', '', '', '', '', m1, m2, m1 - m2]));
            })
        });
        gAuto.co(partner);

    },
    fdata: function (a, i) {
        var b = [], format = '<td class=oe-field-cell {2} data-field={1}>{0}</td>', ftr = '<tr class={2} data-id={1}>{0}</tr>';
        b.push(th('', 'oe-record-selector'));
        b.push(th('', 'oe-record-edit-link'));
        b.push(String.format(format, a[0] ? (a[0] == 'HZP' ? '有赠品' : '赠品') : '', a[0]));
        b.push(String.format(format, a[2], 'partner'));
        b.push(String.format(format, a[3], 'number'));
        b.push(String.format(format, a[5] ? f.date(a[5]) : '', 'date'));
        b.push(String.format(format, a[6], 'number', 'oe-number'));
        b.push(String.format(format, a[7], 'number', 'oe-number'));
        b.push(String.format(format, (a[6] - a[7]) ? (a[6] - a[7]) : '', 'number', 'oe-number'));
        return String.format(ftr, b.join(''), a[1], i ? (i % 2 ? 'odd' : 'even') : '');
    }
}
function td(value, cls) {
    return '<td class=' + cls ? cls : '' + '>' + value ? value : '' + '</td>';
}

function th(value,cls) { 
    return '<th class='+cls+'>'+value+'</th>'
}

$(function () {
    yee.ini();
});




var gAuto = {
    co: function (txts, callback) {// 智能提示公司
        this.complete(txts, 1, 15, 1, function (a) {//ID,助记名,全称,拼音码,平台ID
            var c = {}
            c.label = a[1];
            c.value = a[1];
            c.id = a[0];
            c.tips = a[1]; // 额外提示信息
            c.ptid = a[1];
            return c;
        }, callback, 1, 'a-partner');
    },
    complete: function (txts, type, qty, minLength, fResponse, callback, conType,code) {
        if (!conType) conType = G.con_type.auto;
        $(txts).blur(function () {
            if (!$(this).val()) {
                $(this).attr('_id', '');
                if ($(this).is('[ptid]')) $(this).attr('ptid', '');
            }
        });
        txts.autocomplete({
            source: function (request, response) {
                //if (ur.company().id && ur.user().id) {
                    var extid = txts.attr('extid');
                    if (!extid) extid = 0;
                    pgf.codeData(code, [txts.val().trim()], function (a) {
                        for (var i = 0; i < a.length; i++) a[i] = fResponse(a[i]);
                        response(a);
                    }, conType);
               // }
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
                var line = item.label ? "<a>" + item.label + "</a>" : '<a>无匹配条件</a>';
                return $("<li></li>")
			.data("item.autocomplete", item)
			.append($(line))
			.appendTo(ul);
            }
        }
    }
}