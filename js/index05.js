/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="common/makePy.js" />
/// <reference path="common.js" />
/// <reference path="common05.js" />
/// <reference path="common/capture.js" />
/// <reference path="jquery.treeTable.js" />


gMenu.action= function (index) {
        var om = this;
        if (index < 21) {
            var a = ['mRegister', 'mMemberCardNo', 'mAgent', 'mMember', 'mGiftDelivery', 'mUsers', 'mSaleStock',
                 'mAgentSta', 'mPos', 'mSaleOrder', 'mStock', 'mProductCateg', 'mPurchasOrder', 'mStockTranIn', 'mStockTranOut', 'mMarketing', 'mYe'];
            var aTitle = ['销售单', '采购单'];
            window[a[index]].ini();
            this.dvs.hide().eq(index).show();
        } else {
            switch (index) {
                case '21': //退出
                    logout();
                    break;
                case '22':
                    break;
                case '23':
                    break;
                case '24':
                    break;
            };
        }
    }

    var mPos = {
        dv: null,
        dvMax: null,
        categUl: null,
        productUl: null,
        detailUl: null,
        memberUl: null,
        dvInfo: null,
        command: null,
        isStart: true,
        ini: function () {
            var om = this;
            if (!this.dv) {
                this.dv = $('#dvPos');

                this.preIni();

                this.dvMax = this.dv.find('.max').click(function () {
                    if (window.fullScreenApi.isFullScreen())
                        om.exitFull();
                    else
                        om.fullScreen();
                });
                this.dvInfo = this.dv.find('.info').find('.money div:eq(1)').click(function () {
                    var o = om.dvInfo.find('.pay').toggle('drop', { direction: "up" }, 500, function () {
                        $(this).attr('display', $(this).attr('display') === "false");
                        if ($(this).attr('display') === "false")
                            om.message('等待付款...');
                        else
                            om.message('等待输入...');
                    });

                }).end().find('.pay input.in').change(function () {
                    om.pay2();
                }).end().find('.pay input[type=number]:last').click(function () {
                    om.pay();
                    om.command.html('');
                }).end();

                this.categUl = this.dv.find('.category ul').find('li').live('click', function () {
                    var id = $(this).attr('_id');
                    if (om.dv.find('.main .product').hasClass('productChange')) om.mainChange();
                    om.getProduct(id);
                }).end();

                this.productUl = this.dv.find('ul.product').find('li').live('click', function () {
                    om.addDetail($(this));
                }).end();
                this.memberUl = this.dv.find('ul.member').find('li').live('click', function () {
                    var m = om.dvInfo.find('.member'), o = m.find('label');
                    o.eq(0).html($(this).find('li:eq(0)').html());
                    o.eq(1).html($(this).attr('_point'));
                    m.attr('_id', $(this).attr('_id'));
                }).end();
                this.dvInfo.find('.member').click(function () {
                    om.mainChange();
                });

                this.command = this.dv.find('.command').enterpress(function () {
                    om.command(this);
                });
                this.exitFull();
            }
            gf.noPagination('up_member_getProductCategory', [ur.user().agentId], function (a) {
                om.fdataCategory(a);
            }, 1)
        },
        command: function (obj) {
            var v = $(obj).text().toUpperCase(), om = this;
            //付款
            if (isNumber(v) && om.dvInfo.find('.money div:eq(1)').attr('display')) {
                om.pay();
            }
            else if (v == 'QP' || v == '**') {
                om.fullScreen();
            }
            else if (v = 'QT' || v == '////') {
                om.exitFull();
            }
            $(this).text('');
        },
        //获取产品的列表
        getProduct: function (id) {
            var om = this;
            gf.noPagination('up_member_getProduct', [id], function (a) {
                om.fdataProduct(a);
            });
        },
        preIni: function () {
            var om = this;
            this.detailUl = this.dv.find('.orderDetail ol').find('.operate div').live('click', function () {
                if ($(this).html() == '+')
                    om.addDetail($(this).parent());
                else
                    om.delDetail($(this).parent());
            }).end().find('input').live('change', function () {
                om.changeDetail($(this).parent());
            }).end();
        },
        clearDetail: function () {
            this.detailUl.html('');
            this.dvInfo.find('.moeny label').html('0');
            this.dvInfo.find('.pay input[type=number]').val('0');
            this.dvInfo.find('.member label').val('');
        },
        //会员与产品交换
        mainChange: function () {
            var om = this;
            if (om.dv.find('.main .member').hasClass('memberChange')) {
                om.dv.find('.main .product').removeClass('productChange');
                om.dv.find('.main .member').removeClass('memberChange');
                om.message('等待选择产品...');
            }
            else {
                om.dv.find('.main .product').addClass('productChange');
                om.dv.find('.main .member').addClass('memberChange');
                gf.noPagination('up_member_stroeMemeber', [ur.user().agentId], function (a) {
                    var li = '', format = '<li _id={0} _point={4}><ul><li>{1}</li><li>{2}</li><li>{3}</li></ul></li>';
                    for (var i = 0, len = a.length; i < len; i++) {
                        li += String.format.apply(null, [format].concat(a[i]))
                    }
                    om.memberUl.html(li);
                })
                om.message('等待选择用户...');
            }
        },
        //添加
        addDetail: function (obj) {
            var format = '<li id=od{5}><div class=operate _id={5} _price={1}><div>+</div><input type=number value=1 /><div>-</div></div><div>{0}</div><div><p>{4}</p><p>{3}</p><p>{2}</p><p>{1}</p></div></li>',
            id = obj.attr('_id'), od = this.detailUl.find('#od' + id), p = od.find('p'), ni = od.find('input'),
            price = parseFloat(obj.attr('_price')), os = od.size(), discount = this.cmbAnalytic ? this.cmbAnalytic.find(':selected').attr('data-discount') : 0;
            discount = discount ? parseFloat(discount) : 0;
            if (this.isStart) {
                this.clearDetail();
                os = 0;
            }
            if (os) {
                var numObj = p.eq(2), number = parseInt(numObj.html()) + 1, amountObj = p.eq(0);
                numObj.html(number);
                amountObj.html(f.price(number * price * (1 - discount / 100), 2));
            }
            else
                this.detailUl.append(String.format(format, obj.find('.label').html(), price, 1, discount, price * (1 - discount / 100), id));
            ni.val(number);
            this.isStart = false;
            this.total();
        },
        //添加
        discountDetail: function (obj) {
            var format = '<li id={5}><div class=operate _id={5} _price={1}><div>+</div><input type=number value=1 /><div>-</div></div><div>{0}</div><div><p>{4}</p><p>{3}</p><p>{2}</p><p>{1}</p></div></li>',
            //id = obj.attr('id'), 
            od = obj, //this.detailUl.find('#' + id), 
            p = od.find('p'), ni = od.find('input'),
            price = parseFloat(obj.find('.operate').attr('_price')), os = od.size(), discount = this.cmbAnalytic ? this.cmbAnalytic.find(':selected').attr('data-discount') : 0;
            discount = discount ? parseFloat(discount) : 0;

            var numObj = p.eq(2), number = parseInt(numObj.html()), amountObj = p.eq(0);
            numObj.html(number);
            amountObj.html(f.price(number * price * (1 - discount / 100), 2));

            ni.val(number);
            this.isStart = false;
            this.total();
        },
        changeDetail: function (obj) {
            var id = obj.attr('_id'), od = this.detailUl.find('#od' + id), p = od.find('p'), numObj = p.eq(2), amountObj = p.eq(0),
                v = parseFloat(od.find('input').val()), price = parseFloat(obj.attr('_price')), price = parseFloat(obj.attr('_price')),
                discount = this.cmbAnalytic ? this.cmbAnalytic.find(':selected').attr('data-discount') : 0;
            discount = discount ? parseFloat(discount) : 0;
            if (v) {
                numObj.html(v);
                amountObj.html(f.price(v * price * (1 - discount / 100), 2));
            }
            else {
                od.remove();
            }
            this.total();
        },
        //减去数量
        delDetail: function (obj) {
            var id = obj.attr('_id'), od = this.detailUl.find('#od' + id), p = od.find('p'), numObj = p.eq(2), ni = p.find('input'),
            number = parseInt(numObj.html()) - 1, amountObj = p.eq(0), price = parseFloat(obj.attr('_price'));
            if (number == 0) od.remove();
            else {
                numObj.html(number);
                amountObj.html(f.price(number * price, 2));
                ni.val(number);
            }
            this.total();
        },
        //计算合计
        total: function () {
            var totalAmount = 0;
            this.detailUl.find('li').find('p:eq(0)').each(function () {
                totalAmount += parseFloat($(this).html());
            });
            this.dvInfo.find('.money label').eq(0).html(f.price(totalAmount, 2));
            this.dvInfo.find('.pay input:eq(0)').val(f.price(totalAmount, 1));
        },
        //付款
        pay: function () {
            if (this.isStart) { this.message('不能重复付款！'); return; }
            var money = this.dvInfo.find('.money label'), amount = f.price(money.eq(0).html(), 1), v = this.command.html() || 0, //-parseFloat(amount),
            h = parseInt(v / 100), t = parseInt((v - h * 100) / 10), g = parseInt(v - 100 * h - 10 * t), x = f.price((v - 100 * h - 10 * t - g) * 10),
            num = this.dvInfo.find('.pay input[type=number]'), give = f.price(v - parseFloat(amount), 1);
            money.eq(1).html(v);
            num.eq(1).val(h);
            num.eq(2).val(t);
            num.eq(3).val(g);
            num.eq(4).val(x);
            num.eq(5).val(give);
            money.eq(2).html(give);
            if (give >= 0) this.addSo();
            else this.message('金额不足，付款失败！');
            //this.isStart = true;
        },
        message: function (msg) {
            gtips.showNotice(msg);
            this.dvInfo.find('.notic label:eq(1)').html(msg);
        },
        //在收银台付款
        pay2: function () {
            var money = this.dvInfo.find('.money label'), num = this.dvInfo.find('.pay input.in'),
        v = parseInt(num.eq(0).val() * 100) + parseInt(num.eq(1).val() * 10) + parseInt(num.eq(2).val()) + parseInt(num.eq(3).val()) / 10;
            money.eq(1).html(v);
            this.command.html(v);
        },
        //添加销售订单
        addSo: function () {
            var head = [], line = [], lines = [], om = this, uid = ur.user().id;
            head.push(ur.user().id);
            head.push(this.dvInfo.find('.member').attr('_id') || '');
            head.push(this.dvInfo.find('.pay input:eq(0)').val());
            head.push(uid);
            this.detailUl.find('li').each(function () {
                var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
                line = [];
                line.push(obj.attr('_id'));
                line.push(qty);
                line.push(price);
                line.push(uid);
                lines.push(line);
            });
            if (lines.length) mSaleOrder.addSo(head, lines, function () { om.isStart = true; om.message('付款成功！') });
        },
        fdataCategory: function (a) {
            var li = '', format = '<li _id={0} title={1}>{1}</li>';
            for (var i = 0, l = a.length; i < l; i++) {
                li += String.format.apply(null, [format].concat(a[i]));
            }
            this.categUl.html(li).width(a.length*150);
        },
        fdataProduct: function (a) {
            var li = '', format = '<li _id={0} _price={2} title={3}><div class=photo>' + ('<img alt={3} src={6} />') + '</div><div class=label>{1}</div><p class=price><em>{2}/{4}</em></p></li>';
            for (var i = 0; i < a.length; i++) {
                format = format = '<li _id={0} _price={2} title={3}><div class=photo>' + (a[i][6]?'<img alt={3} src={6} />':a[i][3]) + '</div><div class=label>{1}</div><p class=price><em>{2}/{4}</em></p></li>';
                li += String.format.apply(null, [format].concat(a[i]));
            }
            this.productUl.html(li);

        },
        fullScreen: function () {
            window.fullScreenApi.requestFullScreen(this.dv[0]);
            this.dvMax.attr('title', '单击退出全屏');
        },
        exitFull: function () {
            window.fullScreenApi.cancelFullScreen();
            this.dvMax.attr('title', '单击进入全屏');
        }
    }

    var mPurchasOrder = $.extend({}, gPaginationModel, {
        dv: null,
        fields: 'id,orderNumber,date_order,amount,saleConfirmDate,shipped,sellerStore',
        tbl: 'member.storeOrderHeadPo_v',
        ini: function () {
            if (!this.dv) {
                this.dv = $('#dvPurchasOrder');
                var om = this;
                this.oTbl = this.dv.find('table').find(':button').live('click', function () {
                    var id = $(this).parent().parent().attr('_id');
                    if ($(this).hasClass('update')) mPoUpdate.show(this, id);
                    else mPoView.show(this, id);
                    //om.confirmPo(id);
                }).end();

                this.dv.find('.tool .btnSearch').click(function () {
                    if (ur.isFirst()) om.pgSearch();
                    else om.search();
                }).end().find('.btnAdd').click(function () {
                    mPoPos.show(this);
                });

                gf.noPaginationSqlPara('role<10 and agentID=' + ur.user().agentId, 'ID asc', "id,name", 'member.users', function (a) {
                    gOption.foption($('.cmbSaler').eq(0), a, -1, ['', '']);
                    gOption.foption($('.cmbSaler').eq(1), a, -1);
                });
                this.ini_after();
            }
        },
        pgSearch: function () {
            var om = this, t = [];
            pgf.codeTableData('soHead', [ur.user().erpID, om.where()], function (a) {
                for (var i = 0, l = a.length; i < l; i++) {
                    t.push(om.fdata(a[i]));
                }
                if (t.length)
                    om.oTbl.find('tbody').html(t.join(''));
                else
                    om.oTbl.find('tbody').html('查询无记录');
            });
        },
        fdata: function (a) {
            var c = [];
            //c.push(td('MSO' + a[0]));
            c.push(td(a[1]));
            c.push(td(f.date(a[2])));
            c.push(td(f.price(a[3], 2)));
            c.push(td(a[6]));
            c.push(td(a[4] ? f.date(a[4]) : ''));
            c.push(td(String.format("<progress value={0} max=100>{0}%</progress>", parseFloat(a[5]) * 100 || 0)));
            c.push(td(a[4] ? '<input type=button class=view value=查看 />' : '<input type=button class=update value=修改 />'));
            return tr(c.join(""), '_id="' + a[0] + '"');
        },
        where: function () {
            var a = [], aF = [];
            aF.push("date_order>='r_r'");
            aF.push("date_order<'r_r'");
            aF.push("storeId=r_r");
            var o = this.dv.find('.tool :text');
            a.push(o.eq(0).val());
            a.push(o.eq(1).val());
            if (!ur.isFirst()) a.push(ur.user().agentId);
            else a.push('');
            return f.getWhere_root(aF, a);
        },
        addSo: function (head, lines, success) {
            gf.callProc_with_value('up_member_storeOrderHead', head, function (v) {
                for (var i = 0, len = lines.length; i < len; i++) {
                    lines[i] = [v].concat(lines[i]);
                }
                gf.callProcBatch('up_member_storeOrderLine', lines, function () {
                    success();
                })
            })
        }
    })

    var mStockTranIn = $.extend({}, gPaginationModel, {
        dv: null,
        tbl: 'member.stockTranIn_v',
        fields: 'id,orderNumber,productName,category,qty,uom,price,outDate,inDate,productID,imgID',
        ini: function () {
            if (!this.dv) {
                this.dv = $('#dvStockTranIn');
                var om = this;
                this.oTbl = this.dv.find('table').find(':button').live('click', function () {
                    //mSoUpdate.show(this, $(this).parent().parent().attr('_id'));
                    if (ur.user().erpID) om.moveIn($(this).parent().parent());
                    else om.moveIn2($(this).parent().parent());
                }).end();

                this.dv.find('.tool .btnSearch').click(function () {
                    om.search();
                }).end().find('.btnAdd').click(function () {
                    //mSoUpdate.show(this);
                    om.moveIn($(this).parent().parent());
                });
                this.ini_after();
            }
        },
        moveIn: function (obj) {
            var a = [], b = JSON.parse(obj.attr('data')), om = this;
            a.push(b[10]); //物料id
            a.push(b[2]); //单号
            a.push(b[9]); //类别id
            a.push(b[3]); //类别
            a.push(b[4]); //数量
            a.push(b[6]); //单价
            a.push(b[5]); //单位
            a.push(-1); //来源
            a.push(ur.user().agentId);
            a.push(ur.user().agentId);
            a.push(ur.user().id);
            a.push('OE');
            a.push(b[11]); //销售订单行id
            a.push(b[0]); //stock move id
            a.push(b[1]); //order number
            a.push(f.dateFormat(b[7])); //outDate
            gf.callProc_with_value('up_member_stockTran', a, function () {
                pgf.codeData('confirmStockMove', [ur.user().agentId, b[0], b[4]], function () {
                    gtips.showNotice('入库成功！');
                    om.search();
                })
            });
        },
        moveIn2: function (obj) {
            //'id,orderNumber,productName,category,qty,uom,price,outDate,inDate,productID',
            var a = [], b = JSON.parse(obj.attr('data')), om = this;
            a.push(b[0]); //
            a.push(b[4]); //
            a.push(b[9]); //
            a.push(ur.user().agentId);
            a.push(b[6]);
            a.push(b[3]);
            a.push(b[10]);
            a.push(ur.user().id);
            gf.callProc_with_value('up_member_stockTranIn', a, function () {
                gtips.showNotice('入库成功！');
                om.search();
            });
        },
        search_done: function (success) {
            if (ur.user().erpID) this.pgSearch(success);
            else success ? success() : null;
        },
        pgSearch: function (success) {
            var om = this, tr = [];
            pgf.codeTableData('member.stock.move', [ur.user().erpID], function (a) {
                var order = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    order = a[12];
                    tr.push(om.fdata(a[i]));
                }
                om.oTbl.find('tbody').prepend(tr.join(''));
                success ? success() : null;
            })
        },
        fdata: function (a) {
            var c = [];
            if (a[15] == 1) {
                c.push(td(a[12] || '', 'rowspan=' + a[14]));
            }
            if (!a[15]) c.push(td(''));
            c.push(td(a[1]));
            c.push(td(a[2]));
            c.push(td(a[3]));
            c.push(td(a[4]));
            c.push(td(a[5]));
            //c.push(td(a[6]));
            c.push(td(f.date(a[7])));
            c.push(td(f.date(a[8])));
            if (a[15] == 1) {
                if (a[13].indexOf('发货通知') >= 0) {
                    c.push(td(a[13] || '', 'rowspan=' + a[14]));
                }
                else {
                    c.push(td('', 'rowspan=' + a[14]));
                }
            }
            if (!a[15]) c.push(td(''));
            data = JSON.stringify(a);
            c.push(td((!a[8] && a[7]) ? '<input type=button value=入库 />' : ''));
            return tr(c.join(""), '_id="' + a[0] + '" data=' + data);
        },
        where: function () {
            var a = [], aF = [];
            aF.push('storeId=r_r');
            aF.push("(inDate >= 'r_r' or inDate is null)");
            aF.push("(inDate < 'r_r' or inDate is null)");
            //        aF.push("categoryID = 'r_r'");
            a.push(ur.user().agentId);
            var o = this.dv.find('.tool :text');
            a.push(o.eq(0).val());
            a.push(o.eq(1).val());
            //        a.push(o.eq(2).val());
            return f.getWhere_root(aF, a);
        }
    })

var mStockTranOut = $.extend({}, gPaginationModel, {
    dv: null,
    tbl: 'member.stockTranOut_v',
    fields: 'id,orderNumber,productName,category,qty,uom,price,outDate,productID',
    ini: function () {
        if (!this.dv) {
            this.dv = $('#dvStockTranOut');
            var om = this;
            this.oTbl = this.dv.find('table').find(':button').live('click', function () {
                //mSoUpdate.show(this, $(this).parent().parent().attr('_id'));
                om.moveOut($(this).parent().parent());
            }).end();

            this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            }).end().find('.btnAdd').click(function () {
                //mSoUpdate.show(this);
                om.moveIn($(this).parent().parent());
            });
            this.ini_after();
        }
    },
    moveOut: function (obj) {
        var a = [], b = JSON.parse(obj.attr('data')), om = this;
        a.push(b[0]); //
        a.push(b[4]); //
        a.push(b[8]); //
        a.push(ur.user().agentId);
        a.push(ur.user().id);
        gf.callProc_with_value('up_member_stockTranOut', a, function () {
                gtips.showNotice('出库成功！');
                om.search();
        });
    },
    fdata: function (a) {
        var c = [];
        c.push(td(a[1]));
        c.push(td(a[2]));
        c.push(td(a[3]));
        c.push(td(a[4]));
        c.push(td(a[5]));
        //c.push(td(a[6]));
        c.push(td(f.date(a[7])));
        data = JSON.stringify(a);
        c.push(td(a[7] ?'': '<input type=button value=出库 />'));
        return tr(c.join(""), '_id="' + a[0] + '" data=' + data);
    },
    where: function () {
        var a = [], aF = [];
        aF.push('storeId=r_r');
        aF.push("(outDate >= 'r_r' or outDate is null)");
        aF.push("(outDate < 'r_r' or outDate is null)");
        //        aF.push("categoryID = 'r_r'");
        a.push(ur.user().agentId);
        var o = this.dv.find('.tool :text');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        //        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    }
})

var mPoUpdate = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvPoUpdate').find('.icon_close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' }).find('.btnAdd').click(function () {
                mPoPos.show($(this));
            }).end();
        }
    },
    fdataHead: function (a) {
        //        var o = this.dv.find('table:eq(0)').find('input,select').each(function (i) {
        //            $(this).val(a[i]);
        //        });
        var o = this.dv.find('table:eq(0)').find('input,select');
        o.eq(0).val(a[0]);
        o.eq(1).val(a[1]);
        o.eq(2).val(gf.dateFormat(f.dateFormat(a[2]), 'yyyy-MM-dd'));
        o.eq(3).val(f.price(a[3], 2));
        //o.eq(1).attr('_id', a[4]);
    },
    fdataLine: function (a) {
        //        var tr = '', format = '<tr _id={0}><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>';
        //        for (var i = 0, len = a.length; i < len; i++) {
        //            tr += String.format.apply(null, [format].concat(a[i]));
        //        }
        //        this.dv.find('.line tbody').html(tr);
        var tr = '', format = '<tr _id={0}><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>';
        for (var i = 0, l = a.length; i < l; i++) {
            tr += String.format.apply(null, [format].concat(a[i]));
        }
        for (var i = 0, l = 6 - a.length; i < l; i++) {
            a = ['', '', '', '', '', '', '',''];
            tr += String.format.apply(null, [format].concat(a));
        }
        this.dv.find('.line tbody').html(tr);
    },
    getERP: function (id) {
        var om = this;
        pgf.codeData('soHeadDetail', [id], function (a) {
            om.fdataHead(a[0]);
        });
        pgf.codeData('soLineDetail', [id], function (a) {
            om.fdataLine(a);
        });
    },
    getPO: function (id) {
        var om = this;
        gf.getOneLine('up_member_getPoHeadById', [id], function (a) {
            om.fdataHead(a);
        })
        gf.noPagination('up_member_getPoLineByHeadId', [id], function (a) {
            om.fdataLine(a);
        });
    },
    show: function (obj, id) {
        this.ini();
        if (id) {
            if (ur.isFirst()) this.getERP(id);
            else this.getPO(id);
        }
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
    }
}

var mPoView = $.extend({}, mPoUpdate, {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvPoView').find('.icon_close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' });
        } 
    }
})

var mPoPos = $.extend({}, mPos, {
    dv: null,
    categUl: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvPoPos').find('.icon_close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' });

            this.preIni();

            this.dvInfo = this.dv.find('.info').find('.money div:eq(1)').click(function () {
                var o = om.dvInfo.find('.pay').toggle('drop', { direction: "up" }, 500, function () {
                    $(this).attr('display', $(this).attr('display') === "false");
                    if ($(this).attr('display') === "false")
                        om.message('等待付款...');
                    else
                        om.message('等待输入...');
                });

            }).end().find('.btnAdd').click(function () {
                om.submit();
            }).end();

            this.productUl = this.dv.find('ul.product').find('li').live('click', function () {
                om.addDetail($(this));
            }).end();

            this.categUl = this.dv.find('.category ul').find('li').live('click', function () {
                var id = $(this).attr('_id');
                if (om.dv.find('.main .product').hasClass('productChange')) om.mainChange();
                if (ur.isFirst()) {
                    pgf.codeData('product', [id], function (a) { om.fdataProduct(a); });
                } else {
                    gf.noPagination('up_member_getPoProduct', [ur.user().agentId, id], function (a) { om.fdataProduct(a); });
                }
            }).end();

            if (ur.isFirst()) {
                //辅助核算
                this.cmbAnalytic = this.dv.find('.cmbAnalytic').change(function () {
                    var obj = this;
                    om.dv.find('.orderDetail li').each(function () {
                        $(this).find('p:eq(1)').text($(obj).find(':selected').attr('data-discount')||0);
                        om.discountDetail($(this));
                    });
                }).show();
                pgf.codeData('a-analytic', [], function (a) {
                    om.fillAnalytic(a);
                })
            }
        }
    },
    fillAnalytic: function (a) {
        var content = '<option data-discount="{3}" data-id="{0}" value="{0}">{1}</option>', c = [];
        c.push(formatStr(content, ['', '', '', '']));
        for (var i = 0, b = []; b = a[i]; i++) {
            c.push(formatStr(content, b));
        }
        this.cmbAnalytic.html(c.join(''));
    },
    show: function (obj) {
        this.ini();
        var om = this;
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
        if (ur.isFirst()) {
            pgf.codeData('category', [ur.user().erpID], function (a) { om.fdataCategory(a); })
        }
        else {
            gf.noPagination('up_member_getPoCategory', [ur.user().agentId], function (a) { om.fdataCategory(a); });
        }
    },
    //    fdataCategory: function (a) {
    //        var li = '', format = '<li _id={0} title={1}>{1}</li>';
    //        for (var i = 0, l = a.length; i < l; i++) {
    //            li += String.format.apply(null, [format].concat(a[i]));
    //        }
    //        this.categUl.html(li);
    //    },
    //    fdataProduct: function (a) {
    //        var li = '', format = '<li _id={0} _price={2} title={3}><div class=photo><img alt={3} src={0} /></div><div class=label>{1}</div><p class=price><em>{2}/{4}</em></p></li>';
    //        for (var i = 0; i < a.length; i++) {
    //            li += String.format.apply(null, [format].concat(a[i]));
    //        }
    //        this.productUl.html(li);
    //    },
    submit: function () {
        var head = [], lines = [], om = this, uid = ur.user().id;
        head.push(ur.user().erpID || ur.user().agentId);
        //head.push(this.dvInfo.find('.member').attr('_id') || '');
        head.push(this.dvInfo.find('.money label:eq(0)').html() || 0);
        head.push(this.dvInfo.find('.command').html());
        head.push(om.cmbAnalytic?(om.cmbAnalytic.val()||'null'):'null');
        var o = this.detailUl.find('li');
        if (o.size) //mSaleOrder.addSo(head, lines, function () { om.isStart = true; om.message('付款成功！') });
        {
            if (ur.isFirst()) {
                pgf.codeData('createSoHead', head, function (a) {
                    lines = om.getLinesF(o, a);
                    pgf.batchUpdate('createSoLine', lines, function () { om.submitEnd(); })
                })
            }
            else {
                head.push(ur.user().id);
                gf.callProc_with_value('up_member_createPoHead', head, function (a) {
                    lines = om.getLines(o, [a]);
                    gf.callProcBatch('up_member_createPoLine', lines, function () { om.submitEnd(); })
                });
            }
        }
    },
    getLinesF: function (o, a) {
        var line = [], lines = [];
        o.each(function () {
            var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html(),discount = $(this).find('p:eq(1)').html();
            line = [];
            line.push(a[0]);
            line.push(obj.attr('_id'));
            line.push(qty);
            line.push(discount||0);
            line.push(price);
            line.push(ur.user().id);
            lines.push(line)
        });
        return lines;
    },
    getLines: function (o, a) {
        var line = [], lines = [];
        o.each(function () {
            var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            line = [];
            line.push(a[0]);
            line.push(obj.attr('_id'));
            line.push(qty);
            line.push(price);
            line.push(ur.user().id);
            lines.push(line)
        });
        return lines;
    },
    submitEnd: function () {
        this.isStart = true;
        mPurchasOrder.dv.find('.tool .btnSearch').click();
        this.dv.fadeOut();
        this.message('保存成功！');
    }
})

var mSaleOrder = $.extend({}, gPaginationModel, {
    dv: null,
    fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate",
    tbl: 'member.soHead_v',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvSaleOrder');
            this.oTbl = this.dv.find('table').find(':button').live('click', function () {
                var id = $(this).parent().parent().attr('_id');
                if ($(this).hasClass('update')) mSoUpdate.show(this, id);
                else if ($(this).hasClass('view')) mSoView.show(this, id);
                else om.confirmSo(id);
            }).end();

            this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            }).end().find('.btnAdd').click(function () {
                mSoUpdate.show(this);
            });

            gf.noPaginationSqlPara('role<10 and agentID=' + ur.user().agentId, 'ID asc', "id,name", 'member.users', function (a) {
                gOption.foption($('.cmbSaler').eq(0), a, -1, ['', '']);
                gOption.foption($('.cmbSaler').eq(1), a, -1);
            });
            this.ini_after();
        }
    },
    fdata: function (a) {
        var c = [];
        c.push(td(a[1]));
        c.push(td(f.date(a[2])));
        c.push(td(a[3]));
        c.push(td(a[4]));
        c.push(td(f.price(a[5],2)));
        c.push(td(a[6] ? f.date(a[6]) : '<input type=button value=确认 class=confirm />'));
        //        c.push(td(f.date(a[1])));
        //        for (var i = 2; i < 5; i++) {
        //            c.push(td(a[i]));
        //        }
        var b=[['修改','update'],['查看','view']];
        b=(!!a[6])?b[1]:b[0];
        var btn = "<input value="+b[0]+" type=button class="+b[1]+" />";
        c.push(td(btn));
        return tr(c.join(""), '_id="' + a[0] + '"');
    },
    confirmSo: function (id) {
        var om = this;
        gf.callProc('up_member_confirmSo', [id, ur.user().id, ur.user().agentId], function () {
            gtips.showNotice('确认成功！');
            om.dv.find('.tool .btnSearch').click();
        })
    },
    where: function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        aF.push("categoryID = 'r_r'");
        a.push(ur.user().agentId);
        var o = this.dv.find('.search');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    },
    addSo: function (head, lines, success) {
        gf.callProc_with_value('up_member_storeOrderHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            gf.callProcBatch('up_member_storeOrderLine', lines, function () {
                success();
            })
        })
    }
})

var mSoUpdate = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvSoUpdate').find('.icon_close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' });
        }
    },
    fdataHead: function (a) {
        var o = this.dv.find('table:eq(0)').find('input,select');
        o.eq(0).val(a[0]);
        o.eq(1).val(a[1]);
        o.eq(2).val(a[2]);
        o.eq(3).val(a[6]);
        o.eq(4).val(f.price(a[4], 2));
        o.eq(1).attr('_id', a[5]);
    },
    fdataLine: function (a) {
        var tr = '', format = '<tr _id={0}><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>';
        for (var i = 0, l = a.length; i < l; i++) {
            tr += String.format.apply(null, [format].concat(a[i]));
        }
        for (var i = 0, l = 6 - a.length; i < l; i++) {
            a = ['','' ,'' ,'' ,'' ,'','','' ];
            tr += String.format.apply(null, [format].concat(a));
        }
        this.dv.find('.line tbody').html(tr);
    },
    show: function (obj, id) {
        this.ini();
        var om = this;
        if (id) {
            gf.getOneLine('up_member_getStoreOrderHeadById', [id], function (a) {
                om.fdataHead(a);
            })
            gf.noPagination('up_member_getStoreOrderLineByHeadId', [id], function (a) {
                om.fdataLine(a);
            });
        }
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
    }
}

var mSoView = $.extend({}, mSoUpdate, {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvSoView').find('.icon_close').click(function () {
                om.dv.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' });
        }
    }
})

var mStock = $.extend({}, gPaginationModel, {
    dv: null,
    fields: 'id,name,code,category,standPrice,price,qty,uom,description,storepid',
    tbl: "member.storeProduct_v",
    ini: function () {
        if (!this.dv) {
            this.dv = $('#dvStock'), om = this;
            this.oTbl = this.dv.find('table').find(':button').live('click', function () {
                mStockUpdate.show(this, $(this).parent().parent().attr('_id'));
            }).end();

            this.dv.find('.btnSave').click(function () {
                om.modify();
            }).end().find('.tool .btnSearch').click(function () {
                om.search();
            }).end().find('.btnAdd').click(function () {
                mStockUpdate.show(this);
            });

            gf.noPaginationSqlPara('storeID=' + ur.user().agentId, 'ID asc', "id,code+' - '+name", 'member.storeCategory', function (a) {
                gOption.foption($('.cmbCategory').eq(1), a);
                gOption.foption($('.cmbCategory').eq(0), a, -1, ['', '']);
            });
            this.ini_after();
        }
    },
    //show: function () {
    //    var om = this;
    //gf.show(obj, this.dv, { x: 'center', y: 'center' });
    //},
    fdata: function (a) {
        //ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo
        var c = [];
        for (var i = 1; i < 9; i++) {            
            if(i==4|| i==5) c.push(td(f.price(a[i],2)));
            else c.push(td(a[i]));
        }
        c.push(td('<input type=button value=修改 />'));
        return tr(c.join(""), '_id="' + a[9] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        aF.push("categoryID = 'r_r'");
        a.push(ur.user().agentId);
        var o = this.dv.find('.search');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    }
})

var mStockUpdate = {
    dv: null,
    inputs: null,
    ini: function () {
        if (!this.dv) {
            this.dv = $('#dvUpdateStock');
            var om = this, o = this.dv.find('table input,textarea');
            this.inputs = o;

            this.dv.find('.icon_close').click(function () {
                om.close();
            }).end().draggable({ handle: '.header_floatbox'
            }).find('.btnSaveNew').click(function () {
                om.modify();
                om.clear(o);
            }).end().find('.btnSaveClose').click(function () {
                om.modify();
                om.close();
            });
            o.eq(1).keyup(function () {
                o.eq(2).val(aac.makePy($(this).val()));
            });

            var file = this.dv.find(':file').change(aac.cam.getImg);
            this.dv.find('.btnFile').click(function () { file.click(); });
            aac.cam.ini({ canvas: 'c' });
            this.dv.find('.btnCam').click(function () {
                if (aac.cam.status == aac.cam.PLAYING) {
                    aac.cam.parseCam();
                    $(this).html("重新摄取");
                }
                else {
                    aac.cam.startCam();
                    $(this).html("拍照");
                }
            });
        }
    },
    close: function () {
        this.dv.fadeOut();
        aac.cam.stopCam();
    },
    clear: function () {
        this.inputs.eq(0).val(-1);
        for (var i = 1; i < this.inputs.length; i++) {
            this.inputs.eq(i).val('');
        }
    },
    show: function (obj, id) {
        this.ini();
        var om = this;
        if (id) {
            gf.getOneLineSqlPara('storepid=' + id, 'storepid,categoryID,name,code,barcode,qty,uomid,standPrice,price,description,imgUrl', 'member.storeProduct_v', function (a) {
                var j = 0, o = om.dv.find('input:not(:button),select,textarea');
                //                om.dv.find('input,select,textarea').each(function (i) {
                //                    if ($(this).attr('type') != 'file' || $(this).attr('type') != 'button')
                //                    { $(this).val(a[j]); j++ }
                //                });
                o.eq(0).val(a[0]);
                o.eq(1).val(a[1]);
                o.eq(2).val(a[2]);
                o.eq(3).val(a[3]);
                o.eq(4).val(a[4]);
                o.eq(5).val(a[5]);
                o.eq(6).val(a[6]);
                o.eq(8).val(a[7]);
                o.eq(9).val(a[8]);
                o.eq(10).val(a[9]);
                aac.cam.getImg(a[10]);
                gf.show(obj, om.dv, { x: 'center', y: 'center' });
            });
        }
        else {
            this.clear();
            gf.show(obj, this.dv, { x: 'center', y: 'center' });
        }
    },
    modify: function () {
        var a = [], om = this, o = om.dv.find('select,input:not(:button),textarea');
        aac.cam.upload(function (filePath) {
            //alert(filePath);
//            om.dv.find('select,input:not(:button),textarea').each(function () {
//                if ($(this).attr('type') != 'file' || $(this).attr('type') != 'button')
//                    a.push($(this).val());
            //            })
            a.push(o.eq(0).val());//id
            a.push(o.eq(1).val());//categoryid
            a.push(o.eq(2).val());//name
            a.push(o.eq(3).val());//code
            a.push(o.eq(4).val());//barcode
            a.push(o.eq(5).val());//qty
            a.push(o.eq(6).val());//uom
            a.push(o.eq(8).val());//standprice
            a.push(o.eq(9).val());//price
            a.push(o.eq(10).val());//desc

            a.push(ur.user().id);
            a.push(ur.user().agentId);
            a.push(filePath.substring(0, filePath.lastIndexOf("\\") + 1));
            a.push(filePath.substring(filePath.lastIndexOf("\\") + 1))
            gf.callProc_with_value('up_member_updateProduct', a, function (v) {
                if (v < 0)
                    gtips.showNotice("存在相同的产品");
                else {
                    //om.dv.find('input:hidden:not(:button)').val(v); //.OutputTable[0][0]
                    gtips.showNotice("保存成功");
                    mStock.search();
                }
            });
        })
    }
}

var mProductCateg = $.extend({}, gPaginationModel, {
    dv: null,
    fields: 'id,code,name,description',
    tbl: "member.storeCategory",
    ini: function () {
        if (this.dv) return;
        this.dv = $('#dvProductCateg');
        var om = this;
        this.dvUpdate = $('#dvCategoryUpdate').find('.icon_close').click(function () {
            om.dvUpdate.fadeOut();
        }).end().draggable({ handle: '.header_floatbox' }).find('.btnSaveClose').click(function () {
            om.modify();
            om.dvUpdate.fadeOut();
        }).end().find('.btnSaveNew').click(function () {
            om.modify();
            om.clear();
        }).end();
        var t = this.dvUpdate.find('input,textarea')
        this.oTbl = this.dv.find('table').find('tr :button').live('click', function () {
            var a = [], tr = $(this).parent().parent(),
                 tds = tr.find('td');
            a.push(tr.attr('_id'));
            a.push(tds.eq(0).html());
            a.push(tds.eq(1).html());
            a.push(tds.eq(2).html());
            om.updateShow(this, a);
            //alert($(this).attr('_id'));
        }).end();
        var om = this;
        this.dv.find('.btnSave').click(function () {
            om.modify();
        }).end().find('.tool .btnSearch').click(function () {
            om.search();
        }).end().find('.btnAdd').click(function () {
            //om.dv.find('input:hidden').val(-1);
            //om.modify();
            om.updateShow(this);
            // gf.showSimple(this, om.dvUpdate);
        });
        t.eq(1).keyup(function () {
            t.eq(2).val(aac.makePy($(this).val()));
        });
        this.ini_after();
    },
    updateShow: function (obj, a) {
        if (a) {
            var t = this.dvUpdate.find('input,textarea').each(function (i) {
                if (a[i]) $(this).val(a[i]).text(a[i]);
            });
        }
        else
            this.clear();
        gf.showSimple(obj, this.dvUpdate);
    },
    clear: function () {
        var t = this.dvUpdate.find(':input,textarea');
        for (var i = 0, len = t.length; i < len - 2; i++) {
            t.eq(i).val('').text('');
        }
        //t.eq(0).val(-1).text(-1);
    },
    modify: function () {
        var om = this, a = [];
        om.dvUpdate.find('input:not(:button),textarea').each(function () {
            a.push($(this).val() || $(this).text());
        });
        if (!a[1]) return;
        a[0] = a[0] || -1;
        a.push(ur.user().id);
        a.push(ur.user().agentId);
        gf.callProc_with_value('up_member_storeCategory', a, function (v) {
            if (v < 0)
                gtips.showNotice("存在相同的类别");
            else {
                om.dv.find('input:hidden').val(v); //.OutputTable[0][0]
                gtips.showNotice("保存成功");
                om.search();
                om.clear();
            }
        });
    },
    show: function () {
        var om = this;
        gf.showSimple(obj, this.dv);
    },
    fdata: function (a) {
        //ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo
        var c = [];
        c.push(td(a[2])); //
        c.push(td(a[1])); //
        c.push(td(a[3])); //
        c.push(td('<input type=button value=修改 />'));
        return tr(c.join(""), '_id="' + a[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        a.push(ur.user().agentId);
        var o = this.dv.find('.search');
        a.push(o.eq(0).val());
        a.push(o.eq(1).val());
        return f.getWhere_root(aF, a);
    }
})

var mSaleStock = $.extend({}, gPaginationModel, _cmbAddress, {
    id: '',
    agentId: '',
    fields: 'ID,productName,qty,unitPrice,agentName,CREATION_DATE,author',
    tbl: "member.stockDispatch_v",
    dvAction: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvSaleStock');
            this.dvAction = $('#dvGiftDeliveryAction');
            this.cmbAddress = this.dvAction.find('.address select');

            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            });
            this.ini_after();
        }
    },
    fdata: function (a) {
        //ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo
        var c = [];
        c.push(td(a[1])); //姓名
        c.push(td(a[3])); //身份证
        c.push(td(a[4])); //手机
        c.push(td(a[5])); //地址
        c.push(td(a[6])); //礼物
        c.push(td(f.date(a[7]))); //日期
        return tr(c.join(""), '_id="' + a[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push('agentId=r_r');
        this.dv.find('.tool').find('select,:text').each(function () {
            a.push($(this).val());
        });
        return f.getWhere_root(aF, a);
    }
});

var mAgent = $.extend({}, gPaginationModel, _txtChildrenAgent, _cmbAddress, {
    id: '',
    parentId: '',
    tbl: "member.agent_v2",
    dvUpdate: null,
    cmbProvince: null,
    fields: 'ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty,parentID,min(rank) over(),hgift',
    sort: new u_sort("id", 'desc'),
    //ps: 100,    
    btnSave: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAgent');
            this.dvUpdate = $('#dvUpdateAgent').find('.btnAgentSelector').click(function () {
                mAgentSelector.show(this, function (a) {
                    var o = om.dvUpdate.find('table td');
                    om.parentId = a[1];
                    o.eq(0).find('.parentName').text(a[3]);
                    o.eq(1).text(gaRank[a[4] + 1]);
                    om.dvUpdate.find('.parentCode').text(a[2]);
                });
            }).end();
            this.cmbAddress = this.dvUpdate.find('.address select');
            this.iniChilrenAgent();

            this.cmbProvince = this.dv.find('.cmbProvince');
            this.dvUpdate.find('.icon_close').click(function () {
                om.dvUpdate.fadeOut();
            }).end().draggable({ handle: '.header_floatbox' });
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            });

            //等级
            var a = [];
            this.dv.find('.tool').find('.btnAdd').click(function () {
                //显示
                //var o = om.cmbChilrenAgent.find('option:selected');
                var o = om.dvCode.find(':text');
                var parentName = o.attr('coname');
                var parnetId = o.attr('_id');
                var DistrictCode = o.attr('dc');
                om.setDefault(DistrictCode);
                om.show(this, parentName, parnetId, '', Number(o.attr('rank')) + 1, o.val());
            })

            if (ur.user().rank > 0) { // 终端店 和代理商 不能添加下级门店
                this.dv.find('.tool').find('.btnAdd').hide();
            }

            if (ur.user().rank == 0) {
                gf.noPaginationSqlPara('1=1', 'ID asc', 'ID,ProvinceName', 'Province', function (a) {
                    gOption.foption(om.cmbProvince.show(), a, '', ['', '全部']);
                });
            }

            this.dvUpdate.find('.parentCode').next().blur(function () {
                if ($(this).val().length != 3) {
                    $(this).addClass('error').attr('title', '本级编号必须3位').focus(); ;
                }
                else {
                    $(this).removeClass('error').removeAttr('title');
                }
            });

            this.btnSave = this.dvUpdate.find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(om.id);
                a.push(om.parentId);
                a.push(om.cmbAddress.eq(2).val());
                om.dvUpdate.find('.content table td :text:not(.notinc)').each(function () {
                    a.push($(this).val());
                });

                if (a[4].length != 3) return;

                var btn = $(this).val('正在添加');

                a[4] = om.dvUpdate.find('.parentCode').text() + a[4]; // 合并编号

                a.push(om.dvUpdate.find('select:eq(0)').val());
                gf.log(a);
                gf.callProc('up_member_updateAgentWithErp', a, function () {
                    gtips.showNotice('添加完毕!');
                    btn.val('确定保存');
                    om.dvUpdate.fadeOut();
                });
            });


            pgf.codeData('partner', [], function (a) {
                gOption.foption(om.dvUpdate.find('select:eq(0)'), a, ['', '']);
            })

            //this.iniChilrenAgent();
            this.iniAddr();
            this.ini_after();
        }
    },
    show: function (obj, parentName, parentId, id, rank, parentCode) {
        if ($(obj).attr('rank') < 2 && ur.user().role > 1) {
            alert('只有经理才有权限添加和修改代理商信息');
            return 1;
        }

        var om = this;
        var o = this.dvUpdate.find('table td');
        o.eq(4).parent().hide();
        o.eq(0).find('.parentName').text(parentName);
        o.eq(1).text(gaRank[rank]);
        this.dvUpdate.find('.parentCode').text(parentCode);
        gf.show(obj, this.dvUpdate, { x: 'center', y: 'center' });
        this.id = '';
        this.parentId = parentId;
        if (id) { // 修改
            this.id = id;
            this.btnSave.val('确定修改');
            gf.getOneLine('up_member_getAgent2', [this.id], function (a) {
                //parentId,parentName,rank,parentCode,DistrictCode,code,name,mobile,street
                om.parentId = a[0];
                o.eq(0).find('.parentName').text(a[1]);
                o.eq(1).text(gaRank[a[2]]);
                om.dvUpdate.find('.parentCode').text(a[3]);
                if (a[4]) om.setDefault(a[4]);

                om.dvUpdate.find('select:eq(0)').val(a[11]);

                // 去掉父代号
                a[5] = a[5].substr(a[3].length, a[5].length - a[3].length);
                om.dvUpdate.find('.content td :text:not(.notinc)').each(function (i) { $(this).val(a[i + 5]); });

                if (a[0] == 1 && ur.user().agentId == 1) o.eq(4).parent().show();
                else o.eq(4).parent().hide();
                o.eq(4).find('select').val(a[9]);
            });
        } else {
            this.btnSave.val('确定添加');
        }
    },
    search_done: function () {
        var om = this;
        this.oTbl.find('tbody tr').contextMenu('myMenu_agent', {// 右键菜单
            bindings: {
                'menu_agent_edit': function (t) {// 修改
                    om.show(t, '', '', $(t).attr('_id'), $(t).attr('rank'));
                },
                'menu_agent_addChild': function (t) {// 添加下级
                    om.setDefault($(t).attr('DistrictCode'));
                    om.show(this, $(t).find('td:eq(2)').text(), $(t).attr('_id'), '', Number($(t).attr('rank')) + 1, $(t).attr('code'));
                },
                'menu_agent_addManager': function (t) {// 添加经理登录
                    var a = [];
                    a.push(ur.user().id);
                    a.push($(t).attr('_id'));
                    a.push('');
                    a.push('1'); // 经理
                    a.push($(t).attr('DistrictCode'));
                    var num = $(t).attr('code');
                    a.push(num);
                    a.push('123456')
                    a.push('自动添加');
                    a.push('');
                    gf.callProc_with_value('up_member_updateUser', a, function (v) {
                        if (v == 0) {
                            alert('该登录号已经注册，请换一个登录号');
                        } else {
                            alert('添加成功，用户名为' + num + '密码为默认密码');
                        }
                    });
                    //                    mUsers.updateUser(a, function () {
                    //                        alert('添加成功，用户名为' + num + '密码为默认密码');
                    //                    });
                },
                'menu_agent_addStaff': function (t) {// 添加员工登录
                    var a = [];
                    a.push(ur.user().id);
                    a.push($(t).attr('_id'));
                    a.push('');
                    a.push('5'); // 员工
                    a.push($(t).attr('DistrictCode'));
                    var num = $(t).attr('code') + '01';
                    a.push(num);
                    a.push('123456')
                    a.push('自动添加');
                    a.push('');
                    gf.callProc_with_value('up_member_updateUser', a, function (v) {
                        if (v == 0) {
                            alert('该登录号已经注册，请换一个登录号');
                        } else {
                            alert('添加成功，用户名为' + num + '密码为默认密码');
                        }
                    });
                    //                    mUsers.updateUser(a, function () {
                    //                        alert('添加成功，用户名为' + num + '密码为默认密码');
                    //                    });
                },
                'menu_agent_del': function (t) {// 删除
                    if (gCheckDelRight()) {
                        if (confirm('确定要删除该条数据吗')) {
                            gf.callProc('up_member_del', [0, ur.user().id, $(t).attr('_id')], function () {
                                $(t).addClass('del');
                            });
                        }
                    }
                }
            }
        });
        //$(this.oTbl).treeTable({ indent: 15 });
    },
    fdata: function (a) {
        //ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty
        var c = [], format = "_id={0} id={0} districtcode={1} rank={2} code='{3}' class='{4}'";
        c.push(td(a[1])); //门店号
        c.push(td(gaRank[a[2]])); //等级
        c.push(td(a[3] + '[' + a[9] + ']')); //名称
        c.push(td(a[4])); //联系电话
        c.push(td(a[5])); //上级
        c.push(td(f.date(a[6]))); //加入日期
        //c.push(td());
        //c.push(td(a[7])); //会员数
        c.push(td(a[12] ? '是' : '否'));
        if (a[11] == a[2]) a[10] = -1;
        return tr(c.join(""), String.format(format, a[0], a[8], a[2], a[1], (a[10] < 0 ? '' : 'child-of-' + a[10])));
    },
    where: function () {
        var a = [], aF = [];
        //aF.push("parentId=r_r");
        aF.push("code like 'r_r%'");
        aF.push("rank=r_r");
        aF.push("DistrictCode like 'r_r%'");
        aF.push("hgift > r_r");
        a[0] = ur.user().code + this.dvCode.find(':text').val();
        a[1] = this.dv.find('.tool .cmbRank').val();
        a[2] = this.cmbProvince.val();
        a[3] = this.dv.find('.tool .hgift:checked').val();
        return f.getWhere_root(aF, a);
    }
});
var mAgentSta = $.extend({}, mAgentSta, {
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAgentSta');
            this.dv.find('.btnSearch').click(function () {
                om.search(this);
            });
            this.dv.find('.date :text').datepicker({ changeMonth: true, changeYear: true });
            this.dv.find('.date :text:eq(1)').val(gf.getDateAfter(1));
            this.iniChilrenAgent();
            var opt = [];
            for (var i = 0; i < 12; i++) {
                opt.push('<option value="' + (i + 1) + '"> ' + (i + 1) + '月</option>');
            }
            this.dv.find('.month').change(function () {
                var s = new Date().getFullYear() + '-' + $(this).val() + '-1';
                var e = new Date().getFullYear() + '-' + (parseInt($(this).val())+1) + '-1'
                om.dv.find('.date :text').eq(0).val(s).end().eq(1).val(e);
            }).html(opt.join(''));
        }
    },
    search: function (obj) {
        var om = this;
        var a = [], format = "_id={0} id={0} rank={1} class='{2}'";
        var o = this.dv.find(':text');
        a[0] = o.eq(0).attr('_id');
        if (!a[0]) a[0] = ur.user().agentId;
        a[1] = this.getCode();
        a[2] = o.eq(1).val();
        a[3] = o.eq(2).val();
        if (a[2] && a[3]) {
            var btn = $(obj).disable().val('正在统计..');
            gf.noPagination('up_member_staUser3', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(b[0])); //
                    c.push(td(b[1])); //
                    c.push(td(b[2])); //
                    c.push(td(gf.percent(b[1], b[2]))); // 入会比例
                    b[4] = b[5] == b[6] ? -1 : b[4];
                    a[i] = tr(c.join(''), String.format(format, b[3], b[5], (b[4] < 0 ? '' : 'child-of-' + b[4])));
                    c = [];
                }
                om.dv.find('tbody').html(a.join(''));
                om.dv.find('.table1').treeTable({ indent: 19 });
            });
        }
        else {
            alert('请输入日期');
        }
    }
})

mMember.fields = "ID,memberNo,name,'['+isnull(code,'')+']'+companyName,address,mobile,total_point,consumed_point,IdCardNo,DistrictCode,memberDate,gender,role,CREATION_DATE,rank";

var mUsers = $.extend({}, _cmbAddress, _txtChildrenAgent, gPaginationModel, {
    fields: 'ID,memberNo,psw,name,mobile,role,agentId,companyName',
    tbl: "member.users_v",
    crrntAgentId: '',
    id: '',
    dv: null,
    dvUpdate: null,
    role: {
        '0': '系统管理员',
        '1': '总经理',
        '5': '员工'
    },
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvUsers');
            this.oTbl = this.dv.find('table');
            this.dvUpdate = $('#dvUpdateUser');
            this.dvUpdate.find('.content').find('input:button:eq(0)').click(function () {
                btn = this;
                mAgentSelector.show(this, function (a) {
                    $(btn).prev().val(a[3]);
                    om.dvUpdate.find('input:hidden').val(a[1]);
                })
            });
            this.cmbAddress = this.dvUpdate.find('.address select');
            this.dvUpdate.find('.icon_close').click(function () {
                om.dvUpdate.fadeOut();
            }).end().find('.btnSave').click(function () {
                // 更新用户
                var a = [];
                a.push(ur.user().id);
                //a.push(om.crrntAgentId);
                a.push(om.id);
                a.push(om.dvUpdate.find('.cmbRole').val());
                a.push(om.cmbAddress.eq(2).val());
                om.dvUpdate.find(':text,:password,input:hidden').each(function () {
                    a.push($(this).val());
                });
                var btn = $(this).disable().val('正在保存..');
                om.updateUser(a, function () {
                    btn.enable().val('确定保存');
                    alert('保存成功');
                    om.dvUpdate.fadeOut();
                });
            });

            this.dv.find('.btnSearch').click(function () {
                om.search();
            }).end().find('.btnAdd').click(function () {
                var o = om.dvCode.find(':text');
                om.crrntAgentId = o.attr('_id');
                om.dvUpdate.find('.header_floatbox h4 b').text(o.attr('coname'));
                om.setDefault(o.attr('dc'));
                om.show(this);
            });
            this.iniAddr();
            this.iniChilrenAgent();
            this.ini_after();
            this.search();
        }
    },
    updateUser: function (a, callback) {
        gf.callProc_with_value('up_member_updateUser2', a, function (v) {
            if (v == 0) {
                alert('该登录号已经注册，请换一个登录号');
            } else {
                if ($.isFunction(callback)) callback();
            }
        });
    },
    show: function (obj, id) {
        var om = this;
        gf.show(obj, this.dvUpdate, { x: 'center', y: 'center' });
        this.dvUpdate.find('.content input:text:eq(0)').val(ur.user().coName).end().find('.content input:hidden').val(ur.user().agentId);
        this.id = '';
        this.dvUpdate.find('.fleft c').text('添加');
        if (id) {
            this.id = id;
            gf.getOneLineSqlPara('ID=' + id, 'companyName,memberNo,psw,name,role,mobile,agentId,DistrictCode', 'member.users_v', function (a) {
                om.dvUpdate.find('input:hidden,:text,select,:password').each(function (i) {
                    $(this).val(a[i]);
                });
                om.setDefault(a[7]);
            });
            this.dvUpdate.find('.fleft c').text('修改');
        }
    },
    search_done: function () {
        var om = this;
        this.oTbl.find('tbody tr').contextMenu('myMenu_user', {// 右键菜单
            bindings: {
                'menu_user_edit': function (t) {// 修改
                    om.show(t, $(t).attr('_id'));
                },
                'menu_user_del': function (t) {// 删除
                    if (gCheckDelRight()) {
                        if (confirm('确定要删除该条数据吗')) {
                            gf.callProc('up_member_del', [1, ur.user().id, $(t).attr('_id')], function () {
                                $(t).addClass('del');
                            });
                        }
                    }
                }
            }
        });
    },
    fdata: function (b) {
        var c = [];
        c.push(td(b[1])); //memberNo
        c.push(td(b[2])); //psw
        c.push(td(b[3])); //name
        c.push(td(b[4])); //mobile
        c.push(td(this.role[b[5]])); //role
        c.push(td(ur.user().agentId == b[6] ? '我司' : b[7]));
        return tr(c.join(''), '_id="' + b[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push('role<r_r');
        aF.push("code like 'r_r%'");
        aF.push("name like 'r_r%'");
        aF.push('(CREATED_BY=r_r or ID=r_r)');
        var o = this.dv.find('.tool').find(':text');
        a.push('10');
        a.push(ur.user().code + o.eq(0).val());
        a.push(o.eq(2).val());
        a.push(ur.user().role > 1 ? ur.user().id : ''); // 客户专员只能看到他添加的用户
        if (!a[1]) a[1] = ur.user().agentId;
        return f.getWhere_root(aF, a);
    }
});


var mGiftDelivery = $.extend({}, gPaginationModel, _cmbAddress, _txtChildrenAgent, {
    id: '',
    agentId: '',
    fields: 'ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo',
    tbl: "member.giftDelivery_v3",
    dvAction: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvGiftDelivery');
            this.dvAction = $('#dvGiftDeliveryAction');
            this.cmbAddress = this.dvAction.find('.address select');
            //营销活动
            var cmbMarketing = $('.cmbMarketing');
            this.dv.find('.btnDelivery').hide();
            gf.noPagination('up_member_getMarketing2', [ur.user().agentId,1], function (a) {
                gOption.foption(cmbMarketing.eq(0), a);
            })

            gf.noPagination('up_member_getMarketing1', [ur.user().agentId, 1], function (a) {
                gOption.foption(cmbMarketing.eq(1), a);
                if (a.length > 0) {
                    om.dv.find('.btnDelivery').show();
                }
            })

            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            });

            // 获取所有礼品
            gf.noPaginationSqlPara('1=1', 'ID asc', 'ID,GiftName', 'member.gift', function (a) {
                gOption.foption(om.dvAction.find('.cmbGift'), a);
            });

            this.dv.find('.btnDelivery').click(function () {
                om.iniAddr();
                om.lock();
                gf.show(this, om.dvAction, { x: 'center', y: 'center' });
            });

            var txtLock = om.dvAction.find(':text');
            //等级
            //初始化一级经销商

            //this.dv.find('.btnDelivery').hide();
            //            gf.callProc_with_value('up_member_getMarketingStatus', [ur.user().agentId,'C'], function (a) {
            //                if (a == 0 && ur.user().rank >= 2) {
            //                    om.dv.find('.btnDelivery').show();
            //                }
            //            })


            this.dvAction.find('.icon_close').click(function () {
                om.dvAction.fadeOut();
            }).end().find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(ur.user().agentId)
                var cmbs = om.dvAction.find('.content table select');
                a.push(cmbs.eq(0).val());
                a.push(cmbs.eq(3).val());
                a.push(cmbs.eq(4).val());
                om.dvAction.find('.content table td :text').each(function () {
                    a.push($(this).val());
                });
                var btn = $(this).val('正在派送..');
                if (!a[8]) {
                    alert('身份证未检测出，请手工输入生日，身份证格式如下：1970-01-01！');
                    return;
                }
                gf.callProc('up_member_deliveryGiftWithMarketing', a, function () {
                    gtips.showNotice('派送完毕!');
                    btn.val('确定派送');
                    om.dvAction.find('.content table :text').val('');
                    om.lock();
                });
            }).end().find('.btnCheck').click(function () { //审核身份证
                var btn = $(this).disable().val('审核中..');
                var cardno = om.dvAction.find('.txtId').val();
                om.dvAction.find('.tips').hide();
                if (cardno) cardno = $.trim(cardno);
                var info = checkIdCard(cardno);
                if (info) {// 身份证验证成功
                    if (info.gender == 'f') {
                        // 继续检查有没有重复领取
                        gf.noPagination('up_member_checkIdCardWithMarketing', [cardno, om.dvAction.find('.cmbMarketing').val()], function (a) {
                            a = a[0];
                            btn.enable().val('审核身份证');
                            if ($.isArray(a) && a[4] > 0) {
                                a[0] = f.date(a[0])
                                om.dvAction.find('.tips').show().find('td b').each(function (i) { $(this).html(a[i]); });
                                if (!om.dvAction.find('.txtBirthday').val()) {
                                    var birthday = info.birthday;
                                    om.dvAction.find('.txtBirthday').val(birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2));
                                }
                            } else {//GiftName,Donation,g.CREATION_DATE,a.name
                                om.unlock();
                                om.setDefault(cardno.substr(0, 6));
                                var birthday = info.birthday;
                                om.dvAction.find('.txtBirthday').val(birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2));

                                txtLock.eq(1).val(a[0]);
                                txtLock.eq(2).val(a[1]);
                                txtLock.eq(4).val(a[2]);
                            }
                        });
                    } else {
                        alert('该身份证是男士的，目前礼品只派送给女士');
                        btn.enable().val('审核身份证');
                    }
                } else {
                    alert('身份证号码有误请重新输入');
                    btn.enable().val('审核身份证');
                }
            });

            this.iniChilrenAgent();
            this.ini_after();
        }
    },
    lock: function () {
        this.dvAction.find('[lock]').disable();
    },
    unlock: function () {
        this.dvAction.find('[lock]').enable();
    },
    fdata: function (a) {
        //ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo
        var c = [];
        c.push(td(a[1])); //姓名
        //c.push(td(a[3])); //身份证
        c.push(td(a[3].substr(0, a[3].length - 4) + '****'));
        c.push(td(a[4])); //手机
        c.push(td(a[5])); //地址
        c.push(td(a[6])); //礼物
        c.push(td(f.date(a[7]))); //日期
        return tr(c.join(""), '_id="' + a[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push("code like 'r_r%'");
        aF.push("IdCardNo like 'r_r%'");
        aF.push("marketingId = r_r");
        this.dv.find('.tool').find(':text,select').each(function () {
            a.push($(this).val());
        });
        a[0] = ur.user().code + a[0];
        return f.getWhere_root(aF, a);
    }
});

