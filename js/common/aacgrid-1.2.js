/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="tangram-pager.js" />
/// <reference path="AaccessJs.js" />
/*
* v1.0 fan.w 2010 07 20
* 创建 实现基本显示功能
* par的参数有如下属性:
*       +   h:(head必输)标题头,为数组
*       +   d:(detail非必输)明细,为数组 明细如果不输入的话则按照标题的顺序来填充数据,可以为字符
*           -- fun:执行特殊的函数
*           -- data:传递到函数的参数
*       +   p:(parent必输)将生成的table放到容器中 目前暂定使用ID
*       +   c:(class非必输)样式
*       +   r:(row非必输)行属性
*       +   cd:(code非必输)通过code来获取数据
*       .. dp:(dataPar废弃,与cd互斥)获取数据的数组,暂时需要,采用cd的话可废弃
* v1.1 fan.w 2010 07 21
* 增加更新的功能
*       +   uf:(updateField非必输)更新的字段 如果为数字,对应的是参数qf的顺序 如果为字符则为字段集合
*       +   uv:(updateValue非必输)更新的值 对应的是参数h当中的顺序
*       +   uk:(updateKey更新时必输)更新的条件 如果为数字,对应的是参数qf的顺序 可为{名称,值}集合 暂时使用ID
*       +   ut:(updateTable更新时必输)更新的表
* v1.11 fan.w 2010 07 22
* 将dp拆分
*       +   qf:(queryField必输)查询的字段
*       +   qt:(queryTable必输)查询的试图或表
*       +   qc:(queryCondition必输)查询的默认条件
*       +   qo:(queryOrder必输)查询默认的排序字段
* 增加输出参数
*       +-  tid:(tableID)主表的ID属性
*       +-  cn:(currentNum)当前页码
*       +-  pn:(pageNum)分页数量
* v1.12 fan.w 2010 07 24
* 添加分页 排序
*       +   as:(autoSearch非必输)打开页面是否执行查询[默认为true]
*       +   of:(orderField)排序字段 目前只支持后台排序 排序字段是对应的顺序为h中的顺序 如果为对象 名称是h中的顺序,值是qf的顺序 可以为字符
*       +-  st:(sortType)默认排序规则0 desc 1 asc或者直接输入字符 默认desc
* v1.13 fan.w 2010 07 26
* 单元格可编辑
*       +   d:
*           --  ed:(contentEditable非必输) true|false
* v1.2.1 wangfan 2010 08 17
* 使用外部数据
*       +   dt:(data)外部提供的二维数组数据
*/
f.btn = function (value, attr) {
    return '<input type=button value=' + value + ' ' + attr + ' />';
}
f.a = function (value, attr) {
    return '<a href=# ' + attr + '> ' + value
    +'</a>';
}
var aac = aac || {};

//$.extend(aac, {});
aac.grid = function (par) {
    var cl = par.c ? par.c : {};
    if (par.qf && !(par.qf instanceof Array)) par.qf = par.qf.split(',');
    //掩藏值存放的属性hidden value
    var hv = '_id';
    //更新的字段,值,条件,更新的主键
    var uf = [], uv = [], uc = [], aid = (new Date()).getTime();
    $.extend(cl, {
        //表格的样式
        tb: "main5",
        //表格头的样式
        tbh: "header",
        //数据修改过的样式
        dt: 'dirty',
        //按钮区域的样式
        bta: 'gridBta',
        //分页区域的样式
        pga: 'gridPga',
        //表格区域的样式
        tba: 'gridTba',
        //隔行换色 rowcolor
        rc: ['row1', 'row2']
    });
    $.extend(par, {
        //tableID表的ID属性
        tid: 'main' + aid,
        //currentNum当前页码
        cn: 1,
        //pageNum分页数量
        pn: 10,
        //打开页面是否执行查询
        as: true,
        //排序规则
        st: 'desc'
    });
    /*
    * v1.0 fan.w 2011 07 21 FunFill
    * 使用传递进来的函数来生成相应的结果
    */
    function ff(fun, ar) {
        var r;
        if (!fun) r = ar[0];
        else {
            if (typeof (fun) == 'function')
                r = fun.apply(null, ar);
            else if (typeof (fun) == 'string')
                r = eval(fun + '.apply(null,ar)');
        }
        return r;
    }
    /*
    * v1.0 fan.w 2011 07 20
    *  将单行数据填充到表格中SetDataToTable
    *  tb 为需要填充的table数据集
    *  d 记录填充属性
    */
    function sdtt(tb, d) {
        var t = []; //需要返回的table的html
        for (var m = 0; m < tb.length; m++) {
            var a = tb[m], ac = []; //a为行数据 ac为行html
            if (d) {
                for (var i = 0; i < d.length; i++) {
                    var di = d[i], p = []; //di为属性 da为需要传递到fun的参数
                    if (di.fun || di.ed) {
                        if (di.data instanceof Array) {
                            for (var j = 0; j < di.data.length; j++) {
                                p.push(a[di.data[j]] ? a[di.data[j]] : di.data[j]);
                            }
                        }
                        else
                            p.push(a[di.data] ? a[di.data] : di.data);
                        ac.push(td(ff(di.fun, p), di.ed ? 'contenteditable=true' : ''));
                    }
                    else
                        ac.push(td(a[di]));
                }
            }
            //如果无明细的描述 则按照标题来显示
            else {
                for (var i = 0; i < par.h.length; i++) {
                    ac.push(td(a[i]));
                }
            }
            var r = [];
            for (var k in par.r) {
                r.push(k + '=' + (a[par.r[k]]?a[par.r[k]]:par.r[k]));
            }
            t.push(f.tr(ac.join(''), 'class=' + cl.rc[m % cl.rc.length] + ' ' + r.join(' ') + ' id=' + a[par.uk[0]]));
        }
        return t.join("");
    }
    /*
    * v1.0 fan.w 2011 07 24 SortString
    *  得到排序的超连接
    *   + hv(headValue)
    *   + of(orderField)
    *   + i
    */
    function ss(hv, of, i) {
        var x = of.indexOf(i), s = '', v = '';
        if (x > -1) {
            var p = par.of[x];
            if (typeof (p) == 'string') v = p;
            else {
                var d = par.d[p];
                v = p[1] ? p[1] : (d.data ? (d.data[0] ? d.data[0] : d.data) : d);
                v = typeof (v) == 'number' ? par.qf[v] : v;
            }
            s = f.a(hv, 'value=' + v);
        }
        else
            s = hv;
        return s;
    }
    /* v1.0 fan.w 2011 07 20
    * 生成数据表格的头SetTableHead
    */
    function sth(h) {
        var th = [], o = []; //o为排序字段
        if (par.of) {
            for (var l = 0; l < par.of.length; l++) {
                var m = par.of[l];
                if (typeof (m) == 'number')
                    o.push(m);
                else
                    o.push(m[0]);
            }
        }
        for (var i = 0; i < h.length; i++) {
            var hi = h[i], p = [];
            if (hi.name) {
                //遍历属性
                for (var k in hi) {
                    p.push(k + '=' + hi[k]);
                }
                th.push(f.th(ss(hi.name, o, i), p.join(' ')));
            }
            else
                th.push(f.th(ss(hi, o, i)));
        }
        return f.tr(th.join(''), 'class=' + cl.tbh);
    }
    /*
    * fan.w 2011 07 24 SortTable
    * 点击排序
    */
    function st(f) {
        par.qo = f + ' ' + par.st;
        par.st = par.st == 'desc' ? 'asc' : 'desc';
        sh();
    }
    /*
    * v1.0 fan.w 2011 07 20
    * 构建显示的table CreateTable
    *     +tbd(tableData)
    */
    function ct(tbd) {
        var tb = [];
        tb.push(f.thead(sth(par.h)));
        tb.push(f.tbody(sdtt(tbd, par.d)));
        $('#ta' + aid).html(f.table(tb.join(''), 'id=' + par.tid + ' aid=' + aid + ' class=' + cl.tb));
        $('#' + par.tid + ' tbody').edit_dirty();
        if (par.of) {
            $('#' + par.tid + ' thead tr th').each(function () {
                $(this).find('a').each(function () {
                    var o = $(this);
                    o.click(function () {
                        st(o.attr('value'));
                    })
                });
            })
        }
    }
    /*
    * v1.0 fan.w 2011 07 24 pager
    * 使用百度分页
    */
    pg = new T.ui.Pager({
        beginPage: 1,
        endPage: 0,
        currentPage: par.cn,
        itemCount: 10,
        ongotopage: function (obj) {
            sh(obj.page);
        },
        element: "pagerBox",
        tplLabel: "#{page}",
        autoRender: false,
        leftItemCount: 2
    });
    /*
    * v1.0 fan.w 2011 07 21 buttonArea
    * 构建按钮区域
    */
    function bta() {
        var b = [];
        b.push(f.btn('Search', 'id=sh' + aid));
        if (par.uf) b.push(f.btn('更新', 'id=upd' + aid));
        $('#bta' + aid).html(f.div(b.join('')));
        $('#sh' + aid).click(sh);
        if (par.uf) $('#upd' + aid).click(upd);
    }
    /*
    * v1.0 fan.w 2011 07 24 CreateGrid
    * 创建grid区域
    */
    function cg() {
        var p = '', b = '', t = '';
        if (!par.dt) {
            //pageArea
            p = f.div('', 'id=pa' + aid + ' class=' + cl.pga);
            //buttonArea
            b = f.div('', 'id=bta' + aid + ' class=' + cl.bta);
            //tableArea
            t = f.div('', 'id=ta' + aid + ' class=' + cl.tba);
            $('#' + par.p).html(p + b + t);
            bta();
            pg.render('pa' + aid);
            if (par.as) sh();
        }
        else {
            //tableArea
            t = f.div('', 'id=ta' + aid + ' class=' + cl.tba);
            $('#' + par.p).html(t);
            ct(par.dt);
        }
    }
    /*
    * v1.0 fan.w 2011 07 21
    * 修改表的数据
    */
    function upd() {
        if (uf.length == 0) {
            for (var i = 0; i < par.uf.length; i++) {
                uf.push(typeof (par.uf[i]) == 'number' ? par.qf[par.uf[i]] : par.uf[i]);
            }
        }
        if (gv()) {
            showAjaxMsg();
            gf.updateBatch(uc, par.ut, uf, uv, function () { hideAjaxMsg(); uv = []; uc = []; sh(); });
        }
    }
    /*
    * v1.0 fan.w 2011 07 21 GetValue
    * 得到需要修改的值 默认判断所有的值
    */
    function gv() {
        //行
        var uOK = true, ro = [], obj = {};
        $('table[aid=' + aid + '] .' + cl.dt).each(function () {
            ro = [], obj = $(this);
            uc.push(obj.attr('id'));
            for (var i = 0; i < par.uv.length; i++) {
                var rn = (par.uv[i].data) ? par.uv[i].data : par.uv[i];
                var rv = $(obj.find('td')[rn]).find('input');
                if (!rv) rv = $(obj.find('td')[rn]);
                uOK = uOK & vl(rv, par.uv[i]);
                if (uOK) ro.push(rv.attr(hv) ? rv.attr(hv) : rv.val());
            }
            if (uOK) uv.push(ro.concat());
        });
        return uOK;
    }
    /*
    * v1.0 fan.w 2011 07 21 validator
    * 数据校验器,根据结果来做校验
    *   ov 需要校验的表格中的值,uff为定义的对象
    */
    function vl(ov, uff) {
        if (uff.fun) {
            var re = ff(uff.fun, [ov.val() == '' ? ov.text() : ov.val()]);
            var t = uff.tip ? uff.tip : re;
            var r = typeof (re) == 'boolean' ? re : false;
            if (!r) {
                ov.addClass('error');
                ov.attr('title', t);
            }
            else {
                ov.removeClass('error');
                ov.attr('title', '');
            }
            return r;
        }
        else
            return true;
    }
    //获取数据 search
    function sh(p) {
        showAjaxMsg();
        par.cn = (p > 0) ? p : 1;
        var d = [par.qt, par.cn == 1 ? -1 : par.cn, par.pn, par.qf.join(','), par.qo, par.qc];
        gf.pagination(d, function (jsn) {
            var r = jsn.OutputValue[0];
            var e = Math.ceil(r / par.pn);
            if (r != -1) pg.update({ endPage: e < 2 ? 0 : (e + 1), currentPage: 1 });
            ct(jsn.OutputTable);
            //om.fRows(jsn.OutputTable, 0);
            hideAjaxMsg();
        });
    }
    cg();
}

/*
gpck.ini();
window.onload = function () {
    aac.Grid({
        h: [{name:'型号',width:'20%'}, '数量', '建议售价', '厂牌', '封装', '备注', '日期'],
        //明细如果不输入的话则按照标题的顺序来填充数据
        d: [1, { fun: f.text, data: 3 }, { fun: f.text, data: 4 }, 5, { fun: gpck.fpck, data: [2, 7, 6, 1] }, { fun: f.text, data: 8 }, { fun: f.date, data: 9}],
        p: 'par',
        qt: 'f.vw存',
        qf: 'ID,型号,型号ID,数量,售价,厂牌,pckpins,pckpinsid,备注,日期',
        qo: 'id desc',
        qc: '公司ID=17708',
        r: { _id: 0, pnid: 2 },
        uf: [3, 4, 8],
        uv: [{ fun: isNumber, data: 1, tip: '数量必须为数字' }, { fun: isNumber, data: 2, tip: '必须为数字' }, 5],
        ut: '',
        of: [0, [2, 1], 3],
        uk: [0]
    });
}
*/