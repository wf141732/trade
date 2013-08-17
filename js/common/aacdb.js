/// <reference path="jquery-1.4.1.js" />
/// <reference path="../jquery.aac.js" />

var aac = aac ? aac : {};
aac.db = {
    aF: ['ID', '型号', '数量', '进价', '售价', '批号', '厂牌', 'pckpins', '备注', '日期', '型号ID', '芯片状态ID'],
    af_icompany: ['ID', 'shortname', 'py', 'name','ptid', 'isCus', 'isSu'],
    icontact_fields: 'conid,nickname,py,gender,avatar,company,ismember,igroupid,coid,cc,ac,mainnum,phonetype,isrecent',
    tbl: 'instock',
    dbo: null,
    db: function (par) {
        par = par ? par : {};
        $.extend(par, {
            size: 5, // 单位M
            name: 'aac',
            ver: '1.0'
        });
        return openDatabase(par.name, par.ver, par.name, par.size * 1024 * 1024);
    },
    query: function (pn, callback) {
        if (pn.indexOf('%') > -1) {
            if (pn.length > 2) this._query(pn, callback);
        } else {
            this._query(pn, callback);
        }
    },
    _query: function (pn, callback) {
        var om = this;
        var a = []; r = [];
        if (!this.dbo) this.dbo = this.db();
        var s = 'select ' + this.aF.join(',') + ' from ' + this.tbl + ' where 型号 like \'' + pn + '%\'';
        this.dbo.transaction(function (tx) {
            tx.executeSql(s, [], function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    r = [];
                    for (var j = 0; j < om.aF.length; j++) r.push(data.rows.item(i)[om.aF[j]]);
                    a.push(r);
                }
                if ($.isFunction(callback)) callback(a);
            });
        });
    },
    query_icontact_recent: function (callback) {
        var aF = [], av = [];
        aF.push("(isrecent=r_r)");
        av = ['1'];
        this._query_icontact(aF, av, callback);
    },
    query_icontact_bykey: function (key, ismember, callback) {
        var aF = [], av = [];
        aF.push("(py like 'r_r%' or nickname like 'r_r%')");
        aF.push('ismember=r_r');
        av = [$.trim(key), ismember];
        this._query_icontact(aF, av, callback);
    },
    query_icontact_byco: function (coid, callback) {
        var aF = [], av = [];
        aF.push('coid=r_r');
        av.push(coid);
        this._query_icontact(aF, av, callback);
    },
    query_icompany: function (key, isCus, isSu, callback) {
        var om = this;
        var a = []; r = [];
        if (!this.dbo) this.dbo = this.db();
        var aF = [], av = [];
        aF.push("py like 'r_r%'");
        aF.push("isCus='r_r'");
        aF.push("isSu='r_r'");
        av.push(key);
        av.push(isCus);
        av.push(isSu);
        var s = 'select ' + this.af_icompany.join(',') + ' from icompany where ' + getWhere_root(aF, av);
        this.dbo.transaction(function (tx) {
            tx.executeSql(s, [], function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    r = [];
                    for (var j = 0; j < om.af_icompany.length; j++) r.push(data.rows.item(i)[om.af_icompany[j]]);
                    a.push(r);
                }
                if ($.isFunction(callback)) callback(a);
            });
        });
    },
    _query_icontact: function (aF, av, callback) {
        var om = this;
        var a = []; r = [];
        if (!this.dbo) this.dbo = this.db();
        var af = this.icontact_fields.split(',');
        var s = 'select ' + this.icontact_fields + ' from icontact where ' + getWhere_root(aF, av);
        this.dbo.transaction(function (tx) {
            tx.executeSql(s, [], function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    r = [];
                    for (var j = 0; j < af.length; j++) r.push(data.rows.item(i)[af[j]]);
                    a.push(r);
                }
                if ($.isFunction(callback)) callback(a);
            });
        });
    },
    sync_icompany: function (callback) {
        var om = this;
        this.dbo = this.db();
        gf.log('正在下载..');
        gf.noPagination('up_co_get_icompanyForSync', [ur.company().id], function (a) {
            gf.log('下载完毕,正在导入本地数据库..');
            var v = [];
            var sfields = om.af_icompany.join(',');
            for (var i = 0; i < om.af_icompany.length; i++) v.push('?');
            var s = 'INSERT INTO icompany (' + sfields + ') VALUES (' + v.join(',') + ')';
            om.dbo.transaction(function (tx) { tx.executeSql('delete from icompany'); });
            om.dbo.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS  icompany(' + sfields + ')');
                for (var i = 0; i < a.length; i++) tx.executeSql(s, a[i]);
                gf.log('同步完毕！');
                if ($.isFunction(callback)) callback();
            });
        });
    },
    sync_icontact: function (callback) {
        var om = this;
        this.dbo = this.db();
        gf.log('正在下载..');
        gf.noPagination('up_co_get_icontactsForSync', [ur.user().id], function (a) {
            gf.log('下载完毕,正在导入本地数据库..');
            var v = [];
            var af = om.icontact_fields.split(',');
            for (var i = 0; i < af.length; i++) v.push('?');
            var s = 'INSERT INTO icontact (' + om.icontact_fields + ') VALUES (' + v.join(',') + ')';
            om.dbo.transaction(function (tx) { tx.executeSql('delete from icontact'); });
            om.dbo.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS  icontact(' + om.icontact_fields + ')');
                for (var i = 0; i < a.length; i++) tx.executeSql(s, a[i]);
                gf.log('同步完毕！');
                if ($.isFunction(callback)) callback();
            });
        });
    },
    sync: function (obj) {
        var om = this;
        var sf = this.aF.join(',');
        this.dbo = this.db();
        $(obj).text('正在下载..').disable();
        gf.noPagination('up_excel_getInStock', [ur.company().id], function (a) {
            $(obj).text('下载完毕,正在导入本地数据库..')
            var v = [];
            for (var j = 0; j < om.aF.length; j++) v.push('?');
            var s = 'INSERT INTO ' + om.tbl + ' (' + sf + ') VALUES (' + v.join(',') + ')';
            om.dbo.transaction(function (tx) { tx.executeSql('delete from ' + om.tbl); });
            om.dbo.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS ' + om.tbl + ' (' + sf + ')');
                tx.executeSql('CREATE INDEX IF NOT EXISTS ' + om.tbl + '_idx ON ' + om.tbl + ' (' + om.aF[1] + ')');
                for (var i = 0; i < a.length; i++) tx.executeSql(s, a[i]);
                $(obj).text('同步完毕!')
            });
        }, G.con_type.qs);
    }
}


