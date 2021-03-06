﻿/// <reference path="jquery-1.8.0.js" />
/// <reference path="base.js" />
/// <reference path="agent.base.js" />
/// <reference path="common/capture.js" /
/// <reference path="common/makePy.js" />

agent.po = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPurchasOrder' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //o.dv = $('#dvPurchasOrder');
            o.oTbl = o.dv.find('.report-results>table');
           // o.dv.find('.vehicle_search button[name=query]').click(function () { pgSearch(); });
            o.dv.find('.vehicle_search button[name=add]').click(function () {
                agent.poUpd.show('', 'create');
            });
            o.oTbl.find('tbody tr a').live('click', function () {
                agent.poUpd.show($(this).parents('tr').attr('data-id'));
            });
        }
    },
    pgSearch = function () {
        var t = [];
        pgf.codeTableData('agent.so.query', [ur.user().erpID, where(),o.pager.val()], function (a) {
            for (var i = 0, l = a.length; i < l; i++) {
                t.push(fdata(a[i]));
            }
            //o.dv.find('.page-header .fr').find('c').html(a.length).end().find('d').html(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
            o.searchend(a.length);
            if (t.length)
                o.oTbl.find('tbody').html(t.join(''));
            else
                o.oTbl.find('tbody').html('查询无记录');
        });
    },
    fdata = function (a) {
        var c = [], cd = '';
        //c.push(td('MSO' + a[0]));
        c.push(dom.td('<a href="#">' + a[1] + '</a>'));
        c.push(dom.td(f.date(a[2])));
        //c.push(dom.td(f.price(a[3], 2), 'class="number"'));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[3], 2) + '</label>'));
        c.push(dom.td(a[6]));
        if (a[9] == 'cancel') {
            cd = '已取消';
        }
        else {
            cd = a[4] ? f.date(a[4]) : '';
        }
        c.push(dom.td(cd));
        c.push(dom.td('<div class="progress progress-striped active"><div class="bar" style="width: ' + (parseFloat(a[5]) * 100 || 0) + '%"></div></div>'));
        c.push(dom.td(''));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    },
    where = function () {
        var a = [], aF = [];
        aF.push("so.name like '%r_r%'")
        aF.push("so.date_order>='r_r'");
        aF.push("so.date_order<='r_r'");
        //aF.push("storeId=r_r");
        var t = o.dvSp.find('input,select');
        a.push(t.eq(1).val());
        a.push(t.eq(2).val());
        a.push(t.eq(3).val());
        //if (!ur.isFirst()) a.push(ur.user().agentId);
        //else a.push('');
        return f.getWhere_root(aF, a);
    };
    o.search = pgSearch;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.poUpd = (function () {
    var o = $.extend({}, gobj, { dv: null, status: 'create', dvId: 'dvPOUpd' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //o.dv = $('#dvPOUpd');
            o.dv.find('button[name=query]').click(function () {
                agent.productLovMutil.show(fillProduct);
                o.dv.modal('hide');
            });
            o.tbl = o.dv.find('.report-results table');
            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                if ($(this).hasClass('number')) { changeNumber(this); }
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.cmbAnalytic = o.dv.find('#q_po_anyltic').change(function () {
                changeAnaltic($(this).find(':selected'));
            });
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });
            getAnalytic();
            o.total = o.dv.find('#q_po_total');
        }
    },
    saveClose = function (obj) {
        loading(obj);
        var t = $(obj).text();
        $(obj).text('正在提交...');
        submit(function () {
            close(); clear(); agent.po.search(); $(obj).text(t); loadingEnd();
        });
    },
    saveAdd = function (obj) {
        loading(obj);
        var t = $(obj).text();
        $(obj).text('正在提交...');
        submit(function () {
            clear(); $(obj).text(t); loadingEnd();
        });
    },
    loading = function (obj) {
        o.dv.find('.btn,input,select').disable();
        //$(obj).text('正在提交...');
    },
    loadingEnd = function (obj) {
        o.dv.find('.btn,input,select').enable();
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.cmbAnalytic.val('');
        o.dv.find('#q_po_total').val('');
        o.dv.find('textarea').val('');
    },
    changeAnaltic = function (obj) {
        var discount = parseInt($(obj).attr('data-discount') || 0);
        o.tbl.find('tbody tr').each(function () {
            var tds = $(this).find('td');
            tds.eq(4).text(discount);
            tds.eq(5).text(parseInt(tds.eq(1).text()) * parseFloat(tds.eq(2).text()) * (100 - discount) / 100);
        });
        total();
    },
    delTr = function (obj) {
        $(obj).parents('tr').remove();
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tds = $(obj).parents('tr').find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
        total();
    },
    //    pressEnter = function (obj) {
    //        if ($(obj).hasClass('number')) {
    //            $(obj).parents('tr').next().find('td:eq(1)').focus();
    //            changeNumber(obj);
    //        }
    //        else {
    //            $(obj).parents('tr').next().find('td:eq(6)').focus();
    //        }
    //    },
    //    changeNumber = function (obj) {
    //        var tds = $(obj).parents('tr').find('td'),
    //            price = tds.eq(2).text(), num = $(obj).text() || 0;
    //        tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
    //        total();
    //    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr').each(function () {
            t += parseFloat($(this).find('td:eq(5)').text() || 0);
        })
        o.total.val(t);
    }
    fillProduct = function (a) {
        var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, tr = [];
        //o.dv.modal('backdrop');
        o.dv.modal('show');
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td('1', 'class="number" contenteditable="true"'));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td('<small>' + b[3] + '</small>'));
            if (ur.user().isVip == "True" || ur.user().isVip === true) {
                td.push(dom.td(discount, 'class="number" contenteditable="true"'));
            }
            else {
                td.push(dom.td(discount, 'class="number"'));
            }
            td.push(dom.td(b[2] * (100 - discount) / 100, 'class="number"'));
            td.push(dom.td('', 'contenteditable="true"'));
            td.push(dom.td('<i class="icon-minus del">', 'style="text-align: center;"'));
            tr.push(dom.tr(td.join(''), 'data-prod-id="' + b[0] + '"'));
        }
        o.tbl.find('tbody').append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    submit = function (submitEnd) {
        var head = [], lines = [], om = this, uid = ur.user().id;
        head.push(ur.user().erpID || ur.user().agentId);
        head.push(o.total.val() || 0);
        head.push(o.dv.find('.modal-footer textarea').val());
        head.push(o.cmbAnalytic.val() || 'null');
        var trs = o.tbl.find('tbody tr');
        if (trs.length) {
            pgf.codeData('createSoHead', head, function (a) {
                lines = getLinesF(trs, a);
                pgf.batchUpdate('agent.so.line.create', lines, function () {
                    if (submitEnd) submitEnd();
                })
            })
        }
    },
    fdataHead = function (a) {
        o.id = a[0];
        o.dv.find('#q_po_vendor').val(a[1] || '上海欧美姿化妆品有限公司');
        o.dv.find('#q_po_date').val(a[2] ? f.date(a[2]) : gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.total.val(a[3] || '');
        o.cmbAnalytic.val(a[4] || '');
        if (a[6] == 1 || !a[6])
            o.dv.find('.modal-footer textarea').val(a[5]);
        else
            o.dv.find('.modal-footer textarea').val('');
        if (a[7])
            o.dv.find('.modal-header small').eq(0).text('[' + a[7] + ']');
    },
    fdataLine = function (a, discount) {//查看订单时
        var tr = [];
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            discount = discount || b[5];
            //if (o.tbl.find('tbody tr[data-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b[1]));
            td.push(dom.td(b[2], 'class="number"'));
            td.push(dom.td(b[3], 'class="number"'));
            td.push(dom.td('<small>' + b[4] + '</small>'));
            td.push(dom.td(discount, 'class="number"'));
            td.push(dom.td(b[6], 'class="number"'));
            td.push(dom.td(b[7]));
            td.push(dom.td(''));
            tr.push(dom.tr(td.join(''), 'data-id="' + b[0] + '"'));
        }
        o.tbl.find('tbody').html(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));

    },
    viewPo = function (id) {
        pgf.codeData('agent.so.head.query', [id], function (a) {
            fdataHead(a[0]);
        });
        pgf.codeData('agent.so.line.query', [id], function (a) {
            fdataLine(a);
        });
    }
    getLinesF = function (trs, a) {
        var line = [], lines = [];
        trs.each(function () {
            line = [];
            var tds = $(this).find('td');
            line.push(a[0]);
            line.push($(this).attr('data-prod-id'));
            line.push(tds.eq(1).text());
            line.push(tds.eq(4).text() || 0);
            line.push(tds.eq(2).text());
            line.push(ur.user().id);
            line.push(tds.eq(6).text() || '');
            lines.push(line);
        });
        return lines;
    },
    fillAnalytic = function (a) {
        var content = '<option data-discount="{3}" data-id="{0}" value="{0}">{1}</option>', c = [];
        //c.push(formatStr(content, ['', '', '', '']));
        c.push('<option></option>');
        for (var i = 0, b = []; b = a[i]; i++) {
            //c.push(formatStr(content, b));
            c.push('<option data-discount="' + b[3] + '" data-id="' + b[0] + '" value="' + b[0] + '">' + b[1] + '</option>');
        }
        o.cmbAnalytic.html(c.join(''));
    },
    getAnalytic = function () {
        pgf.codeData('a-analytic', [], function (a) {
            fillAnalytic(a);
        })
    },
    close = function () {
        o.dv.modal('hide');
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            viewPo(id);
            o.dv.find('.modal-header c').eq(0).text('查看');
            loading();
            o.dv.find('.btn').hide();
        }
        else {
            o.dv.find('.modal-header c').eq(0).text('添加');
            fdataHead([]);
            clear();
            loadingEnd();
            o.dv.find('.btn').show();
        }
    };
    o.saveClose = saveClose;
    o.saveAdd = saveAdd;
    return o;
})()

agent.poReturn = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvPoReturn' }), state = { 'draft': '草稿', 'open': '确认', 'paid': '已退款' },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            //o.dv = $('#dvPurchasOrder');
            o.oTbl = o.dv.find('.report-results>table');
            //o.dv.find('.vehicle_search button[name=query]').click(function () { pgSearch(); });

            o.oTbl.find('tbody tr a').live('click', function () {
                var id = $(this).parents('tr').attr('data-id');
                if ($(this).hasClass('drop')) {
                    moveOut(id);
                }
                else {
                    agent.soReturnView.show(id);
                }
            });
        }
    },
    moveOut = function (id) {
        pgf.codeTableData('agent.stock.out', [id, 1, ur.user().agentId, ur.user().id], function (a) {
            if (a.length > 0) {
                gf.callProcBatch('up_member_stockTran1', a, function () {
                    gtips.showNotice('确认成功！');
                    pgSearch();
                })
            }
        })
    },
    pgSearch = function () {
        var t = [];
        pgf.codeTableData('agent.so.return', [ur.user().erpID, where(), o.pager.val()], function (a) {
            for (var i = 0, l = a.length; i < l; i++) {
                t.push(fdata(a[i]));
            }
            o.searchend(a.length);
            if (t.length)
                o.oTbl.find('tbody').html(t.join(''));
            else
                o.oTbl.find('tbody').html('查询无记录');
        });
    },
    fdata = function (a) {
        var c = [], cd = '';
        c.push(dom.td('<a href="#">' + a[1] + '</a>'));
        c.push(dom.td(f.date(a[2])));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[3], 2) + '</label>'));
        c.push(dom.td(a[4]));
        c.push(dom.td(state[a[5]]));
        if (a[6] != a[3]) {
            c.push(dom.td('<a href="#" class="drop">确定</a>'));
        }
        else
            c.push(dom.td(''));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    },
    where = function () {
        var a = [], aF = [];
        aF.push("origin like '%r_r%'")
        aF.push("date_invoice>='r_r'");
        aF.push("date_invoice<='r_r'");
        aF.push("state='r_r'");
        //aF.push("storeId=r_r");
        var t = o.dvSp.find('input,select');
        a.push(t.eq(1).val());
        a.push(t.eq(2).val());
        a.push(t.eq(3).val());
        a.push(t.eq(4).val());
        //if (!ur.isFirst()) a.push(ur.user().agentId);
        //else a.push('');
        return f.getWhere_root(aF, a);
    };
    o.search = pgSearch;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.stockIn = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvStockIn' }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody .stin').live('click', function () {
                moveIn($(this).parents('tr'));
            });
            o.dv.find('.page-header f.btn').click(function () {
                batchMoveIn();
            });

            o.dv.find('input[name=all]').click(function () {
                if ($(this).attr('checked'))
                    o.tbl.find('tbody input[type=checkbox]').attr('checked', $(this).attr('checked'));
                else
                    o.tbl.find('tbody input[type=checkbox]').removeAttr('checked');
            });
        }
    },
    batchMoveIn = function () {
        var a = [], b = [], c = [];
        o.tbl.find('tbody tr:has(:checked)').each(function () {
            b = JSON.parse(decodeURI($(this).attr('data')));
            a.push(getData($(this), b));
            c.push([ur.user().agentId, b[0], b[4]]);
        });
        console.log(JSON.stringify(a));
        if (a.length > 0) {
            gf.callProcBatch('up_member_stockTran1', a, function () {
                pgf.batchUpdate('confirmStockMove', c, function () {
                    gtips.showNotice('入库成功！');
                    search();
                })
            })
        }
    },
    getData = function (tr, b) {
        var a = [], om = this;
        a.push(b[10]); //物料id
        a.push(b[2]); //单号
        a.push(b[9]); //类别id
        a.push(b[3]); //类别
        a.push(b[4]); //数量
        a.push(b[6]); //单价
        a.push(b[5]); //单位
        a.push(1); //来源
        a.push(ur.user().agentId);
        a.push(ur.user().agentId);
        a.push(ur.user().id);
        a.push('OE');
        a.push(b[11]); //销售订单行id
        a.push(b[0]); //stock move id
        a.push(b[1]); //order number
        a.push(b[16]); //barcode
        a.push(f.date(b[7])); //outDate
        return a;
    }
    moveIn = function (obj) {
        var b = JSON.parse(decodeURI(tr.attr('data'))), a = getData(obj, b);
        gf.callProc_with_value('up_member_stockTran1', a, function () {
            pgf.codeData('confirmStockMove', [ur.user().agentId, b[0], b[4]], function () {
                gtips.showNotice('入库成功！');
                search();
            })
        });
    },
    fdata = function (a) {
        var c = [];
        if (a[15] == 1) {
            c.push(dom.td(a[12] || '', 'rowspan=' + a[14]));
        }
        if (!a[15]) c.push(dom.td(''));
        c.push(dom.td(a[1]));
        c.push(dom.td(a[2]));
        c.push(dom.td(a[3]));
        c.push(dom.td(a[4] + '<small>' + a[5] + '</small>'));
        //c.push(dom.td(a[6]));
        //c.push(td(a[6]));
        c.push(dom.td(f.date(a[7])));
        //c.push(dom.td(f.date(a[8])));
        if (a[15] == 1) {
            if (a[13].indexOf('发货通知') >= 0) {
                c.push(dom.td(a[13] || '', 'style="width: 20%;max-width: 300px;min-width: 150px;" rowspan=' + a[14]));
            }
            else {
                c.push(dom.td('', 'rowspan=' + a[14]));
            }
        }
        if (!a[15]) c.push(dom.td(''));
        var data = encodeURI(JSON.stringify(a));
        c.push(dom.td((!a[8] && a[7]) ? '<a href="#" class="stin">入库</a>' : ''));
        c.push(dom.td('<input type="checkbox" />'));
        return dom.tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    },
    search = function () {
        pgf.codeTableData('member.stock.move', [ur.user().erpID, o.pager.val()], function (a) {
            var order = '', tr = [];
            for (var i = 0, l = a.length; i < l; i++) {
                order = a[12];
                tr.push(fdata(a[i]));
            }
            o.tbl.find('tbody').html(tr.join(''));
            o.searchend(a.length);
            //success ? success() : null;
        })
    };
    o.search = search;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

iniAnaylitic = {
    isIni: false,
    data: null,
    ini: function (obj) {
        var o = this;
        fillAnalytic = function (a, obj) {
            var content = '<option data-discount="{3}" data-id="{0}" value="{0}">{1}</option>', c = [];
            c.push('<option></option>');
            for (var i = 0, b = []; b = a[i]; i++) {
                c.push('<option data-discount="' + b[3] + '" data-id="' + b[0] + '" value="' + b[0] + '">' + b[1] + '</option>');
            }
            $(obj).html(c.join(''));
        };
        if (!o.isIni) {
            pgf.codeData('a-analytic', [], function (a) {
                o.data = a;
                o.isIni = true;
                fillAnalytic(a, obj);
            })
        }
        else {
            fillAnalytic(o.data, obj);
        }
    }
};
agent.oeMx = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvOeMx' }), state = { 'draft': '草稿', 'open': '确认', 'paid': '已退款' },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.oTbl = o.dv.find('.report-results>table');
            iniAnaylitic.ini('#q_om_a_id');
        }
    },
    pgSearch = function () {
        var t = [];
        pgf.codeTableData('agent.fin.mx', [ur.user().erpID, where(), o.pager.val()], function (a) {
            var total = 0;
            for (var i = 0, l = a.length; i < l; i++) {
                t.push(fdata(a[i]));
                total += a[i][3];
            }
            o.searchend(a.length);
            o.oTbl.find('tfoot th:eq(1)').html('<label class=number style="width:50%">' + f.price(total, 2) + '</label>');
            if (t.length)
                o.oTbl.find('tbody').html(t.join(''));
            else
                o.oTbl.find('tbody').html('查询无记录');
        });
    },
    fdata = function (a) {
        var c = [], cd = '';
        c.push(dom.td(a[4]));
        c.push(dom.td(a[0]));
        c.push(dom.td(a[1])); //f.date(a[1])));
        c.push(dom.td(a[2]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[3], 2) + '</label>'));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    },
    where = function () {
        var a = [], aF = [];
        aF.push("type='r_r'");
        aF.push("number like '%r_r%'");
        aF.push("date>='r_r'");
        aF.push("date<='r_r'");
        aF.push("analytic_id='r_r'");
        var t = o.dvSp.find('input,select');
        a.push(t.eq(1).val());
        a.push(t.eq(2).val());
        a.push(t.eq(3).val());
        a.push(t.eq(4).val());
        a.push(t.eq(5).val());
        return f.getWhere_root(aF, a);
    };
    o.excel = function (obj) {
        pgf.codeTableData('agent.fin.mx', [ur.user().erpID, where(), o.excelSize], function (a) {
            a = [['编号', '日期', '活动', '金额', '类型']].concat(a);
            o.excelEncode(a);
        });
    },
    o.search = pgSearch;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.oeYe = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvOeYe' }), state = { 'draft': '草稿', 'open': '确认', 'paid': '已退款' },
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.oTbl = o.dv.find('.report-results>table');
            iniAnaylitic.ini('#q_oy_a');
        }
    },
    pgSearch = function () {
        var t = [];
        pgf.codeTableData('agent.fin.ye', [ur.user().erpID, where()], function (a) {
            var total = 0;
            for (var i = 0, l = a.length; i < l; i++) {
                t.push(fdata(a[i]));
                total += a[i][0];
            }
            o.searchend(a.length);
            o.oTbl.find('tfoot th:eq(1)').html('<label class=number style="width:50%">' + f.price(total, 2) + '</label>');
            if (t.length)
                o.oTbl.find('tbody').html(t.join(''));
            else
                o.oTbl.find('tbody').html('查询无记录');
        });
    },
    fdata = function (a) {
        var c = [], cd = '';
        c.push(dom.td(a[1]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[0], 2) + '</label>'));
        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    },
    where = function () {
        var a = [], aF = [];
        aF.push("analytic_id='r_r'");
        var t = o.dvSp.find('input,select');
        a.push(t.eq(1).val());
        return f.getWhere_root(aF, a);
    };
    o.search = pgSearch;
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

if (ur.user().rank || ur.user().rank===0) {
    if (ur.user().rank != 1) {
        if (ur.user().rank == 2) {
            window.location = "/pos.shtml";
        }
        else if (ur.user().rank == 0) {
            window.location = "/factory.shtml";
        }
    }
}
else {
    window.location = "/shop/my_account.shtml";
}