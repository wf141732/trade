/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="tangram-pager.js" />
/// <reference path="aacconfig.js" />
/// <reference path="aacgrid-excel.js" />

/*
* v1.0 fan.w 2010 07 20
* 创建 实现基本显示功能
* par的参数有如下属性:
*       +   head:(head必输)标题头,为数组
*       +   detail:(detail非必输)明细,为数组 明细如果不输入的话则按照标题的顺序来填充数据,可以为字符
*           -- fun:执行特殊的函数
*           -- data:传递到函数的参数
*           -- editable:是否可编辑
*       +   parent:(parent必输)将生成的table放到容器中 目前暂定使用ID
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
* v1.1.1 fan.w 2010 07 22
* 将dp拆分
*       +   queryField:(queryField必输)查询的字段
*       +   queryTable:(queryTable必输)查询的试图或表
*       +   queryCondition:(queryCondition必输)查询的默认条件
*       +   queryOrder:(queryOrder必输)查询默认的排序字段
* 增加输出参数
*       +-  tid:(tableID)主表的ID属性
*       +-  currentNum:(currentNum)当前页码
*       +-  pageNum:(pageNum)分页数量
* v1.1.2 fan.w 2010 07 24
* 添加分页 排序
*       +   autoSearch:(autoSearch非必输)打开页面是否执行查询[默认为true]
*       +   orderField:(orderField)排序字段 目前只支持后台排序 排序字段是对应的顺序为h中的顺序 如果为对象 名称是h中的顺序,值是qf的顺序 可以为字符
*       +-  sortType:(sortType)默认排序规则0 desc 1 asc或者直接输入字符 默认desc
* v1.1.3 fan.w 2010 07 26
* 单元格可编辑
*       +   d:
*           --  ed:(contentEditable非必输) true|false
* v1.2.1 wangfan 2010 08 17
* 使用外部数据
*       +   data:(data)外部提供的二维数组数据
* v1.3.1 wangfan 2011 09 06
* 将命名规范化
*       +   queryBefore(非必输) 点击查询之前触发的事件
*       +   queryAfter(非必输) 查询完成后触发的事件
*/
var aac = aac || {};

var f = f || {};
f.btn = function (value, attr) {
    return '<input type=button value=' + value + ' ' + attr + ' />';
}
f.lnk = function (value, attr) {
    return '<a href=# ' + attr + '> ' + value
    + '</a>';
}
f.td = function (value, attobj, col) {
    attobj ? (attobj['readonly'] = 'true') : (attobj = { readonly: 'true' });
    var c = [], s = '';
    for (var i in attobj) {
        c.push(i + '=' + attobj[i]);
    }
    s = '<input value="' + value + '"' + c.join(' ') + ' />';
    s = $(value).html() == null ? s : $(value).attr(attobj)[0].outerHTML;
    return td(s, 'contenteditable = false' + ' col=' + col);
}
aac.grid = function (par) {
    if (par.queryField && !(par.queryField instanceof Array)) par.queryField = par.queryField.split(',');
    //更新的字段,值,条件,更新的主键
    var mUpdateField = [], mUpdateValue = [], mUpdateCondition = [], areaId = (new Date()).getTime(),
    table = $(f.table('', '')),
    tblMain = $(f.tbody('', '')).appendTo(table),
    //掩藏值存放的属性hidden value
        hiddenValue = '_id',
        mClass = par.class || {};
    f.td = f.td || td;
    $.extend(mClass, {
        //表格的样式
        tb: "main5",
        //表格头的样式
        tbh: "header",
        //数据修改过的样式
        dirty: 'dirty',
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
        tid: 'main' + areaId,
        //currentNum当前页码
        currentNum: 1,
        //pageNum分页数量
        pageNum: 30,
        //打开页面是否执行查询
        autoSearch: true,
        //排序规则
        sortType: 'desc'
    });
    /*
    * v1.0 fan.w 2011 07 21 execUserFun
    * 使用传递进来的函数来生成相应的结果
    */
    function execUserFun(fun, a) {
        var returnValue = '';
        if (!fun) returnValue = a[0];
        else {
            if (typeof (fun) === 'function')
                returnValue = fun.apply(null, a);
            else if (typeof (fun) === 'string')
                returnValue = eval(fun + '.apply(null,a)');
        }
        return returnValue;
    }
    /*
    * v1.0 fan.w 2011 09 08
    *  填充复杂的名细
    *  o为detail中每一个单元格的详细描述
    *  a 为行数据
    */
    function complexTd(o, a) {
        var b = [], data = o.data;
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                b.push(a[o.data[i]] ? a[data[i]] : data[i]);
            }
        }
        else
            b.push(a[data] ? a[data] : data);
        return b;
    }
    /*
    * v1.0 fan.w 2011 09 08
    *  填充单元格
    *  detail 为传入的参数中的detail 每一行的数据
    *  trClass 行的样式
    */
    function dataToTd(detail, a) {
        var b = [], o = {}, c = [];
        for (var i = 0; i < detail.length; i++) {
            o = detail[i];
            if (o.fun || o.attr) {
                c = [];
                //                for (var att in o.attr) {
                //                    c.push(att + '=' + o.attr[att]);
                //                }
                b.push(f.td(execUserFun(o.fun, complexTd(o, a)), o.attr, i));
                //b.push(complexTd(o, a));
            }
            else
                b.push(f.td(a[o], '', i));
        }
        return b;
    }
    /*
    * v1.0 fan.w 2011 09 08
    *  将数据填充到行
    *  a 每一行的数据
    *  trClass 行的样式
    */
    function dataToTr(a, trClass) {
        var o = {}, detail = par.detail, b = [], c = [];
        if (detail) {
            c = dataToTd(detail, a);
        }
        //如果无明细的描述 则按照标题来显示
        else {
            for (var i = 0; i < par.head.length; i++) {
                c.push(f.td(a[i], '', i));
            }
        }
        for (var i in par.r) {
            b.push(i + '=' + (a[par.r[i]] ? a[par.r[i]] : par.r[i]));
        }
        return f.tr(c.join(''), 'class=' + trClass + ' ' + b.join(' ') + '_id=' + a[par.updateKey ? par.updateKey[0] : 0]);
    }
    /*
    * v1.0 fan.w 2011 07 20
    *  将单行数据填充到表格中SetDataToTable
    *  tb 为需要填充的table数据集
    *  d 记录填充属性
    */
    function dataToTable(a) {
        var b = [], c = [];
        for (var i = 0; i < a.length; i++) {
            b = a[i];
            c.push(dataToTr(b, mClass.rc[i % mClass.rc.length]));
        }
        // b.push(f.tbody(dataToTable(a)));
        tblMain.html(c.join(""));
        par.queryAfter ? par.queryAfter(tblMain) : null;
    }
    /*
    * v1.0 fan.w 2011 07 24 SortString
    *  得到排序的超连接
    *   + hv(headValue)
    *   + of(orderField)
    *   + i
    */
    function sortString(headValue, orderField, i) {
        var x = orderField.indexOf(i), s = '', p = {};
        if (x > -1) {
            p = orderField[x];
            if (typeof (p) === 'string') s = p;
            else {
                var d = par.detail[p];
                p = par.orderField[x];
                s = p[1] ? p[1] : (d.data ? (d.data[0] ? d.data[0] : d.data) : d);
                s = typeof (s) === 'number' ? par.queryField[s] : s;
            }
            s = f.lnk(headValue, 'value=' + s);
        }
        else
            s = headValue;
        return s;
    }
    /* v1.0 fan.w 2011 07 20
    * 生成数据表格的头SetTableHead
    */
    function createTableHead(head) {
        var a = [], b = [], c = [], orderField = par.orderField, o = {}; //o为排序字段
        if (orderField) {
            for (var i = 0; i < orderField.length; i++) {
                o = orderField[i];
                if (typeof (o) === 'number')
                    b.push(o);
                else
                    b.push(o[0]);
            }
        }
        for (var i = 0; i < head.length; i++) {
            o = head[i];
            if (o.name) {
                //遍历属性
                for (var j in o) {
                    c.push(j + '=' + o[j]);
                }
                a.push(f.th(sortString(o.name, b, i), c.join(' ')));
            }
            else
                a.push(f.th(sortString(o, b, i)));
        }
        return f.tr(a.join(''), 'class=' + mClass.tbh);
    }
    /*
    * fan.w 2011 07 24 SortTable
    * 点击排序
    */
    function sortTable(f) {
        var sortType = par.sortType;
        par.queryOrder = f + ' ' + sortType;
        sortType = (par.sortOrder === 'desc') ? 'asc' : 'desc';
        search();
    }
    /*
    * v1.0 fan.w 2011 07 20
    * 构建显示的table CreateTable
    *     +a(tableData)
    */
    function createTable(a) {
        var b = [];
        b.push(f.thead(createTableHead(par.head)));
        table.attr({ id: par.tid, class: mClass.tb });
        $(b.join('')).insertBefore(tblMain);
        tblMain.edit_dirty();
        if (par.orderField) {
            table.find('thead a').each(function () {
                //$(this).find('a').each(function () {
                var o = $(this);
                o.click(function () {
                    sortTable(o.attr('value'));
                    //})
                });
            })
        }
    }
    /*
    * v1.0 fan.w 2011 07 24 pager
    * 使用百度分页
    */
    var pager = new T.ui.Pager({
        beginPage: 1,
        endPage: 0,
        currentPage: par.cn,
        itemCount: 10,
        ongotopage: function (obj) {
            search(obj.page);
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
    function buttonArea() {
        var b = [], updateField = par.updateField;
        b.push(f.btn('Search', 'id=sh' + areaId));
        if (updateField) b.push(f.btn('更新', 'id=upd' + areaId));
        $('#bta' + areaId).html(f.div(b.join('')));
        $('#sh' + areaId).click(search);
        if (updateField) $('#upd' + areaId).click(update);
    }
    /*
    * v1.0 fan.w 2011 07 24 CreateGrid
    * 创建grid区域
    */
    function createGrid() {
        var dvPager = '', dvButton = '', dvTable = '';
        createTable();
        dvPager = f.div('', 'id=pa' + areaId + ' class=' + mClass.pga);
        dvButton = f.div('', 'id=bta' + areaId + ' class=' + mClass.bta);
        dvTable = f.div('', 'id=ta' + areaId + ' class=' + mClass.tba);
        $('#' + par.parent).html(dvPager + dvButton + dvTable);
        pager.render('pa' + areaId);
        $('#ta' + areaId).append(table);
        if (!par.data) {
            !par.autoSearch || search();
            buttonArea();
        }
        else
            dataToTable(par.data);
    }
    /*
    * v1.0 fan.w 2011 07 21
    * 修改表的数据
    */
    function update() {
        if (mUpdateField.length == 0) {
            for (var i = 0; i < par.updateField.length; i++) {
                mUpdateField.push(typeof (par.updateField[i]) == 'number' ? par.queryField[par.updateField[i]] : par.updateField[i]);
            }
        }
        if (getValue()) {
            showAjaxMsg();
            gf.updateBatch(mUpdateCondition, par.updateTable, mUpdateField, mUpdateValue, function () { hideAjaxMsg(); mUpdateValue = []; mUpdateCondition = []; search(); });
        }
    }
    /*
    * v1.0 fan.w 2011 07 21 GetValue
    * 得到需要修改的值 默认判断所有的值
    */
    function getValue() {
        //行
        var isOK = true, a = [], b = [], om = {};
        mUpdateValue = [];
        table.find('.' + mClass.dirty).each(function () {
            a = [], om = $(this), b = om.find('td');
            mUpdateCondition.push(om.attr('id'));
            if (par.updateValue) {
                for (var i = 0; i < par.updateValue.length; i++) {
                    var tdObj = (par.updateValue[i].data) ? par.updateValue[i].data : par.updateValue[i],
                    value = $(b[tdObj]).find('input');
                    if (!value) value = $(b[tdObj]);
                    isOK = isOK & validate(value, par.updateValue[i]);
                    if (isOK) a.push(value.attr(hiddenValue) ? value.attr(hiddenValue) : value.val());
                }
            }
            else {
                for (var i = 0; i < b.length; i++) {
                    a.push(b[i].find('input').val() || b[i].val());
                }
            }
            if (isOK) mUpdateValue.push(a.concat());
        });
        return isOK;
    }
    /*
    * v1.0 fan.w 2011 07 21 validator
    * 数据校验器,根据结果来做校验
    *   validateObject 需要校验的表格中的值,userFun为定义的对象
    */
    function validate(validateObject, userFun) {
        if (userFun.fun) {
            var s = execUserFun(userFun.fun, [validateObject.val()]),
            tip = userFun.tip ? userFun.tip : s;
            var returnBool = typeof (s) == 'boolean' ? s : false;
            if (!returnBool) {
                validateObject.addClass('error');
                validateObject.attr('title', tip);
            }
            else {
                validateObject.removeClass('error');
                validateObject.attr('title', '');
            }
            return returnBool;
        }
        else
            return true;
    }
    //获取数据 search
    function search(p) {
        showAjaxMsg();
        par.currentNum = (p > 0) ? p : 1;
        var pageNum = par.pageNum, currentNum = par.currentNum,
        d = [par.queryTable, currentNum === 1 ? -1 : currentNum, pageNum, par.queryField.join(','), par.queryOrder, par.queryCondition];
        gf.pagination(d, function (jsn) {
            var r = jsn.OutputValue[0];
            var e = Math.ceil(r / pageNum);
            if (r != -1) pager.update({ endPage: e < 2 ? 0 : (e + 1), currentPage: 1 });
            dataToTable(jsn.OutputTable);
            //om.fRows(jsn.OutputTable, 0);
            hideAjaxMsg();
        });
    }
    createGrid();
    return { tbl: table,
        update: dataToTable,
        getUpdateValue: function () {
            return getValue() ? mUpdateValue : [];
        }
    };
}
/* 
* v1.0 wangfan 2011 09 07
* 将jquery中val和text合并
*/
$.fn.oval = $.fn.val;
$.fn.val = function (o) {
    var om = this, tag = om[0]?om[0].tagName:'';
    return o && om[0]? ((tag === 'INPUT' || tag === 'SELECT') ? om.oval(o) : om.text(o)) : (om.oval() || om.text());
}

//gpck.ini();
window.onload = function () {
    //ajax数据
//        g = aac.grid({
//            head: [{ name: '型号', width: '20%' }, '数量', '建议售价', '厂牌', '封装', '备注', '日期'],
//            //明细如果不输入的话则按照标题的顺序来填充数据{ fun: f.text, data: 4 }
//            detail: [1, { attr: { editable: true }, data: 3 }, { attr: { editable: false }, data: 4 }, 5, { fun: f.text, data: [2, 7, 6, 1] }, { attr: { editable: true }, data: 8 }, { fun: f.dateOnly, data: 9}], //, 
//            parent: 'par',
//            queryTable: 'f.vw存',
//            queryField: 'ID,型号,型号ID,数量,售价,厂牌,pckpins,pckpinsid,备注,日期',
//            queryOrder: 'id desc',
//            queryCondition: '公司ID=17708',
//            row: { _id: 0, pnid: 2 },
//            updateField: [3, 4, 8],
//            updateValue: [{ fun: isNumber, data: 1, tip: '数量必须为数字' }, { fun: isNumber, data: 2, tip: '必须为数字' }, 5],
//            updateTable: '',
//            queryAfter: function (tbl) {
//                gAuto.co($(tbl.find('td[col=5] input')));
//            },
//            orderField: [0, [2, 4], 3], //0，2，3为head中的顺序 4为queryField中的顺序
//            updateKey: [0]
//        });
    //外部数据
    g = aac.grid({
        head: [{ name: '型号', width: '20%' }, '数量', '建议售价', '厂牌', '封装', '备注', '日期'],
        //明细如果不输入的话则按照标题的顺序来填充数据{ fun: f.text, data: 4 }
        detail: [0, 1, { attr: { editable: true }, data: 3 }, { attr: { editable: false }, data: 4 }, { attr: { editable: true }, data: 5 }, { fun: f.text, attr: { editable: true }, data: [2, 7, 6, 1] }, { attr: { editable: true }, data: 8}], //, { fun: f.dateOnly, data: 9}
        parent: 'par',
        queryAfter: function (tbl) {
                gAuto.co($(tbl.find('td[col=4] input')));
            },
        data: [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]
    });
    //g.update([[2, 2, 3,4,5,6]]);
    //grid_excel(g);
    //获取需要更新的值
    g.getUpdateValue();
    $(document).ready(function () {
        $('input:eq(0)').click(function () {
            $(this).position($(this).position());
            //alert($(this).position());
        })
        //$('input:eq(1)').click(function () {
        //    $(this).position(4);
        //})
    })
}