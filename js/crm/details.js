/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="comment.js" />

var editor = null;
var gcoid = '';// 公司ID
$(function () {
    gcoid = gf.queryValue("id"); // mfg id
    if (gcoid) {
        gf.getOneLineSqlPara('ID=' + gcoid, 'ID,全称,助记名,星级,Web_Site,Address,评语,国家,logo,柜台', 'co.vwCompany', function (a) {
            var logo = a[8];
            logo = '../upload/customerlogo/' + (logo ? a[0] + '.' + logo : 'noupload.gif');
            logo = '<img alt="logo" src="' + logo + '" style="width:220px;height:50px;" />'; //logo
            if (!a[4].startsWith('http://')) a[4] = 'http://' + a[4];
            a[1] = '<a href="' + a[4] + '" target="_blank" >' + a[1] + '</a>';
            if (a[9]) a[5] += ',柜台:' + a[9];
            $('#hd').find('.company').html(a[1]).end().find('.address').text(a[5]);
        });
    }

    gcontact.coid = gcoid;
    var o = $('.content .target').hide();
    with (mcomment) {// 配置评论
        relateid = gcoid;
        type = '1';
    }

    $('.lft_menu li').click(function () {
        $(this).parent().find('.on').removeClass('on').end().end().addClass('on');
        o.hide();
        var t = $(this).attr('_id');
        $('#dv_' + t).show();
        if (t == 'comment') {
            if (!mcomment.isini) mcomment.ini();
        } else if (t == 'contacts') {
            if (!mcontact.isini) mcontact.ini();
        } else if (t == 'conways') {
            if (!mconways.isini) mconways.ini();
        } else if (t == 'sta_rfq') {
            var type = $(this).attr('_type');
            with (msta_rfq) {
                if (type == 'cu') {
                    set_type(0);
                    caption = '年度询价、订单统计(客户)';
                    ah = ['询价数', '未报数', '订单数', '订单金额', '毛利'];
                    pro = 'up_sta_rfq_search';
                } else if (type == 'su') {
                    set_type(0);
                    caption = '年度报价、采购(供货商)';
                    ah = ['报价数', '无货数', '采购数', '采购金额'];
                    pro = 'up_sta_quote_search';
                } else if (type == 'ad_cu') { // 高级统计
                    set_type(1);
                    caption = '年度厂牌封装统计';
                    ah = ['询价数'];
                    pro = 'up_sta_rfq_advance';
                } else if (type == 'ad_su') { // 高级统计
                    set_type(1);
                    caption = '年度厂牌封装统计';
                    ah = ['询价数'];
                    pro = 'up_sta_quote_advance';
                }
                refresh();
            }
        }
    });
    msta_rfq.ini();
});

var msta_rfq = {// 询价统计
    dv: null,
    dv_alert: null,
    visual: null,
    otbl: null,
    caption: '',
    ah: [],
    pro: '',
    sta_type: 0, // 0:按月份统计询价 1：高级
    dv_type: null,
    ini: function () {
        var om = this;
        this.dv = $('#dv_sta_rfq');
        this.dv_type = this.dv.find('.type');
        this.otbl = this.dv.find('.data');
        this.dv_alert = this.dv.find('.alert');
        this.dv.find('.toolbar .years').html(gf.years());
        this.dv.find('.bttnsearch').click(function () {
            om.search(this);
        });
    },
    refresh: function () {
        $(this.visual).remove();
        if (this.otbl.find('tr:eq(1) td').size() > 1) {
            this.visual = this.otbl.visualize({ type: this.dv.find('.toolbar .drawtype option:selected').val(), height: '280px', width: '650px', rowFilter: '.row' });
        }
    },
    set_type: function (type) {
        this.sta_type = type;
        if (type == 0) { this.dv_type.hide() } else { this.dv_type.show(); }
    },
    getParas: function (year) {
        var a = [gcoid, ur.company().id, year];
        if (this.sta_type == 1) {
            a[3] = this.dv_type.find(':checked').val();
        }
        return a;
    },
    search: function (obj) { // 根据年份查询数据 并进行初始化
        var om = this;
        $(obj).disable();
        var year = this.dv.find('.toolbar .years option:selected').text();
        gf.noPagination(this.pro, this.getParas(year), function (a) {
            $(obj).enable();
            if (a.length > 0) {
                var b = [], c = [];
                b = a[0];
                for (var i = 0; i < b.length; i++) c[i] = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    for (var j = 0; j < b.length; j++) {
                        c[j][i] = f.fix(b[j]);
                    }
                }
                // 构建表头
                a = [], b = [];
                var month_cnt = c[0].length;
                var attach = '';
                if (om.sta_type == 0) attach = '月';
                for (var i = 0; i < month_cnt; i++) {
                    b[i + 1] = f.th(c[0][i] + attach, 'scope="col"');
                }
                b[0] = td('');
                var sthead = f.thead(tr(b.join('')));
                var scope = '';
                for (var i = 1; i < c.length; i++) {
                    scope = i < 4 ? 'row' : '';
                    b[0] = '<th class="' + scope + '">' + om.ah[i - 1] + '</th>';
                    for (var j = 0; j < month_cnt; j++) {
                        b[j + 1] = td(c[i][j]);
                    }
                    a[i - 1] = tr(b.join(''), 'class="' + scope + '"');
                }
                om.otbl.html('<caption>' + year + om.caption + '</caption>' + sthead + f.tbody(a.join('')));
                om.dv_alert.hide();
            } else {
                om.otbl.empty();
                om.dv_alert.show().text(year + '年度，该公司无统计记录');
            }
            om.refresh();
        });
    }
}

var mconways = {
    id: '', // 联系人ID
    dv: null,
    isini: false,
    ulcontacts: null,
    ulways: null,
    dvWayUpdate: null,
    ini: function () {
        var om = this;
        this.isini = true;
        this.dv = $('#dv_conways');
        this.ulcontacts = this.dv.find('.contacts ul');
        this.ulways = this.dv.find('.ways');
        gcontact.ini();
        this.dvWayUpdate = this.dv.find('.wayUpdate');
        this.dv.find('.bttnShowMofiyContact').click(function () {
            gcontact.show_contact(this);
        }).end().find('.bttnAddContact').click(function () {
            gcontact.conid = '';
            gcontact.show_contact(this);
        }).end().find('.bttnAddWay').click(function () {
            $(this).hide();
            om.dvWayUpdate.show();
        });

        this.dvWayUpdate.find('.bttnsave').click(function () {// 更新联系方式
            var a = [];
            om.dvWayUpdate.find(':text,select option:selected').each(function (i) {
                a[i] = $(this).val();
            });
            // 号码要去掉空格
            if (a[3] && om.conid) {
                a[4] = om.id;
                a[5] = ur.user().id;
                a = f.trim_array(a);
                var bttn = $(this).disable();
                gf.callProc('up_co_add_contact_way', a, function () {
                    // 添加到列表框
                    outputMsg("添加联系方式成功");
                    om.searchways();
                    bttn.enable();
                });
            } else {
                alert("号码不能为空，并且要选定联系人"); return;
            }
        });
        //id,name_cn,gender,职务中文,备注,firstname,lastname,titleId,uID
        gf.noPagination('up_co_get_cocontacts', [gcoid], function (a) {
            if (a.length > 0) {
                var ac = [], b = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    if (b[3]) b[1] += '(' + b[3] + ')';
                    a[i] = f.li(b[1], '_id="' + b[0] + '" class="' + b[2] + '"');
                }
                om.ulcontacts.html(a.join('')).find('li').click(function () {
                    om.id = $(this).attr('_id');
                    gcontact.conid = om.id;
                    gways.conid = om.id;
                    $(this).parent().find('.on').removeClass('on').end().end().addClass('on');
                    om.searchways();
                });
            }
        });

        gOption.option(om.dvWayUpdate.find('select'), 'up_option_optContactWayType', []);
    },
    searchways: function () {
        var om = this;
        gf.noPaginationSqlPara('conId=' + this.id, '类型ID asc', 'ID,号码ID,类型ID,CC,AC,号码,类型EN,默认,隐私,uID', 'co.vw联系方式', function (a) {
            if (a.length > 0) {
                var b = [], c = [], d = [];
                var defalut = '';
                var cnt = 0;
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    c[0] = b[3]; c[1] = b[4]; c[2] = b[5];
                    d = [];
                    cnt = 0;
                    for (var j = 0; j < c.length; j++) {
                        if (c[j]) d[cnt++] = c[j];
                    }
                    b[5] = d.join('-');
                    a[i] = '<li class="contactways ' + b[6] + '" _id="' + b[0] + '" numid="' + b[1] + '" uid="' + b[9] + '" ><a href="javascript://" >' + b[5] + '</a></li>';
                }
                om.ulways.html(a.join('')).find('li').click(function () {
                    $(this).parent().find('li.selected').removeClass('selected');
                    $(this).addClass('selected');
                });
            } else o.empty();
        });
    }
}

var mcontact = {
    id: '', // co.contact id
    dv: null,
    olcomments: null,
    ulcontacts: null,
    dv_submit: null,
    isini: false,
    ini: function () {
        var om = this;
        this.dv = $('#dv_contacts');
        this.ulcontacts = this.dv.find('.contacts ul');
        this.olcomments = this.dv.find('.commentlist');
        this.dv_submit = this.dv.find('.submit_form');
        this.dv_submit.find('.bttnsave').click(function () {
            om.update_comment(this);
        });
        this.search();
        this.isini = true;
    },
    search: function () {
        var om = this;
        //id,name_cn,gender,职务中文,备注,firstname,lastname,titleId,uID
        //id,name,gender,职务中文
        gf.noPagination('up_co_get_cocontacts', [gcoid], function (a) {
            if (a.length > 0) {
                var ac = [], b = [];
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    if (b[3]) b[1] += '(' + b[3] + ')';
                    a[i] = f.li(b[1], '_id="' + b[0] + '" class="' + b[2] + '"');
                }
                om.ulcontacts.html(a.join('')).find('li').click(function () {
                    om.id = $(this).attr('_id');
                    $(this).parent().find('.on').removeClass('on').end().end().addClass('on');
                    om.search_comments();
                });
            }
        });
    },
    search_comments: function () { // 联系人评论
        var om = this;
        gf.noPagination('up_co_get_contact_comments', [this.id, ur.user().id, ur.company().id], function (a) {
            //id,body,作者,日期,照片,uID
            if (a.length > 0) {
                var b = [];
                var photo = '';
                for (var i = 0; i < a.length; i++) {
                    b = a[i];
                    photo = b[4];
                    if (!photo) photo = 'default.jpg';
                    photo = '../upload/userphoto/60x60/' + photo;

                    a[i] = ['<li class="comment even thread-even depth-1">',
'<div class="clear"><img title="头像" alt="头像" style="width:32px;height:32px;" src="' + photo + '" class="avatar avatar-32 photo" />',
'<div class="comment_content_wrapper">',
'<div class="comment-author vcard clear"><span class="fn t_bold">' + b[2] + '</span><span class="comment_count">#' + (i + 1).toString() + '</span><span class="comment-meta commentmetadata">' + b[3] + '</span></div>',
'<div class="comment-text"><p>' + b[1] + '</p></div></div></div></li>'].join('');
                }
                om.olcomments.html(a.join(''));
            } else { om.olcomments.empty(); }
        });
    },
    update_comment: function (obj) {
        var om = this;
        var a = [];
        var valid = true;
        var err_msg = '';
        a[0] = '';
        a[1] =this.dv_submit.find('textarea').val();
        a[2] = this.dv_submit.find('.private option:selected').val();
        a[3] = this.id;
        a[4] = ur.user().id;
        if (!this.id) err_msg = '您还未选择联系人';
        if (!a[1]) err_msg = '评论内容不能为空';
        if (this.id && a[1]) {
            $(obj).disable();
            gf.callProc('up_co_update_comment_contact', a, function () {
                om.search_comments();
                $(obj).enable();
                om.dv_submit.find('textarea').val('');
            });
        } else alert(err_msg);
    }
}



