﻿/// <reference path="jquery-1.8.0.js" />
/// <reference path="base.js" />
/// <reference path="agent.base.js" />
/// <reference path="common/capture.js" /
/// <reference path="common/makePy.js" />
var marketingType = { gitfDelivery: 1 };
agent.pos = (function () {
    var o = $.extend({}, gobj, { ids: [], dvId: 'dvPOS' });
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.tbl = o.dv.find('.report-results>table');
            o.member = o.dv.find('#q_pos_member');
            o.product = o.dv.find('#q_pos_product');
            o.member.next().click(function () { pressEnter(o.member); });
            o.product.next().click(function () { pressEnter(o.product); });
            o.dv.find('.btnDiscount').click(function () { discount.show(); });
            o.dv.find('.btnPay').click(function () { payable.show(); });
            $(window).keydown(function (e) {
                if (o.dv.css('display') == 'block') {
                    switch (e.keyCode) {
                        case 112: //F1
                            return false;
                            break;
                        case 113: //F2
                            o.member.focus();
                            return false;
                            break;
                        case 114: //F3
                            return false;
                            break;
                        case 115: //F4
                            o.product.focus();
                            return false;
                            break;
                        case 116: //F5
                            if (payable.isShown()) {
                                payable.pConfirm();
                            }
                            return false;
                            break;
                        case 117: //F6
                            return false;
                            break;
                        case 118: //F7
                            discount.show();
                            return false;
                            break;
                        case 119: //F8
                            payable.show();
                            return false;
                            break;
                        case 13: //enter
                            pressEnter(e.srcElement);
                            return false;
                            break;
                    }
                }

            });
        }
    };

    o.searchProduct = function () {

    };
    var selectedMeber = function (m) {
        var inputs = o.dv.find('.well input');
        inputs.eq(0).val(m.code).attr('data-id', m.id);
        inputs.eq(1).val(m.name);
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.dv.find('input').val('').attr('data-id', '');
        o.total = 0;
        o.dv.find('.dvTotal d').text('');
        o.searchend(0);
    }
    pressEnter = function (src) {
        if ($(src).is(o.member)) {
            agent.memberLov.show(selectedMeber, o.member.val());
        }
        else if ($(src).is(o.product)) {
            if (o.product.val()) {
                agent.productLov.show(selectedProduct, o.product.val());
            }
            else {
                agent.productLovMutil.show(selectedProduct, 'm', o.partner.attr('data-aid'));
            }
        }
        else if (src.tagName.toLowerCase() == 'td') {
            compute($(src).parents('tr'), src);
            var idx = $(src).index();
            $(src).parents('tr').next().find('td').eq(idx).focus();
        }
        else if ($(src).is(discount.di)) {
            discount.pressOk();
        }
    },
    compute = function (tr, obj, q) {
        var tds = tr.find('td');
        if (tds.eq(6).is(obj)) {//修改过单价，则需要重新计算折扣
            tds.eq(5).text(f.price(parseFloat(tds.eq(6).text()) / parseFloat(tr.attr('data-price')) * 100, 2));
        }
        else if (tds.eq(5).is(obj)) {
            tds.eq(6).text(f.price(parseFloat(tds.eq(5).text()) * parseFloat(tr.attr('data-price')) / 100, 2));
        }
        var num = parseInt(tds.eq(3).text()) + (q || 0),
            price = f.price(tds.eq(6).text(), 2),
            discount = f.price(tds.eq(5).text(), 2);
        tds.eq(7).text(f.price(num * price, 2));
        tds.eq(3).text(num);
        total();
    },
    total = function (discount) {
        var qty = 0, amount = 0, ya = 0,
        l = o.tbl.find('tbody tr').each(function (i) {
            var tds = $(this).find('td'), q = parseInt(tds.eq(3).text()),
                yp = parseFloat($(this).attr('data-price')),
                p = 0;
            if (discount != null) {
                tds.eq(5).text(discount);
                p = yp * discount / 100;
                tds.eq(6).text(p);
                tds.eq(7).text(f.price(q * p, 2));
            }
            else {
                p = parseFloat(tds.eq(6).text())
            }
            qty += q;
            amount += p * q;
            ya += yp * q;
            tds.eq(0).text(i + 1);
        }).size();
        var d = o.dv.find('.dvTotal d');
        d.eq(0).text(f.price(amount, 2));
        d.eq(1).text(f.price(qty, 2));
        d.eq(2).text(f.price(ya, 2));
        o.total = amount;
        o.searchend(l);
    },
    selectedProduct = function (p) {
        var format = '<tr data-prod-id="{0}" data-price="{8}"><td>{1}</td><td>{2}</td><td>{3}</td><td contenteditable="true">{4}</td><td>{5}</td>' +
                                        '<td contenteditable="true">{6}</td><td contenteditable="true">{7}</td><td>{8}</td><td></td></tr>';
        var c = [];
        if ($.isArray(p)) {
            for (var i = 0, p1; p1 = p[i]; i++) {
                if ($.inArray(p1[0], o.ids) >= 0) {
                    var tr = o.tbl.find('tbody').find('tr[data-id=' + p1[0] + ']');
                    compute(tr, null, 1);
                }
                else {
                    o.ids.push(p1[0]);
                    var b = [p1[0], i + 1, p1[4], p1[1], 1, p1[2] + '/' + p1[3], 100, p1[2], p1[2]];
                    c.push(formatStr(format, b));
                }
            }
        }
        else {
            var b = [p.id, 1, p.barcode || '', p.name, 1, p.price + '/' + p.uom, 0, p.price, p.price];
            c.push(formatStr(format, b));
            o.ids.push(p1[0]);
        }
        o.tbl.find('tbody').prepend(c.join(''));
        o.product.val('').focus();
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoLine', lines, function () {
                    success();
                })
            }
        })
    },
    commitSo = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(0); //orderid
        head.push(uid); //saleId        
        head.push(o.member.attr('data-id') || ''); //memberId
        var d = new Date();
        head.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
        head.push(o.total);
        head.push('');
        head.push('confirm');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0);
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id); //lineId
                line.push(obj.attr('data-prod-id')); //prodId
                line.push(tds.eq(3).text()); //qty                
                line.push(obj.attr('data-price')); //price
                line.push(100 - parseFloat(tds.eq(5).text() || 0)); //discount
                line.push(''); //comment
                line.push(uid);
                if (tds.eq(3).text() >= 0)
                    lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    discount = {
        ini: function () {
            var o1 = this;
            if (!o1.dv) {
                o1.dv = $('#dvDiscount');
                o1.di = o1.dv.find('#q_discount_d');
                o1.dv.find('.btn-success').click(function () {
                    this.pressOk();
                });
            }
        },
        pressOk: function () {
            var d = this.di.val();
            total(d.length == 0 ? 100 : d);
            this.show();
        },
        show: function () {
            var o1 = this;
            o1.ini();
            o1.dv.modal('toggle');
            o1.dv.on({ 'shown': function () {
                o1.di.focus();
            }, 'hidden': function () {
                o.product.focus();
            }
            });
        }
    },
    payable = {
        ini: function () {
            var o1 = this;
            if (!o1.dv) {
                o1.dv = $('#dvPay');
                o1.inputs = o1.dv.find('input[type=number]').keyup(function () {
                    var np = parseFloat(o1.inputs.eq(0).val()), yf = 0, len = o1.inputs.length;
                    for (var i = 1, b; i < len - 1; i++) {
                        b = o1.inputs.eq(i);
                        yf += parseFloat(b.val() || 0)
                    }
                    o1.inputs.eq(len - 1).val(f.price(yf - np, 2)); //计算找零
                });
                o1.dv.find('.btn-success').click(function () {
                    o1.pConfirm();
                    //o1.show();
                });
            }
        },
        isShown: function () {
            var o1 = this;
            o1.ini();
            return o1.dv.css('display') == 'block';
        },
        show: function () {
            var o1 = this;
            o1.ini();
            if (o1.dv.css('display') == 'block') {
                o1.dv.modal('hide');
                o1.dv.on('hidden', function () {
                    o.product.focus();
                })
            }
            else {
                if (o.tbl.find('tbody tr').size() > 0) {
                    o1.dv.modal();
                    o1.dv.on('shown', function () {
                        o1.inputs.eq(4).focus();
                    })
                    o1.inputs.eq(0).val(f.price(o.total, 2));
                    o1.inputs.eq(5).val('-' + f.price(o.total, 2));
                }
            }
        },
        pConfirm: function () {
            var o1 = this;
            if (o1.inputs.eq(o1.inputs.length - 1).val() >= 0) {
                if (confirm("确认提交")) {
                    commitSo(function () { o1.dv.modal('hide'); clear(); });
                }
            }
            else {
                alert('金额不足！');
            }
        }
    };
    base.iniFunc[o.dvId] = { fun: ini };
    //base.iniFun.push(ini);
    return o;
})();

var fillbirth = function (o) {
    o.birth = o.dv.find('.birthday select');
    var year = new Date().getFullYear(), y = [];
    for (var i = year; i > year - 100; i--) {
        y.push('<option value=' + i + '>' + i + '年</option>');
    }
    o.birth.eq(0).html(y.join(''));
    y = [];
    for (var i = 12; i > 0; i--) {
        y.push('<option value=' + i + '>' + i + '月</option>');
    }
    o.birth.eq(1).html(y.join(''));
    y = [];
    for (var i = 31; i > 0; i--) {
        y.push('<option value=' + i + '>' + i + '日</option>');
    }
    o.birth.eq(2).html(y.join(''));
    return o;
}

agent.memberReg = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null, dvId: 'dvRegMember',
        dvRegister: null,
        txtKey: null,
        pass: false
    },
    iniNum = function () {
        function chk(obj) {
            var reg = /^[1-3]\d{7}/; // 1，2开头且为8位数字
            //var reg = /^[3]\d{7}/;
            //var reg = /^[2]\d{7}/; // 1，2开头且为8位数字
            //if (reg.test($(obj).val())) {
            var ov = $(obj).val();
            if (ov.indexOf(o.prefix) === 0 && ov.length == o.length) {
                $(obj).next().hide();
                $(obj).removeClass('error');
                o.idNum.focus();
            } else {
                $(obj).next().show().text(o.errorInfo);
                $(obj).addClass('error');
            }
        };
        o.dv.find('.txtNo').blur(function () {
            chk(this);
        }).enterpress(function () {
            chk(this);
        });
    },
    checkNull = function (obj) {
        if (!$(obj).val()) {
            $(obj).addClass('error');
            return false;
        }
        else {
            $(obj).removeClass('error');
            return true;
        }
    },
    checkOk = function () {
        o.idNum.removeClass('error');
        o.idNum.next().next().hide();
        o.idNum.next().next().hide();
        o.dv.find('.wcheck').enable();
        o.dv.find('#q_r_name').focus().enterpress(function () {
            if (checkNull(this)) {
                o.dv.find('#q_r_mobile').focus().enterpress(function () {
                    if (checkNull(this)) o.dv.find('.btn-primary').focus();
                }).blur(function () {
                    checkNull(this);
                });
            }
        }).blur(function () {
            checkNull(this);
        });
    },
    checkFail = function (txt) {
        o.idNum.addClass('error');
        o.idNum.next().next().show().text(txt);
        o.dv.find('.wcheck').disable();
    },
    remoteCheck = function (cardno) {
        var btn = o.idNum.next();
        gf.getOneLine('up_member_checkIdCardForRegister1', [cardno], function (a) {
            btn.enable().val('验证');
            if (a.length > 1) {
                //ID,role,memberNo,name,mobile,CREATION_DATE,agentId,companyName,DistrictCode
                if (a[1] == '10') {
                    if (confirm('该用户在门店' + a[7] + ' 于' + f.date(a[5]) + ' 由于领取礼品已经登记了信息,是否要注册成会员?')) {
                        // 获取更详细信息
                        o.dv.find('#q_r_name').val(a[3]); //姓名
                        o.dv.find('#q_r.mobile').val(a[4]);
                        o.setDefault(a[8]);
                        checkOk();
                    } else {
                        checkFail('');
                    }
                } else if (a[1] == '11') {
                    checkFail(a[3] + '的身份证已经注册了会员，会员号为' + a[2] + ',一张身份证不能重复注册');
                }
            }
            else {
                checkOk();
            }
        }, 1, function () {
            alert('注册会员发生异常，请与管理员联系QQ:343181024');
        });
    },
    checkId = function () {
        var idNum = o.idNum.val(),
            info = checkIdCard(idNum);

        if (o.memberNo.hasClass('error')) {//需要校验是否有会员号
            return;
        }
        if (info) {
            var birthday = info.birthday;
            o.setDefault(idNum.substr(0, 6))
            o.birth.eq(0).val(birthday.substr(0, 4));
            o.birth.eq(1).val(Number(birthday.substr(4, 2)));
            o.birth.eq(2).val(Number(birthday.substr(6, 2)));
            o.dv.find('[name=sex][value=' + info.gender + ']').click();

            remoteCheck(idNum);
        }
        else {
            checkFail('身份证号有误');
        }
    },
    regedit = function (obj) {
        if (o.dv.find('table :text.error').length > 0) {
            alert('输入有误，不能注册，请仔细检查');
            return 1;
        }
        var a = [];
        a.push(ur.user().id);
        a.push(ur.user().agentId);
        a.push('123456'); // 默认密码
        a.push(o.type.val());//类型
        a.push(o.cmbAddress.eq(2).val()); //地址
        if (ur.user().agentId < 1 || !ur.user().agentId) {
            alert('等录异常，请重新登录');
            return 1;
        }

        var ab = [];
        o.dv.find('.birthday select').each(function () { ab.push($(this).val()); });
        a.push(ab.join('-')); //生日
        a.push(o.dv.find(':radio:checked').val()); //性别
        var btn = $(obj).disable().val('正在注册..');
        o.dv.find(':text').each(function () { a.push($(this).val().trim()); });

        gf.callProc_with_value('up_member_register2', a, function (v) {
            btn.enable().val('确定注册');
            if (v == 0) {
                alert('该会员号已经注册，不能重复注册');
            } else if (v == 1) {
                alert('注册成功');
                o.dv.find(':text').val('');
                o.dv.find('.wcheck').disable();
                o.idNum.focus();
            }
            else {
                alert('注册失败！');
            }
        }, function () {
            alert('注册失败！');
        });
    },
    selectedType = function (t) {
        t.next().html(t.find(':selected').attr('data-desc'));
        o.prefix = t.find(':selected').attr('data-pre');
        o.length = t.find(':selected').attr('data-length');
        o.errorInfo = t.find(':selected').attr('data-error');
        o.memberNo = o.dv.find('#q_r_member').focus();
    },
    getType = function () {
        gf.noPagination('up_member_getMemberActivityForReg', [1], function (a) {
            var opt = '<option data-id="{0}" value="{0}" data-error="{3}" data-desc="{4}" data-pre="{5}" data-length="{6}">{2}</option>';
            for (var i = 0, b = [], c = []; b = a[i]; i++) {
                c.push(formatStr(opt, b));
            }
            o.type = o.dv.find('#q_r_type').html(c.join('')).change(function () {
                selectedType($(this));
            });
            selectedType(o.type);
        })
    },
    ini = function () {
        if (!o.dv) {
            o.dv = $('#dvRegMember');
            o=fillbirth(o);
            o.cmbAddress = o.dv.find('.address select');
            o.iniAddr();
            iniNum();
            getType();
            o.idNum = o.dv.find('#q_r_idcard').enterpress(function () {
                checkId();
            }).next().click(function () {
                checkId();
            }).end();
            o.dv.find('.btn-primary').click(function () {
                regedit(this);
            });
        }
    }
    );
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.giftDelivery = (function () {
    var o = $.extend({}, _cmbAddress, { dv: null,
        dvRegister: null,
        txtKey: null,
        pass: false,
        dvId: 'dvGiftDelivery'
    }),timer=null,maxTime=2*60,
    checkId = function (btn) {
        btn.disable().text('审核中..');
        var cardno = o.dv.find('#q_gd_idcard').val();
        o.dv.find('.tips').hide();
        if (cardno) cardno = $.trim(cardno);
        var info = checkIdCard(cardno);
        if (info) {// 身份证验证成功
            if (info.gender == 'f') {
                // 继续检查有没有重复领取
                gf.noPagination('up_member_checkIdCardWithMarketing', [cardno, o.dv.find('.cmbMarketing').val()], function (a) {
                    a = a[0];
                    btn.enable().text('检查');
                    if ($.isArray(a) && a[4] > 0) {
                        a[0] = f.date(a[0]);
                        o.dv.find('.tips').show().find('b').each(function (i) { $(this).html(a[i]); });

                        var birthday = info.birthday;
                        o.setDefault(cardno.substr(0, 6));
                        o.birth.eq(0).val(birthday.substr(0, 4));
                        o.birth.eq(1).val(Number(birthday.substr(4, 2)));
                        o.birth.eq(2).val(Number(birthday.substr(6, 2)));
                        //if (!o.dv.find('.txtBirthday').val()) {
                        //    var birthday = info.birthday;
                        //    o.dvAdvction.find('.txtBirthday').val(birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2));
                        //}
                    } else {//GiftName,Donation,g.CREATION_DATE,a.name
                        //o.unlock();
                        o.setDefault(cardno.substr(0, 6));
                        var birthday = info.birthday;
                        a = a || [];
                        o.dv.find('#q_gd_mobile').val(a[1] || '').enable().end().find('#q_gd_name').val(a[0] || '').focus().enable();
                        //txtLock.eq(1).val(a[0]);
                        //txtLock.eq(2).val(a[1]);
                        //txtLock.eq(4).val(a[2]);
                        o.dv.find('.btn-primary').enable();

                        o.birth.eq(0).val(birthday.substr(0, 4));
                        o.birth.eq(1).val(Number(birthday.substr(4, 2)));
                        o.birth.eq(2).val(Number(birthday.substr(6, 2)));
                        //o.dv.find('.txtBirthday').val(birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2));
                    }
                });
            } else {
                alert('该身份证是男士的，目前礼品只派送给女士');
                btn.enable().text('检查');
            }
        } else {
            alert('身份证号码有误请重新输入');
            btn.enable().text('检查');
        }
    },
    lock = function () {
        o.dv.find('#q_gd_name').disable().end().find('#q_gd_mobile').disable();
        o.dv.find('.btn-primary').disable();
    },
    submit = function (btn) {
        var a = [];
        a.push(ur.user().id);
        a.push(ur.user().agentId)
        var cmbs = o.dv.find('select');
        a.push(cmbs.eq(0).val()); //marketing
        a.push(cmbs.eq(6).val()); //DistrictCode
        a.push(cmbs.eq(7).val()); //gift
        a.push($.trim(o.dv.find('#q_gd_idcard').val()));
        a.push($.trim(o.dv.find('#q_gd_name').val()));
        a.push($.trim(o.dv.find('#q_gd_mobile').val()));
        if (!a[5] || !a[6] || !a[7]) {
            alert('身份证，姓名，电话不能留空！');
            return;
        }
        a.push(cmbs.eq(1).val() + '-' + cmbs.eq(2).val() + '-' + cmbs.eq(3).val());
        a.push('');
        a.push(o.dv.find('#q_gd_donation').val());
        //o.dv.find('.content table td :text').each(function () {
        //    a.push($(this).val());
        //});
        btn.text('正在派送..');

        gf.noPagination('up_member_deliveryGiftWithMarketing', a, function () {
            btn.text('确定派送');
            o.dv.find(':text,number').val('');
            lock();
            gtips.showNotice('派送完毕!');
            o.dv.find('#q_gd_idcard').disable();
            timer = setInterval("agent.giftDelivery.countDown()",1000);
            maxTime=60*o.marketing['m'+o.dv.find('#q_gd_type').val()]
        });
    }
    ini = function () {
        if (!o.dv) {
            o.dv = $('#' + o.dvId);
            iniMarketing();

            o = fillbirth(o);
            o.cmbAddress = o.dv.find('.address select');
            o.iniAddr();

            o.dv.find('.check').click(function () {
                checkId($(this));
            });
            o.dv.find('#q_gd_idcard').enterpress(function () {
                checkId($(this));
            });

            o.dv.find('.btn-primary').click(function () {
                submit($(this));
            });

            gf.noPaginationSqlPara('1=1', 'ID asc', 'ID,GiftName', 'member.gift', function (a) {
                gOption.foption(o.dv.find('#q_gd_product'), a);
            });
            btn=o.dv.find('.btn-primary');
        }
    },
    iniMarketing = function () {
        var cmbMarketing = o.dv.find('#q_gd_type');
        o.dv.find('#q_gd_idcard').disable();
        gf.noPagination('up_member_getMarketing3', [ur.user().agentId, marketingType.gitfDelivery], function (a) {
            gOption.foption(cmbMarketing, a);
            o.marketing={};
            for(var i=0;i<a.length;i++)
            {
            	o.marketing['m'+a[i][0]]=a[i][2];
            	}
            if (a.length > 0) {
                o.dv.find('#q_gd_idcard').enable();
            }
        })
    };
    var btn=null;
    o.countDown=function(){       	
			if(maxTime>=0){   
				minutes = Math.floor(maxTime/60);   
				seconds = Math.floor(maxTime%60);   
				msg = "还有"+minutes+"分"+seconds+"秒开始...";   
				btn.text(msg);   
				--maxTime;   
			}   
			else{   
				clearInterval(timer);  
				o.dv.find('#q_gd_idcard').enable();
				btn.text("确定派送");
			}   
		}   
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.poExchange = (function () {
    var o = $.extend({}, gobj, gpagination, {
        ttbl: 'member.poExchangeHead_v',
        fields: "id,orderNumber,orderDate,member,saler,amount,saleConfirmDate,aname,note,status,rname",
        dvId: 'dvPoExchange'
    }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dvSp.find('[name=add]').click(function () {
                agent.poExchangeUpd.show();
            });

            gf.noPagination('up_member_getReturnReasonForCmb', [ur.user().agentId], function (a) {
                var b = [];
                for (var i = 0, c = []; c = a[i]; i++) {
                    if (c[3]) {
                        b.push(c);
                    }
                }
                gOption.foption($('.cmbReturnReason').eq(3), b);
                gOption.foption($('.cmbReturnReason').eq(2), a, -1, ['', '']);
            });

            o.tbl.find('tbody tr a').live('click', function () {
                agent.poExchangeUpd.show($(this).parents('tr').attr('data-id'));
            });
        }
    },
    updateStatus = function (id, status) {
        gf.callProc_with_value('up_agent_updateSoStatus', [id, status, ur.user().id], function () {
            o.search();
        })
    },
    dropdownClick = function (obj) {
        var id = $(obj).parents('tr').attr('data-id');
        switch ($(obj).attr('for')) {
            case 'ddprint':
                o.printSo(id);
                break;
            case 'ddview':
                agent.soExchangeUpd.show(id, 'view');
                break;
            case 'ddedit':
                agent.soExchangeUpd.show(id, 'edit');
                break;
            case 'ddconfirm':
                updateStatus(id, 'confirm');
                break;
            case 'ddcancel':
                updateStatus(id, 'cancel');
                break;
        }
    };
    o.ended = function () {
        o.tbl.find('.dropdown-menu li:has(a)').click(function () {
            dropdownClick($(this));
        });
    };
    o.printSo = function (id) {
        var doc = $(frames['ptsoExchange'].document).find('div');
        doc.find('table:visible').remove();
        var tbl = doc.find('table').clone();
        tbl.show().appendTo(doc);
        var trs = tbl.find('tbody tr'),
            title = trs.eq(0),
            header = trs.eq(1), date = trs.eq(2), customer = trs.eq(3),
            comment = trs.eq(4), linein = trs.eq(7), lineout = trs.eq(10), xjin = trs.eq(8),
            xjout = trs.eq(11), hj = trs.eq(12), dx = trs.eq(13), a = o.data[id];

        title.find('td').text(ur.user().coName);
        date.find('td c').eq(1).text(f.date(a[2])).end().eq(0).text(a[1]);
        customer.find('td c').eq(0).text(a[3]).end().eq(1).text(a[7]);
        comment.find('td c').text(a[8]), tqty = 0, tqtyin = 0, tqtyout = 0, tamount = 0, tamountin = 0, tamountout = 0, tdis = 0;

        gf.noPagination('up_member_getSoLine', [id], function (a) {
            var tds = [], ain = [], aout = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                if (b[4] < 0) {
                    ain.push(b);
                }
                else {
                    aout.push(b);
                }
            }
            for (var i = 0, b = []; b = ain[i]; i++) {
                if (i == 0) {
                    tds = linein.find('td');
                }
                else {
                    var cl = linein.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4] * -1); //qty
                tqtyin += b[4] * -1;
                tds.eq(6).text(f.price(b[2] * b[4] * -1, 2)); //amount
                tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (b[5] - 100) / 100, 2)); //折后
                tamountin += b[2] * b[4] * (b[5] - 100) / 100;
            }
            for (var i = 0, b = []; b = aout[i]; i++) {
                if (i == 0) {
                    tds = lineout.find('td');
                }
                else {
                    var cl = lineout.clone();
                    cl.insertBefore(xj);
                    tds = cl.find('td');
                    tds.eq(0).text(i + 1);
                }
                tds.eq(1).text(b[9]); //code
                tds.eq(2).text(b[1]); //name
                tds.eq(3).text(b[3]); //uom
                tds.eq(4).text(f.price(b[2], 2)); //price
                tds.eq(5).text(b[4]); //qty
                tqtyout += b[4];
                tds.eq(6).text(f.price(b[2] * b[4], 2)); //amount
                tds.eq(7).text(f.price(b[2] * b[4] * (b[5]) / 100, 2)); //折扣
                tdis += b[2] * b[4] * (b[5]) / 100;
                tds.eq(8).text(f.price(b[2] * b[4] * (100 - b[5]) / 100, 2)); //折后
                tamountout += b[2] * b[4] * (100 - b[5]) / 100;
            }
            tamount = tamountout - tamountin;
            xjin.find('td').eq(1).text(tqtyin).end().eq(3).text(f.price(tamountin, 2));
            xjout.find('td').eq(1).text(tqtyout).end().eq(3).text(f.price(tamountout, 2));
            hj.find('td c').eq(0).text(tqtyin + tqtyout).end().eq(1).text(f.price(tamount, 2)).end().eq(2).text(f.price(tdis, 2));
            dx.find('td c').text(f.chineseNumber(tamount));
            frames['ptsoExchange'].print();
        });
    };
    o.where = function () {
        var a = [], aF = [];
        aF.push('storeID=r_r');
        aF.push("orderNumber like '%r_r%'");
        aF.push("orderDate>= 'r_r'");
        aF.push("orderDate<= 'r_r'");
        aF.push("status = 'r_r'");

        a.push(ur.user().agentId);
        var inputs = o.dvSp.find('input,select');
        a.push(inputs.eq(1).val());
        a.push(inputs.eq(2).val());
        a.push(inputs.eq(3).val());
        a.push(inputs.eq(4).val());
        return f.getWhere_root(aF, a);
    };
    o.fdata = function (a) {
        var c = [];
        c.push(dom.td(dom.a(a[1], '#')));
        c.push(dom.td(f.date(a[2])));
        c.push(dom.td(a[7] + '[' + a[3] + ']'));
        c.push(dom.td(a[4]));
        c.push(dom.td('<label class=number style="width:50%">' + f.price(a[5], 2) + '</label>'));
        c.push(dom.td(a[10]));
        var stat = '', stat2 = '', stat3 = '';
        if (a[9] == 'cancel') {
            stat = '已取消'
        }
        else {
            stat = a[6] && f.date(a[6]);
            if (a[9] == 'draft' || a[9] == '') {
                stat = '草稿';
                stat3 = '  <li class="" for="ddconfirm"><a href="#"><i class="icon-ok-sign"></i>确认</a></li>' +
              '  <li class="" for="ddcancel"><a href="#"><i class="icon-remove-circle"></i>取消</a></li>';
                stat2 = '  <li class="" for="ddedit"><a href="#"><i class="icon-pencil"></i>修改</a></li>';
            }
        }
        c.push(dom.td(stat));
        var b = [['修改', 'update'], ['查看', 'view']];
        b = (!!a[6]) ? b[1] : b[0];

        var dd = '<td class="dropdown navbar">' +
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">操作<b class="caret"></b></a>' +
              ' <ul class="dropdown-menu">' +
              '  <li class="" for="ddview"><a href="#"><i class="icon-file"></i>查看</a></li>' + stat2 +
              '  <li for="ddprint"><a href="#"><i class="icon-print"></i>打印</a></li>' +
              '  <li class="divider"></li> ' + stat3 +
              '</ul></td>';
        c.push(dd);
        o.data[a[0]] = a;
        //var btn = "<input value=" + b[0] + " type=button class=" + b[1] + " />";
        //c.push(dom.td(btn));

        return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
    };
    o.updateStatus = updateStatus;
    //base.iniFun.push(ini);
    base.iniFunc[o.dvId] = { fun: ini };
    return o;
})()

agent.poExchangeUpd = (function () {
    var o = $.extend({}, gobj,base.poUpd, { dvId: 'dvPoExchangeUpd', inputs: [], status: { cancel: '取消', confirm: '已确认', draft: '草稿'} }),
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').eq(1).click(function () {
                agent.productLovMutil.show(selectedProduct, 'ag', o.partner.attr('data-aid'));
                o.dv.modal('hide');
            }).end().eq(0).click(function () {
                agent.soProductQuery.show(selectedProductR,ur.user().id, o.partner.attr('data-id'));
            });
            o.dv.find('button[name=clear]').click(function () {
                clear();
            });
            o.partner = o.dv.find('#q_po_ec_partner').next().click(function () {
                agent.partnerMemberLov.show(fillPartner, o.partner.val(), 'customer');
                //agent.partnerLov.show(fillPartner, 'customer');
            }).end().blur(function () {
                $(this).val($(this).attr('data-code') || '' + ' ' + ($(this).attr('data-name') || ''));
            }).focus(function () {
                $(this).val($(this).attr('data-code') || '');
            });

            o.tbl.find('tbody tr td[contenteditable]').live('blur', function () {
                //if ($(this).hasClass('number')) { changeNumber(this); }
                $(this).parents('tr').addClass('dirty');
                pressEnter(this);
            }).live('keypress', function (evt) {
                if (evt.keyCode == 13) {
                    pressEnter(this);
                    return false;
                }
            });
            o.tbl.find('tbody tr td .del').live('click', function () {
                delTr(this);
            })
            o.dv.find('.result-header button[name=clear]').click(function () {
                clear();
            });

            o.dv.find('.result-header .dropdown-menu li:has(a)').click(function () {//点击操作按钮下面的目录后执行的操作
                clickDropMenu($(this));
            });
            o.inputs = o.dvSp.find('input,select');
            o.total = o.dv.find('#q_po_ec_total');

            o.getVendor();
        }
    },
    selectedProductR = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(5).attr('data-value') == 'cancel' || o.inputs.eq(5).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = null; b = a[i]; i++) {
            var td = [];
            //if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
            //    continue;
            td.push(dom.td(b.productName));
            td.push(dom.td(b.maxQty, 'class="number" ' + ctb));
            td.push(dom.td(b.maxPrice, 'class="number" ' + ctb));
            td.push(dom.td('/' + b.uom));
            //td.push(dom.td(''));
            td.push(dom.td(b.maxQty * b.maxPrice));
            td.push(dom.td(b.orderNum));
            td.push(dom.td('', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            attr = 'data-maxQty="' + b.maxQty + '" data-maxPrice="' + b.maxPrice + '" data-fromId="' + b.lineId + '" data-prod-id="' + b.productId + '" data-pre="-1"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').eq(0).append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    selectedProduct = function (a) {
        var tr = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody:eq(1) tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            td.push(dom.td('1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            //td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(o.discount || b[5] || '0', ctb + ' class="number"'));
            td.push(dom.td(b[2] * (100 - (o.discount || 0)) / 100, 'class="number"'));
            td.push(dom.td(b[6] || '', ctb));

            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"  data-pre="1"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            tr.push(dom.tr(td.join(''), attr));
        }
        o.tbl.find('tbody').eq(1).append(tr.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        total();
    },
    confirmOrder = function () {
        o.inputs.eq(5).attr('data-value', 'confirm');
        submit(function (id) {
            agent.so.updateStatus(id, 'confirm');
            o.show(id);
        });
    },
    cancelOrder = function () {
        o.inputs.eq(5).attr('data-value', 'cancel');
        submit();
    },
    clickDropMenu = function (obj) {
        if (obj.hasClass('confirm')) {
            confirmOrder();
        }
        else if (obj.hasClass('cancel')) {
            cancelOrder();
        }
        else if (obj.hasClass('clear')) {
            clear();
        }
    },
    pressEnter = function (obj) {
        if ($(obj).hasClass('number')) {
            var tr = $(obj).parents('tr');
            if (tr.attr('data-pre') < 0) {
                if ($(obj).index() == 1) {
                    if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxqty'))) {
                        $(obj).text(tr.attr('data-maxqty')).focus();
                        gtips.showNotice('不能大于订单的数量');
                        return;
                    }
                }
                else if ($(obj).index() == 2) {
                    if (parseFloat($(obj).text()) > parseFloat(tr.attr('data-maxprice'))) {
                        $(obj).text(tr.attr('data-maxprice')).focus();
                        gtips.showNotice('不能大于订单上面的单价');
                        return;
                    }
                }
            }
            changeNumber(obj);
        }
        var idx = $(obj).index();
        $(obj).parents('tr').next().find('td').eq(idx).focus();
    },
    changeNumber = function (obj) {
        var tr = $(obj).parents('tr'), tds = tr.find('td'),
            price = tds.eq(2).text(), num = tds.eq(1).text() || 0;
        if (tr.attr('data-pre') < 0) {
            tds.eq(4).text(parseFloat(price) * parseInt(num));
        }
        else {
            tds.eq(5).text(parseFloat(price) * parseInt(num) * (100 - parseInt(tds.eq(4).text() || 0)) / 100);
        }
        total();
    },
    totalSub = function () {
        var t = 0;
        o.tbl.each(function () {
            t = 0;
            $(this).find('tbody tr:not(.hide)').each(function () {
                if ($(this).attr('data-pre') > 0) {
                    t += parseFloat($(this).find('td:eq(5)').text() || 0);
                }
                else
                    t += parseFloat($(this).find('td:eq(4)').text() || 0);
            });
            $(this).prev().find('div').eq(1).text(f.price(t, 2));
        });
    },
    total = function () {
        var t = 0;
        o.tbl.find('tbody tr:not(.hide)').each(function () {
            if ($(this).attr('data-pre') > 0) {
                t += parseFloat($(this).find('td:eq(5)').text() || 0) * $(this).attr('data-pre');
            }
            else
                t += parseFloat($(this).find('td:eq(4)').text() || 0) * $(this).attr('data-pre');
        });
        o.total.val(f.price(t, 2));
        totalSub();
    },
    fillPartner = function (p) {
        o.partner.val(p.code + ' ' + p.name).attr({ 'data-id': p.id, 'data-code': p.code, 'data-name': p.name });
        o.discount = p.discount;
    },
    delTr = function (obj) {
        var tr = $(obj).parents('tr');
        if (tr.attr('data-id')) {
            tr.hide().addClass('hide');
        }
        else {
            $(obj).parents('tr').remove();
        }
        total();
    },
    fillProduct = function (a) {
        fdataLine(a);
        total();
    },
    addSo = function (head, lines, success) {
        gf.callProc_with_value('up_member_createSoExchangeHead', head, function (v) {
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = [v].concat(lines[i]);
            }
            if (lines.length > 0) {
                gf.callProcBatch('up_member_createSoExchangeLine', lines, function () {
                    success(v);
                })
            }
        })
    },
    displayBtn = function () {
        o.dv.find('.btn:not(.lov .btn)').hide();
        o.dv.find('input,textarea,.lov .btn').disable();
    },
    showBtn = function () {
        o.dv.find('.btn').show();
        o.dv.find('input:not(#q_po_ec_total,#q_po_ec_status),textarea,.lov .btn').enable();
    },
    fdataHead = function (a) {
        o.inputs.eq(0).val(a[0]);
        o.inputs.eq(1).val(a[9] + ' ' + a[10]).attr({ 'data-code': a[9], 'data-name': a[10], 'data-id': a[5] });
        o.inputs.eq(2).val(a[2]);
        o.inputs.eq(3).val(a[4]);
        o.inputs.eq(4).val(o.status[a[11]] || o.status['draft']).attr('data-value', a[11] || 'draft');
        if (a[11] == 'cancel' || a[11] == 'confirm') {
            displayBtn();
        }
        else {
            showBtn();
        }
        o.dv.find('.modal-footer textarea').text(a[8])
    },
    fdataLine = function (a) {
        //var discount = o.cmbAnalytic.find(':selected').attr('data-discount') || 0, 
        var tr1 = [], tr2 = [];
        o.dv.modal('show');
        var ctb = ' contenteditable="true"',
            delbtn = '<i class="icon-minus del">';
        if (o.inputs.eq(4).attr('data-value') == 'cancel' || o.inputs.eq(4).attr('data-value') == 'confirm') {
            ctb = '';
            delbtn = '';
        }
        for (var i = 0, b = []; b = a[i]; i++) {
            var td = [];
            if (o.tbl.find('tbody tr[data-prod-id=' + b[0] + ']').size() > 0)
                continue;
            td.push(dom.td(b[1]));
            var pre = 1;
            if (b[4] < 0) {
                pre = -1;
            }
            td.push(dom.td(b[4] * pre || '1', 'class="number" ' + ctb));
            td.push(dom.td(b[2], 'class="number" ' + ctb));
            td.push(dom.td('<small>/' + b[3] + '</small>'));
            if (pre > 0) {
                td.push(dom.td(b[5] || '0', ctb + ' class="number"'));
            }
            td.push(dom.td(b[2] * b[4] * pre * (100 - parseFloat(b[5])) / 100, 'class="number"'));
            if (pre < 0) {
                td.push(dom.td(b[10]));
            }
            td.push(dom.td(b[6] || '', ctb));
            td.push(dom.td(delbtn, 'style="text-align: center;"'));
            var attr = 'data-prod-id="' + b[0] + '"';
            if (b[7])
                attr += ' data-id="' + b[7] + '"';
            if (pre < 0) {
                attr += ' data-pre="-1"'
                tr1.push(dom.tr(td.join(''), attr));
            }
            else {
                attr += ' data-pre="1"'
                tr2.push(dom.tr(td.join(''), attr));
            }
        }
        o.tbl.find('tbody').eq(0).append(tr1.join('')).end().eq(1).append(tr2.join(''));
        o.dv.find('.result-header').find('c').text(o.tbl.find('tbody tr').size()).end().find('d').text(gf.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    },
    getHead = function (id, type) {
        gf.getOneLine('up_member_getSoExchangeHead', [id], function (a) {
            fdataHead(a);
            getLine(id);
            o.dv.find('.modal-header h3').find('c').text(type == 'view' ? '查看' : '修改').end().find('small').text('[MEC' + a[0] + ']');
        })
    },
    getLine = function (id) {
        gf.noPagination('up_member_getSoLine', [id], function (a) {
            o.tbl.find('tbody').html('');
            fillProduct(a);
        });
    },
    submit = function (success) {
        var head = [], line = [], lines = [], om = this, uid = ur.user().id;
        head.push(o.inputs.eq(0).val() || 0);
        head.push(o.inputs.eq(1).attr('data-id'));
        if (!o.inputs.eq(1).val()) {
            o.inputs.eq(1).addClass('error');
            return;
        }
        else {
            o.inputs.eq(1).removeClass('error');
        }
        head.push(uid);
        head.push(o.inputs.eq(2).val()); //order date
        head.push(o.inputs.eq(4).val()); //amount
        head.push(o.inputs.eq(3).val()); //reason
        head.push(o.dv.find('.modal-footer textarea').text() || '');
        head.push(o.inputs.eq(5).attr('data-value') || 'draft');
        head.push(uid);
        o.tbl.find('tbody tr').each(function () {
            //var obj = $(this).find('div').first(), price = obj.attr('_price'), qty = $(this).find('p:eq(2)').html();
            var obj = $(this), tds = obj.find('td');
            line = [];
            if (obj.hasClass('dirty') || !obj.attr('data-id') || obj.css('display') == 'none') {
                var id = parseInt(obj.attr('data-id') || 0), pre = obj.attr('data-pre');
                if (obj.css('display') == 'none') {
                    id = -id;
                }
                line.push(id);
                line.push(obj.attr('data-prod-id'));
                line.push(tds.eq(1).text() * pre); //qty
                line.push(tds.eq(2).text()); //price
                if (pre < 0)
                    line.push(0);
                else
                    line.push(tds.eq(4).text() || 0); //discount
                line.push(obj.attr('data-fromId') || 'null'); //from
                line.push(tds.eq(6).text()); //comment
                line.push(uid);
                lines.push(line);
            }
        });
        if (lines.length || head[0] > 0) addSo(head, lines, success);
    },
    close = function () {
        o.dv.modal('hide');
    },
    clear = function () {
        o.tbl.find('tbody').html('');
        o.inputs.val('').eq(2).val(gf.dateFormat(new Date(), 'yyyy-MM-dd'));
        o.inputs.eq(5).val(o.status['draft']).attr('data-value', 'draft');
        showBtn();
        o.dv.find('.modal-header h3').find('c').text('新增').end().find('small').text('');
    };
    o.show = function (id, type) {
        ini();
        o.dv.modal({ backdrop: 'static' });
        if (id) {
            //getLine(id);
            getHead(id, type);
        }
        else {
            clear();
        }
    };
    o.saveClose = function () {
        submit(function () { close(); agent.poExchange.search(); });
    };
    o.saveAdd = function () {
        submit(clear);
    };
    return o;
})()


if (ur.user().rank || ur.user().rank === 0) {
    if (ur.user().rank != 2) {
        if (ur.user().rank == 1) {
            window.location = "/agent.shtml";
        }
        else if (ur.user().rank == 0) {
            window.location = "/factory.shtml";
        }
    }
}
else {
    window.location = "/shop/my_account.shtml";
}