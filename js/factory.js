/// <reference path="jquery-1.8.0.js" />
/// <reference path="base.js" />
/// <reference path="agent.base.js" />
/// <reference path="common/capture.js" /
/// <reference path="common/makePy.js" />

agent.marketing = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.marketing',
        fields: "id,code,name,[desc],CONVERT(varchar(100), startdate, 23),CONVERT(varchar(100), enddate, 23),type,status",
        dvId: 'dvMarketing'
    }),type={1:'礼品派送'},
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl.find('tbody tr a').live('click', function () {
                var tr=$(this).parents('tr');
                agent.marketingUpd.show($(this).attr('data-id'), JSON.parse(decodeURI(tr.attr('data'))));
            });
            o.dvSp.find('button[name=add]').click(function () {
                agent.marketingUpd.show();
            });
        }
    };
    o.fdata = function (a) {
        //id,code,name,[desc],startdate,enddate,type,status
        var c = [];
        c.push(dom.td(dom.a(a[1],'#','data-id='+a[0]))); //
        c.push(dom.td(a[2])); //
        c.push(dom.td(a[3])); //
        c.push(dom.td(a[4] + '--' + a[5])); //
        c.push(dom.td(type[a[6]])); //
        c.push(dom.td(a[7] ? '有效' : '无效')); //
        c.push(dom.td('')); //
        return dom.tr(c.join(""), 'data-id="' + a[0] + '" data="' + encodeURI( JSON.stringify(a)) + '"');
    }
    o.where = function () {
        return '';
    }
    base.iniFun.push(ini);
    return o;
})()

agent.marketingUpd = (function () {
    var o = { dv: null, store: {}, period: {} }, zIndex = 10,
    formatPartner = '<tr data-id="{0}"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td contenteditable="true" class="date">{5}</td><td contenteditable="true" class="date">{6}</td><td contenteditable="true">{7}</td><td><input type="checkbox" {8} /></td></tr>',
    formatPeriod = '<tr data-id="{0}"><td contenteditable="true">{1}</td><td contenteditable="true">{2}</td><td><input type="checkbox" checked="checked" /></td><td contenteditable="true"></td></tr>',
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvMarketingUpd');
            o.dvStore = o.dv.find('#q_m_u_s');
            o.dvProduct = o.dv.find('#q_m_u_p');
            o.dvPeriod = o.dv.find('#q_m_u_d');
            o.dvProduct.find('.btn[name=query]').click(function () {
                agent.productLovMutil.show();
                o.dv.modal('hide');
            });
            o.dvPeriod.find('.btn[name=add]').click(function () {
                addPeriod();
            });
            o.dvStore.find('.btn[name=query]').click(function () {
                agent.partnerLovTree.show(selectedPartner);
                var z = zIndex;
                zIndex = o.dv.css('z-index');
                o.dv.css('z-index', z);
            });
            o.dv.find('.modal-footer').find('.btn-success').click(function () {
                saveClose();
            });
        }
    },
    addPicker = function () {
        $('td[contenteditable="true"].date').datepicker({ changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd", format: "yyyy-mm-dd" });
    },
    addPeriod = function () {
        var tr = formatStr(formatPeriod, ['', gf.dateFormat(new Date(), 'yyyy-MM-dd'), gf.dateFormat(gf.addDay(new Date(), 365), 'yyyy-MM-dd'), 'checked="checked"']);
        o.dvPeriod.find('table tbody').prepend(tr);
        addPicker();
    },
    selectedPartner = function (p) {
        if (p) {
            if (o.dvStore.find('tr[data-id="' + p.id + '"]').size() == 0) {
                var tr = formatStr(formatPartner, [p.id, p.code, p.name, p.uname, p.mobile, gf.dateFormat(new Date(), 'yyyy-MM-dd'), gf.dateFormat(gf.addDay(new Date(), 8), 'yyyy-MM-dd'),2, 'checked="checked"']);
                o.dvStore.find('table tbody').prepend(tr);
                addPicker();
            }
        }
        else {
            o.dv.css('z-index', zIndex);
            zIndex = 10;
        }
    },
    searchEnd = function (dv, len) {
        dv.find('.result-header h4').find('c').html(len).end().find('d').html(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    updateMarketing = function (success) {
        var a = [];
        a.push(o.id || 0);
        a.push($('#q_m_u_code').disable().val());
        a.push($('#q_m_u_name').val());
        a.push($('#q_m_u_type').val());
        a.push($('#q_m_u_status:checked').size());
        a.push(o.dv.find('.modal-footer textarea').val());
        a.push(ur.user().agentId);
        a.push(ur.user().id);
        gf.getOneLine('up_member_updateMarketing', a, function (a) {
            success ? success(a) : null;
        });
    },
    updatePeriod = function (success) {//更新期间
        var pu = [];
        o.dvPeriod.find('.report-results table tbody tr').each(function () {
            var a = [], tds = $(this).find('td'), id = $(this).attr('data-id');
            if (id) { //存在的话需要判断是否修改过
                if (o.period[id][0] != tds.eq(0).text()
                    || o.period[id][1] != tds.eq(1).text()
                    || o.period[id][2] != tds.eq(2).find(':checked').size()
                    || o.period[id][2] != tds.eq(1).text()) {
                    a.push(id);
                    a.push(o.id);
                    a.push(tds.eq(0).text());
                    a.push(tds.eq(1).text());
                    a.push(tds.eq(2).find(':checked').size());
                    a.push(tds.eq(3).text());
                    a.push(ur.user().id);
                    pu.push(a);
                }
            }
            else {
                a.push(0);
                a.push(o.id);
                a.push(tds.eq(0).text());
                a.push(tds.eq(1).text());
                a.push(tds.eq(2).find(':checked').size());
                a.push(tds.eq(3).text());
                a.push(ur.user().id);
                pu.push(a);
            }
        });
        if (pu.length) {
            gf.callProcBatch('up_member_updateMarketingPeriod', pu, function () {
                success ? success() : null;
            })
        }
        else {
            success ? success() : null;
        }
    },
    updateStore = function (success) {
        var pu = [];
        o.dvStore.find('.report-results table tbody tr').each(function () {
            var a = [], tds = $(this).find('td'), id = $(this).attr('data-id');
            if (o.store[id]) {
                if (o.store[id][0] != tds.eq(4).text()
                    || o.store[id][1] != tds.eq(5).text()
                    || o.store[id][2] != (tds.eq(7).find(':checked').size() > 0 ? 'O' : 'C')
                    || o.store[id][3]!=tds.eq(6)) {
                    a.push(o.id);
                    a.push(id);
                    a.push(tds.eq(4).text());
                    a.push(tds.eq(5).text());
                    a.push(tds.eq(6).text()==''?'null':tds.eq(6).text());
                    a.push(tds.eq(7).find(':checked').size() > 0 ? 'O' : 'C');
                    a.push(ur.user().id);
                    pu.push(a);
                }
            }
            else {
                a.push(o.id);
                a.push(id);
                a.push(tds.eq(4).text());
                a.push(tds.eq(5).text());
                a.push(tds.eq(6).text()==''?'null':tds.eq(6).text());
                a.push(tds.eq(7).find(':checked').size() > 0 ? 'O' : 'C');
                a.push(ur.user().id);
                pu.push(a);
            }
        });
        if (pu.length) {
            gf.callProcBatch('up_member_updateMarketingStore1', pu, function () {
                success ? success() : null;
            })
        } else {
            success ? success() : null;
        }
    },
    saveClose = function () {
        updateMarketing(function (a) {
            var id = a[0];
            o.id = id;
            updateStore(function () {
                updatePeriod(function () {
                    o.dv.modal('hide');
                });
            });
        });
    },
    getPeriod = function (id) {
        var trs = [];
        gf.noPagination('up_member_getMarketingPeriod', [id], function (a) {
            for (var i = 0, b = []; b = a[i]; i++) {
                b[1] = f.date(b[1]);
                b[2] = f.date(b[2]);
                o.period[b[0]] = [b[1], b[2], b[3]];
                b[3] = b[3].toUpperCase() == 1 ? 'checked="checked"' : '';
                trs[i] = formatStr(formatPeriod, b);
            }
            o.dvPeriod.find('table tbody').html(trs);
            addPicker();
            searchEnd(o.dvPeriod, a.length);
        })
    }
    getStore = function (id) {
        var trs = [];
        gf.noPagination('up_member_getMarketingStore1', [id, ur.user().agentId], function (a) {
            for (var i = 0, b = []; b = a[i]; i++) {
                b[5] = f.date(b[5]);
                b[6] = f.date(b[6]);
                o.store[b[0]] = [b[5], b[6], b[8],b[7]];
                b[8] = b[8].toUpperCase() == 'O' ? 'checked="checked"' : '';
                trs[i] = formatStr(formatPartner, b);
            }
            o.dvStore.find('table tbody').html(trs);
            addPicker();
            searchEnd(o.dvStore, a.length);
        })
    };
    o.show = function (id, data) {
        ini();
        var t = '创建';
        o.id = null;
        $('#q_m_u_code').enable();
        if (id) {
            t = '修改';
            o.id = id;
            $('#q_m_u_code').val(data[1]).disable();
            $('#q_m_u_name').val(data[2]);
            $('#q_m_u_type').val(data[6]);
            o.dv.find('.modal-footer textarea').val(data[3]);
            getStore(id);
            getPeriod(id);
        }
        o.dv.find('.modal-header h3 c').text(t);
        o.dv.modal({});
    }
    return o;
})();

agent.agent1 = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.agent_v3',
        fields: "ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,parentID,min(rank) over(),hgift,companyId",
        dvId: 'dvAgent1'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            
        }
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.agent = (function () {
    var o = $.extend({}, gobj, gpagination, { dvId: 'dvAgent', ttbl: "member.agent_v4",
        fields: 'ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,parentID,min(rank) over(),hgift,companyId,uname,street'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('button[name=add]').click(function () {
                agent.agentUpd.show();
            });
            o.dv.find('tbody').find('a').live('click', function () {
                agent.agentUpd.show($(this).attr('data-id'), $(this).attr('data-parent-id'), $(this).parents('tr').attr('data'));
            });
            o.dv.find('input[name=all]').click(function () {
                if ($(this).attr('checked'))
                    o.dv.find('tbody input[type=checkbox]').attr('checked', $(this).attr('checked'));
                else
                    o.dv.find('tbody input[type=checkbox]').removeAttr('checked');
            });
            o.dv.find('.page-header f.btn').eq(0).click(function () {
                var a = [];
                o.dv.find('tbody :checked').each(function () {
                    a.push($(this).val());
                });
                gf.query('agent.factory.openMarketing', [ur.user().agentId, a.join(',')], function () {
                    o.search();
                })
            });
        }
    };
    var gaRank = { 1: '代理商', 2: '终端店', 3: '连锁店' };
    o.fdata = function (a) {
        //ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty
        var c = [], format = "_id={0} data-id={0} districtcode={1} rank={2} code='{3}' class='{4}' data='{4}'";
        c.push(dom.td(a[13] == ur.user().id ? '' : '<input type=checkbox value="' + a[0] + '">'));
        c.push(dom.td(dom.a(a[1], '#', 'data-id=' + a[0]))); //编码
        c.push(dom.td(gaRank[a[2]])); //等级
        c.push(dom.td(a[3])); //名称
        c.push(dom.td(a[14])); //联系人
        c.push(dom.td(a[4])); //联系电话
        c.push(dom.td(a[5])); //上级
        c.push(dom.td(f.date(a[6])));
        c.push(dom.td(a[12] > 0 ? '是' : '否'));
        c.push(dom.td(a[13] == ur.user().agentId ? '已开通' : '未开通'));
        c.push(dom.td(dom.a('添加下级', '#', 'data-parent-id=' + a[0]))); //编码
        if (a[11] == a[2]) a[10] = -1;

        return dom.tr(c.join(""), String.format(format, a[0], a[8], a[2], a[1], encodeURI(JSON.stringify(a))));
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push("rank=r_r");
        aF.push("DistrictCode like 'r_r%'");
        aF.push("hgift > r_r");
        aF.push("code like 'r_r%'");
        aF.push("(companyId=r_r or companyId is null)");

        a[0] = o.dv.find('.cmbRank').val();
        if (o.dv.find('#q_a_area').val()) {
            a[1] = o.dv.find('#q_a_area').val();
        }
        a[2] = this.dv.find('#q_q_status:checked').val();
        a[3] = this.dv.find('#q_a_code').val();

        a[4] = ur.user().agentId;
        return f.getWhere_root(aF, a);
    };
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.agentUpd = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null }),
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvAgentUpd');
            o.dv.find('.btn-success').click(function () {
                save(function () {
                    o.dv.modal('hide');
                    clear();
                    agent.agent.search();
                });
            }).find('.btn-save-add').click(function () {
                save(function () {
                    clear();
                    agent.agent.search();
                });
            });
            o.cmbAddress = o.dv.find('.address select');
            o.dv.find('.modal-body table td:eq(0)').find('input').blur(function () {
                if ($(this).val().length == 3) {
                    $(this).removeClass('error');
                }
                else {
                    $(this).addClass('error');
                }
            });
            o.iniAddr();
        }
    },
    clear = function () {
        o.id = null;
        o.dv.find('input').val('');
    },
    save = function (success) {
        var a = [], tds = o.dv.find('.modal-body table td');
        a.push(ur.user().id);
        a.push(o.id || 0);
        a.push(o.parentId||ur.user().agentId);
        var code = tds.eq(0).find('input');
        if (code.val().length != 3) {
            code.addClass('error');
            return;
        }
        a.push(o.cmbAddress.eq(2).val()); //addr
        a.push((o.pcode||'') + code.val()); //code
        a.push(tds.eq(1).find('input').val()); //name
        a.push(ur.user().agentId); //company
        a.push(tds.eq(2).find('input').val()); //user
        a.push(tds.eq(3).find('input').val()); //mobile
        a.push(tds.eq(5).find('input').val()); //street
        gf.callProc_with_value('up_member_updateAgentForFactory', a, function (v) {
            if (v == 0) {
                alert('编号存在！');
            }
            else {
                alert('更新成功！');
                if (success) success();
            }
        });
    },
    fdata = function (a, b) {
        var inputs = o.dv.find('input');
        if (a) {
            inputs.eq(0).val(a[1].substr(o.pcode.length));
            inputs.eq(1).val(a[3]);
            inputs.eq(2).val(a[14]);
            inputs.eq(3).val(a[4]);
            inputs.eq(4).val(a[15]);
        }
        o.setDefault(b);
    };
    o.show = function (id, parentId, a) {
        ini();
        o.dv.modal({});
        clear();
        o.id = id;
        o.parentId = parentId;
        a = JSON.parse(decodeURI(a));
        o.pcode = ur.user().code;
        var tds = o.dv.find('.modal-body table td');
        o.dv.find('.modal-header c').text('添加');
        o.dv.find('.modal-header sma').text(ur.user().coName + '的下级');
        if (id) {
            o.pcode = a[1].substring(0, a[1].length - 3);
            fdata(a, a[8]);
            o.dv.find('.modal-header c').text('修改');
            o.dv.find('.modal-header sma').text(a[3]);
        }
        if (parentId) {
            tds.eq(0).find('c').text(ur.user().code);
            o.pcode = a[1];
            fdata('', a[8]);
            o.dv.find('.modal-header sma').text(a[3] + '的下级');
        }
        tds.eq(0).find('c').text(o.pcode);
    };
    return o;
})()

if (ur.user().rank || ur.user().rank === 0) {
    if (ur.user().rank != 0) {
        if (ur.user().rank == 1) {
            window.location = "/agent.shtml";
        }
        else if (ur.user().rank == 2) {
            window.location = "/pos.shtml";
        }
    }
}
else {
    if(!ur.user().id)
        window.location = "/shop/my_account.shtml";
}