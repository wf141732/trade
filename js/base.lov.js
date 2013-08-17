/// <reference path="jquery-1.8.0.js" />
/// <reference path="base.js" />
/// <reference path="jquery-ui-1.9.2.custom.js" />

var agent = agent || {lov:null}, user = user || {};
agent.lov=agent.lov||{};

agent.productSingleLov = (function () {
    var o = $.extend({}, gobj, { dvId: 'dvProductSingle', inputs: [] }), callback = null,
    ini = function () {
        if (!o.dv) {
            o.preIni();
            o.dv.find('button[name=query]').click(function () { search(); });
            base.categoryStore.fillCmb(function (a) {
                gOption.foption(o.dv.find('#q_ps_category'), a);
                if (o.dv.find('tbody tr').size() === 0)
                    search();
            });
            o.dv.find('tbody tr').live('click', function () {
                var p = {}, tr = $(this), tds = tr.find('td');
                p.productId = tr.attr('data-productId');
                p.storeProductId = tr.attr('data-id');
                p.lineId = tr.attr('data-lineId');
                p.maxQty = tds.eq(4).text();
                p.maxPrice = tr.attr('data-price');
                p.uom = tr.attr('data-uom');
                p.uomId = tr.attr('data-uomId');
                p.orderNum = tds.eq(1).text();
                p.productName = tds.eq(1).text();
                if (callback) {
                    callback(p);
                    o.dv.modal('hide');
                }
            })
        }
    },
    where = function () {
        return '1=1';
    },
    search = function () {
        if (!$('#q_ps_category').val()) return;
        gf.query('base.productQueryLov', [ur.user().agentId, ur.user().id, $('#q_ps_category').val(), where()], function (a) {
            var c = [], d = [];
            for (var i = 0, b = []; b = a[i]; i++) {
                c = [];
                c.push(dom.td(b[1]));
                c.push(dom.td(b[2]));
                c.push(dom.td(b[3]));
                c.push(dom.td(f.priceLabel(b[4]))); //price
                c.push(dom.td(b[5]));
                d.push(dom.tr(c.join(''), 'data-productId="' + b[0] + '" data-id="' + b[6] +
                                     '" data-price="' + b[8] + '" data-uomId="' + b[9] + '" data-uom="' + b[10] + '"'));
            }
            o.dv.find('tbody').html(d.join(''));
            o.searchend(a.length);
        });
    };
    o.show = function (callbk) {
        ini();
        callback = callbk;
        search();
        o.dv.modal({ backdrop: false });
    };
    return o;
})()

agent.lov.userForSms = (function () {
    var o = $.extend({}, gobj, gpagination, {
        dvId: 'dvUserForSmsLov', ttbl: 'member.users',
        fields: 'id,NAME,mobile,street,role', ps: 10000
    }),
        callback = null,
        ini = function () {
            if (!o.dv) {
                o.preIni();
                o.dv.find('.result-header').find('[name=query]').click(function () { o.search() });
            }
        };
     o.where = function () {
         var inputs = o.dv.find('.modal-header').find('input,select'),
             type = inputs.eq(0).val(), role = [], S = base.STATIC, a = [], aF = [];
            if (type == 'member')
            {
                role = [base.memberTypeValue()];
            }
            else if (type == 'gift')
            {
                role = [S.ROLE_GIFT];
            }
            else if (type == 'sysuser')
            {
                role = [S.ROLE_ADMIN, S.ROLE_BUYER, S.ROLE_SALER, S.ROLE_MANAGER];
            }
            aF.push('agentId=r_r');
            aF.push("name like 'r_r%'");
            aF.push("mobile like 'r_r%'");
            aF.push("role in (r_r)");
            aF.push("mobile is not null and mobile !=''");
            a.push(ur.user().agentId);

            a.push(inputs.eq(1).val());
            a.push(inputs.eq(2).val());
            a.push(role.join(','));
            a.push('1');
            return f.getWhere_root(aF, a);
     };
     o.fdata = function (a) {
         var c = [], b = [];
         b[0] = '系统用户'; b[1] = '系统用户'; b[5] = '系统用户'; b[6] = '系统用户';
         b[10] = '其它用户'; b[11] = '会员'; b[12] = '会员';
         c.push(dom.td('<input type="checkbox" />'));
         c.push(dom.td(b[a[4]]));
         c.push(dom.td(a[1]));
         c.push(dom.td(a[2]));
         c.push(dom.td(a[3]));
         return dom.tr(c.join(""), 'data-id="' + a[0] + '"');
     };
    o.show = function (callbk) {
        ini();
        callback = callbk;
        o.dv.modal({ backdrop: false });
    };
    
    return o;
})()