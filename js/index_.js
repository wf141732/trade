/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.aac.js" />
/// <reference path="version.js" />


$(function () {
    checkLogin();
    var oli = null;
    gMenu.ini();
    gtips.ini();
    $('#dvSide li').click(function () {
        gMenu.action($(this).attr('_index'));
        if (oli) oli.removeClass('on');
        oli = $(this).addClass('on');
    }).eq(1).click();

    if (ur.user().rank < 2) {
        $('#dvSide .rank2').hide();
    }
    var a = [ur.user().name, ur.user().coName, gaRank[ur.user().rank]];
    $('#hd .logininfo b').each(function (i) { $(this).text(a[i]) });
});

gMenu = {
    index: 0,
    dvs: null,
    qmenus: null,
    ini: function () {
        this.dvs = $('.target');
    },
    action: function (index) {
        var om = this;
        if (index < 21) {
            var a = ['mRegister', 'mMemberCardNo', 'mAgent', 'mMember', 'mGiftDelivery', 'mUsers', 'mSaleStock', 'mAgentSta'];
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
}



var _txtChildrenAgent = {
    dvCode: null,
    iniChilrenAgent: function () {
        this.dvCode = this.dv.find('.dvcode');
        this.dvCode.find('span').text(ur.user().code);
        this.dvCode.find(':text').attr({ coname: ur.user().coName, dc: ur.user().DistrictCode, rank: ur.user().rank, ext: ur.user().code, _id: ur.user().agentId });
        gAuto.code(this.dvCode.find(':text'), function (itm, txt) {
            $(txt).attr({ coname: itm.name, dc: itm.dc, rank: itm.rank });
        });
    },
    getCode: function () {
        return this.dvCode.find('span').text() + this.dvCode.find(':text').val();
    }
}


var _cmbAddress = {
    cmbAddress: null,
    isIniCmb: false,
    iniAddr: function () {//选择
        if (!this.isIniCmb) {
            var om = this;
            this.isIniCmb = true;
            // 地区号分3段
            gf.noPaginationSqlPara('1=1', 'ID asc', 'ID,ProvinceName', 'Province', function (a) {
                gOption.foption(om.cmbAddress.eq(0), a);
                om.setDefault(ur.user().DistrictCode);
            });
            this.cmbAddress.eq(0).change(function () {
                om.city($(this).val(), '');
            });
            this.cmbAddress.eq(1).change(function () {
                om.area($(this).val(), '');
            });
        }
    },
    setDefault: function (code) {
        var sa = [];
        code = $.trim(code);
        if (code) {
            sa.push(code.substr(0, 2));
            sa.push(code.substr(2, 2));
            sa.push(code.substr(4, 2));
            
            this.province(sa[0]);
            this.city(sa[0], sa[0] + sa[1]);
            this.area(sa[0] + sa[1], code);
        }
    },
    province: function (def) {
        this.cmbAddress.eq(0).val(def);
    },
    area: function (city, def) {
        var om = this;
        gf.noPaginationSqlPara('CityID=' + city, 'CityID asc', 'DistrictCode,AreaName', 'Area', function (a) {
            a.unshift(['', '请选择地区']);
            gOption.foption(om.cmbAddress.eq(2), a, def);
        });
    },
    city: function (provice, def) {
        var om = this;
        gf.noPaginationSqlPara('ProvinceID=' + provice, 'ID asc', 'ID,CityName', 'City', function (a) {
            a.unshift(['', '请选择城市']);
            gOption.foption(om.cmbAddress.eq(1), a, def);
        });
    }
}


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


var mAgentSta = $.extend({}, _txtChildrenAgent, {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAgentSta');
            this.dv.find('.btnSearch').click(function () {
                om.search();
            });
            this.dv.find('.date :text').datepicker({ changeMonth: true, changeYear: true });
            this.dv.find('.date :text:eq(1)').val(gf.getDateAfter(1));
            this.iniChilrenAgent();
        }
    },
    search: function () {
        var om = this;
        var a = [];
        var o = this.dv.find(':text');
        a[0] = o.eq(0).attr('_id');
        if (!a[0]) a[0] = ur.user().agentId;
        a[1] = this.getCode();
        a[2] = o.eq(1).val();
        a[3] = o.eq(2).val();
        if (a[2] && a[3]) {
            var btn = $(this).disable().val('正在统计..');
            gf.noPagination('up_member_staUser2', a, function (a) {
                btn.enable().val('统计');
                var b = [], c = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c.push(td(b[0])); //
                    c.push(td(b[1])); //
                    c.push(td(b[2])); //
                    c.push(td(gf.percent(b[1], b[2]))); // 入会比例
                    a[i] = tr(c.join(''));
                    c = [];
                }
                om.dv.find('tbody').html(a.join(''));
            });
        } else {
            alert('请输入日期');
        }
    }
});

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
            this.cmbAddress = this.dvUpdate.find('.address select');
            this.dvUpdate.find('.icon_close').click(function () {
                om.dvUpdate.fadeOut();
            }).end().find('.btnSave').click(function () {
                // 更新用户
                var a = [];
                a.push(ur.user().id);
                a.push(om.crrntAgentId);
                a.push(om.id);
                a.push(om.dvUpdate.find('.cmbRole').val());
                a.push(om.cmbAddress.eq(2).val());
                om.dvUpdate.find(':text,:password').each(function () {
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
        gf.callProc_with_value('up_member_updateUser', a, function (v) {
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
        this.id = '';
        if (id) {
            this.id = id;
            gf.getOneLineSqlPara('ID=' + id, 'memberNo,psw,name,role,mobile,DistrictCode', 'member.users', function (a) {
                om.dvUpdate.find(':text,select,:password').each(function (i) {
                    $(this).val(a[i]);
                });
                om.setDefault(a[5]);
            });
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

function gCheckDelRight() {
    if (ur.user().role < 2) {
        return true;
    } else {
        alert('您是员工无权删除数据');
        return false;
    }
}

var mGiftDelivery = $.extend({}, gPaginationModel, _cmbAddress, _txtChildrenAgent, {
    id: '',
    agentId: '',
    fields: 'ID,userName,gender,IdCardNo,mobile,address,GiftName,CREATION_DATE,Donation,memberNo',
    tbl: "member.giftDelivery_v",
    dvAction: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvGiftDelivery');
            this.dvAction = $('#dvGiftDeliveryAction');
            this.cmbAddress = this.dvAction.find('.address select');

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

            //等级
            //初始化一级经销商
            if (ur.user().rank < 2) {// 只有厂家和代理商才可以选择
                this.dv.find('.btnDelivery').hide();
            }

            this.dvAction.find('.icon_close').click(function () {
                om.dvAction.fadeOut();
            }).end().find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(ur.user().agentId)
                var cmbs = om.dvAction.find('.content table select');
                a.push(cmbs.eq(2).val());
                a.push(cmbs.eq(3).val());
                om.dvAction.find('.content table td :text').each(function () {
                    a.push($(this).val());
                });
                var btn = $(this).val('正在派送..');
                gf.callProc('up_member_deliveryGift', a, function () {
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
                        gf.noPagination('up_member_checkIdCard', [cardno], function (a) {
                            a = a[0];
                            btn.enable().val('审核身份证');
                            if ($.isArray(a)) {
                                a[0] = f.date(a[0])
                                om.dvAction.find('.tips').show().find('td b').each(function (i) { $(this).html(a[i]); });
                            } else {//GiftName,Donation,g.CREATION_DATE,a.name
                                om.unlock();
                                om.setDefault(cardno.substr(0, 6));
                                var birthday = info.birthday;
                                om.dvAction.find('.txtBirthday').val(birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2));
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
        c.push(td(a[3])); //身份证
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
        this.dv.find('.tool').find(':text').each(function () {
            a.push($(this).val());
        });
        a[0] = ur.user().code + a[0];
        return f.getWhere_root(aF, a);
    }
});



var mMember = $.extend({}, gPaginationModel, _cmbAddress, _txtChildrenAgent, _toexcel, {
    id: '',
    agentId: '',
    fields: 'ID,memberNo,name,companyName,address,mobile,total_point,consumed_point,IdCardNo,DistrictCode,memberDate,gender,role,CREATION_DATE,rank',
    tbl: "member.users_v2",
    fileNamePrefix: 'memberlist', // 文件名前缀
    toexcel_fields: 'ID,memberNo,name,companyName,address,mobile,IdCardNo,memberDate,gender',
    dvUpdate: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvMember');
            this.dvUpdate = $('#dvUpdateMember');
            this.cmbAddress = this.dvUpdate.find('.address select');
            this.dvUpdate.find('.icon_close').click(function () { om.dvUpdate.fadeOut(); });
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            });

            this.dvUpdate.find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(om.id);
                a.push(om.parentId);
                a.push(om.cmbAddress.eq(2).val());
                var btn = $(this).val('正在添加');
                om.dvUpdate.find('.content table td :text').each(function () {
                    a.push($(this).val());
                });

                gf.callProc('', a, function () {
                    gtips.showNotice('添加完毕!');
                    btn.val('确定保存');
                    om.dvUpdate.fadeOut();
                });
            });
            this.ini_after();
            this.iniChilrenAgent();

            this.iniToExcel();
        }
    },
    show: function (obj, parentName, parentId, id) {
        this.iniAddr();
        var o = this.dvUpdate.find('table td');
        o.eq(0).text(parentName);
        gf.show(obj, this.dvUpdate, { x: 'center', y: 'center' });
        this.id = '';
        this.parentId = parentId;
        if (id) { // 修改
            this.id = id;
        }
    },
    fdata: function (a) {
        //ID,IdCardNo,name,companyName,address,mobile,total_point,consumed_point,DistrictCode,memberDate,gender,role,CREATION_DATE,rank
        var c = [];
        c.push(td(a[1])); //会员号
        c.push(td(a[5])); //手机
        c.push(td(a[6])); //总积分
        c.push(td(a[7])); //已兑积分
        c.push(td(Number(a[6]) - Number(a[7]))); //剩余积分
        c.push(td(a[2])); //姓名
        c.push(td(a[3])); //门店和门店号
        return tr(c.join(""), '_id="' + a[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push('role=r_r');
        aF.push("code like 'r_r%'");
        aF.push("memberNo=r_r");
        aF.push("name like 'r_r%'");
        a.push('11');

        this.dv.find('.tool').find(':text').each(function () {
            a.push($(this).val());
        });
        a[1] = ur.user().code + a[1];
        return f.getWhere_root(aF, a);
    }
});

var mAgent = $.extend({}, gPaginationModel, _txtChildrenAgent, _cmbAddress, {
    id: '',
    parentId: '',
    fields: 'ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty',
    tbl: "member.agent_v",
    dvUpdate: null,
    cmbProvince: null,
    btnSave: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAgent');
            this.dvUpdate = $('#dvUpdateAgent');
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

            this.btnSave = this.dvUpdate.find('.btnSave').click(function () {
                var a = [];
                a.push(ur.user().id);
                a.push(om.id);
                a.push(om.parentId);
                a.push(om.cmbAddress.eq(2).val());
                var btn = $(this).val('正在添加');
                om.dvUpdate.find('.content table td :text:not(.notinc)').each(function () {
                    a.push($(this).val());
                });

                a[4] = om.dvUpdate.find('.parentCode').text() + a[4]; // 合并编号
                gf.log(a);
                gf.callProc('up_member_updateAgent', a, function () {
                    gtips.showNotice('添加完毕!');
                    btn.val('确定保存');
                    om.dvUpdate.fadeOut();
                });
            });
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
                // 去掉父代号
                a[5] = a[5].substr(a[3].length, a[5].length - a[3].length);
                om.dvUpdate.find('.content td :text:not(.notinc)').each(function (i) { $(this).val(a[i + 5]); });
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

                    mUsers.updateUser(a, function () {
                        alert('添加成功，用户名为' + num + '密码为默认密码');
                    });
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
                    mUsers.updateUser(a, function () {
                        alert('添加成功，用户名为' + num + '密码为默认密码');
                    });
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
    },
    fdata: function (a) {
        //ID,code,rank,name,mobile,parentName,CREATION_DATE,memberQty,DistrictCode,userQty
        var c = [];
        c.push(td(a[1])); //门店号
        c.push(td(gaRank[a[2]])); //等级
        c.push(td(a[3] + '[' + a[9] + ']')); //名称
        c.push(td(a[4])); //联系电话
        c.push(td(a[5])); //上级
        c.push(td(f.date(a[6]))); //加入日期
        c.push(td(a[7])); //会员数
        return tr(c.join(""), '_id="' + a[0] + '" DistrictCode="' + a[8] + '" rank="' + a[2] + '" code="' + a[1] + '"');
    },
    where: function () {
        var a = [], aF = [];
        //aF.push("parentId=r_r");
        aF.push("code like 'r_r%'");
        aF.push("rank=r_r");
        aF.push("DistrictCode like 'r_r%'");

        a[0] = ur.user().code + this.dvCode.find(':text').val();
        a[1] = this.dv.find('.tool .cmbRank').val();
        a[2] = this.cmbProvince.val();
        return f.getWhere_root(aF, a);
    }
});



var mMemberCardNo = $.extend({}, gPaginationModel, _txtChildrenAgent, {
    dv: null,
    fields: 'Id,rank,name,CREATION_DATE,LAST_UPDATE_DATE',
    tbl: "member.num_v",
    aState: ['作废', '未分配', '在代理商', '在终端店', '已分配给会员'],
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvMemberCardNo');
            var cmbState = this.dv.find('.cmbState');
            this.oTbl = this.dv.find('table');
            this.bttnSearch = this.dv.find('.tool .btnSearch').click(function () {
                om.search();
            });

            // 获取下级分销商
            var rank = ur.user().rank;
            if (rank < 2) {
                if (rank == 1) {
                    cmbState.find('option:lt(2)').hide().end().val(2);
                } else if (rank == 0) {
                    this.dv.find('.btnShowGenerateNum').show();
                }
            } else {
                cmbState.find('option:lt(3)').hide().end().val(3);
                this.dv.find('.btnAssign').hide();
            }

            this.dv.find('.btnShowGenerateNum').click(function () {
                mGenerateNo.show(this);
            }).end().find('.btnSearch').click(function () {
                om.search(this);
            }).end().find('.btnAssign').click(function () { // 分配卡号
                mAssignNo.show(this, om.cmbChilrenAgent.find('option:selected').text(), om.cmbChilrenAgent.val());
            });

            this.iniChilrenAgent();
            this.ini_after();
        }
    },
    fdata: function (b) {
        //memberId,state,CREATION_DATE,AST_UPDATE_DATE
        var c = [];
        c.push(td(b[0])); //ID
        c.push(td(this.aState[b[1]])); //状态
        c.push(td(f.date(b[2]))); //制卡日期
        c.push(td(f.date(b[3]))); //最后更新日期
        return tr(c.join(''), '_id="' + b[0] + '"');
    },
    where: function () {
        var a = [], aF = [];
        aF.push("rank=r_r");
        aF.push("code like 'r_r%'");
        aF.push("Id=r_r");
        var o = this.dv.find('.tool').find('select,:text');
        a.push(o.eq(0).val());
        a.push(ur.user().code + o.eq(1).val());
        a.push(o.eq(2).val());
        return f.getWhere_root(aF, a);
    }
});

var mAssignNo = {
    dv: null,
    agentId: '',
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvAssignNo');
            this.dv.find('.icon_close').click(function () {
                om.dv.hide();
            }).end().find('.btnEval').click(function () {// 评估
                om.action('1');
            }).end().find('.btnAssign').click(function () { //分配
                om.action('0');
            });
        }
    },
    action: function (isEval) {
        var om = this;
        var a = [];
        a.push(ur.user().id);
        a.push(isEval);
        a.push(this.agentId);
        a.push(ur.user().agentId);
        this.dv.find(':text').each(function () {
            a.push($(this).val());
        });
        gf.callProc_with_value('up_member_assignNum', a, function (v) {
            alert((isEval == 0 ? '共分配' : '共有') + v + '张卡号');
            if (isEval == 0) { om.dv.fadeOut(); }
        });
    },
    show: function (obj, agentName, agentId) {
        this.ini();
        var om = this;
        this.dv.find('.header_floatbox h4 b').text(agentName);
        this.agentId = agentId;
        // 获取我司可以分配的最小卡号和最大卡号，和总卡数
        gf.getOneLine('up_member_getMyNumsStatistic', [ur.user().agentId, ur.user().rank], function (a) {
            //MIN(memberId),MAX(memberId),COUNT(*),@total
            om.dv.find('.tips b').each(function (i) { $(this).text(a[i]); });
            om.dv.find(':text').eq(0).val(a[2]);
        });
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
    }
}

var mGenerateNo = {
    dv: null,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvGenerateNo');
            this.dv.find('.icon_close').click(function () {
                om.dv.hide();
            }).end().find('.btnGenerate').click(function () {
                var a = [];
                a.push(ur.user().id);
                om.dv.find(':text').each(function () { a.push($(this).val()); });
                if (a[1] && a[2]) {
                    var btn = $(this).disable();
                    gf.callProc_with_value('up_member_generateNum', a, function (v) {
                        btn.enable();
                        if (v > 0) {
                            alert('生成成功，共生成' + v + '个会员号');
                            om.dv.fadeOut();
                        } else {
                            alert('该号段已经分配完毕！');
                        }
                    });
                } else {
                    alert('号码不能为空');
                }
            });
        }
    },
    show: function (obj) {
        this.ini();
        var om = this;
        gf.getOneLine('up_member_getMyNumsStatistic', [ur.user().agentId, ur.user().rank], function (a) {
            om.dv.find('.tips b').each(function (i) { $(this).text(a[i]); });
            om.dv.find(':text').eq(0).val(Number(a[3] + 1));
        });
        gf.show(obj, this.dv, { x: 'center', y: 'center' });
    }
}

var mRegister = $.extend({}, _cmbAddress, {
    dv: null,
    dvRegister: null,
    txtKey: null,
    pass: false,
    ini: function () {
        if (!this.dv) {
            var om = this;
            this.dv = $('#dvMemberRegister');
            this.dvRegister = this.dv.find('.register');
            this.txtKey = this.dv.find('.txtKey').enterpress(function () {
                om.getMyNo();
            });

            this.dv.find('.txtNo').blur(function () {
                var reg = /^[1-3]\d{7}/; // 1，2开头且为8位数字
                //var reg = /^[3]\d{7}/;
                //var reg = /^[2]\d{7}/; // 1，2开头且为8位数字
                if (reg.test($(this).val())) {
                    $(this).parent().next().find('span').hide();
                    $(this).removeClass('error');
                } else {
                    $(this).parent().next().find('span').show().text('会员号不合法(1/2/3开头且全部为8位数字)');
                    $(this).addClass('error');
                }
            });

            this.dv.find('.btnSearch').click(function () {
                om.getMyNo();
            }).end().find('[role=btnRegister]').click(function () {
                if (om.dvRegister.find('table :text.error').length > 0) {
                    alert('输入有误，不能注册，请仔细检查');
                    return 1;
                }
                if (!om.pass) {
                    alert('身份证验证不通过不能注册');
                    return 1;
                }
                var a = [];
                a.push(ur.user().id);
                a.push(ur.user().agentId);
                a.push('123456'); // 默认密码
                a.push(om.cmbAddress.eq(2).val()); //地址
                if (ur.user().agentId < 1 || !ur.user().agentId) {
                    alert('等录异常，请重新登录');
                    return 1;
                }

                var ab = [];
                om.dv.find('.birthday select').each(function () { ab.push($(this).val()); });
                a.push(ab.join('-')); //生日
                a.push(om.dv.find('.gender :radio').val()); //性别
                var btn = $(this).disable().val('正在注册..');
                om.dvRegister.find('table :text').each(function () { a.push($(this).val()); });

                gf.callProc_with_value('member_register', a, function (v) {
                    btn.enable().val('确定注册');
                    if (v == 0) {
                        alert('该会员号已经注册，不能重复注册');
                    } else if (v == 1) {
                        alert('注册成功');
                        om.dv.find(':text').val('');
                        om.pass = false;
                    }
                    else {
                        alert('注册失败！');
                    }
                }, function () {
                    alert('注册失败！');
                });
            }).end().find('.btnCheck').click(function () {
                var btn = $(this).val('...');
                var cardno = $.trim(om.dv.find('.txtId').val());
                var info = checkIdCard(cardno);
                if (info) {// 身份证验证成功
                    om.setDefault(cardno.substr(0, 6));
                    var birthday = info.birthday;
                    var cmbs = om.dv.find('.birthday select');
                    cmbs.eq(0).val(birthday.substr(0, 4));
                    cmbs.eq(1).val(Number(birthday.substr(4, 2)));
                    cmbs.eq(2).val(Number(birthday.substr(6, 2)));
                    om.dv.find('.gender :radio').val([info.gender]);
                    gf.getOneLine('up_member_checkIdCardForRegister', [cardno], function (a) {
                        btn.enable().val('验证');
                        if (a.length > 1) {
                            //ID,role,memberNo,name,mobile,CREATION_DATE,agentId,companyName,DistrictCode
                            if (a[1] == '10') {
                                if (confirm('该用户在门店' + a[7] + ' 于' + f.date(a[5]) + ' 由于领取礼品已经登记了信息,是否要注册成会员?')) {
                                    om.pass = true;
                                    // 获取更详细信息
                                    var otxt = om.dvRegister.find(':text');
                                    otxt.eq(2).val(a[3]); //姓名
                                    otxt.eq(3).val(a[4]);
                                    om.setDefault(a[8]);
                                } else {
                                    om.pass = false;
                                }
                            } else if (a[1] == '11') {
                                alert(a[3] + '的身份证已经注册了会员，会员号为' + a[2] + ',一张身份证不能重复注册');
                                om.pass = false;
                            }
                        } else {
                            om.pass = true;
                        }
                    }, 1, function () {
                        alert('注册会员发生异常，请与管理员联系QQ:17152852');
                    });
                } else {
                    om.pass = false;
                    btn.enable().val('验证');
                    alert('身份证号码有误请重新输入');
                }
            });

            //获取省级
            this.cmbAddress = this.dv.find('.address select');
            this.iniAddr();
            this.txtKey.val(localStorage.register_search_key);
            this.getMyNo();
        }
    },
    getMyNo: function () {
        // 获取我的会员号
        var om = this;
        var key = this.txtKey.val()
        localStorage.register_search_key = key;
        gf.noPagination('up_member_getMyUnassignNums', [ur.user().agentId, key], function (a) {
            for (var i = 0; i < a.length; i++) {
                a[i] = '<li>' + a[i] + '</li>';
            }
            om.dv.find('.lstCode ul').html(a.join('')).find('li').click(function () {
                om.dv.find('.txtNo').val($(this).text());
            });
        });
    }
});


//var _cmbChildrenAgent = {
//    cmbChilrenAgent: null,
//    iniChilrenAgent: function () {
//        var om = this;
//        this.cmbChilrenAgent = this.dv.find('.cmbChildrenAgent');
//        //初始化一级经销商
//        if (ur.user().rank < 2) {// 只有厂家和代理商才可以选择
//            gf.noPaginationSqlPara('parentId=' + ur.user().agentId, 'rank asc,name asc', 'ID,name,DistrictCode,rank,code', 'member.agent_active', function (a) {
//                //gOption.foption(om.cmbChilrenAgent, a, '', [ur.user().agentId, '我司']);
//                var b = [];
//                a.unshift([ur.user().agentId, '我司', ur.user().DistrictCode, ur.user().rank]);
//                for (var i = 0; i < a.length; i++) {
//                    b = a[i];
//                    a[i] = '<option value="' + b[0] + '" DistrictCode="' + b[2] + '" rank="' + b[3] + '" code="' + b[4] + '">' + b[1] + '</option>';
//                }
//                om.cmbChilrenAgent.html(a.join(''));
//            });
//        } else {
//            this.cmbChilrenAgent.parent().hide();
//        }
//    }
//}