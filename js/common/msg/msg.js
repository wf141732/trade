/// <reference path="../../jquery-1.6.2.js" />
/// <reference path="../../jquery-ui-1.8.10/js/jquery-ui-1.8.10.custom.min.js" />

var msg={
    dv:null,
    shakeTimes:null,
    shakeTimer:null,
    shakeObj:null,
    shakeDelay:500,
    haveMsgCls:'haveMsg',
    textSclDv:null,
    textPgDv:null,
    scollTimes:0,
    scollSpeed:20,//越大越慢
    scollDelay:2000,//每次滚动中间停顿的时间
    scollTimer:null,
    pgShowSpeed:500,//越大越慢
    pgHideSpeed:1000,
    paDelay:1000,//出现后停顿的时间
    isPaging:false,
    msgs:[],
    init:function(){
        var om=this.dv=$('#msgDv');
        this.shakeObj=this.dv.mouseenter(function(){
            om.find('.statisticsDv').effect( 'drop', { direction:'down',mode:'show'}, 'fast');
        }).mouseleave(function(){
            om.find('.statisticsDv').effect( 'drop', { direction:'up',mode:'hide'}, 'fast');
        }).find('.msgBtn');
        this.textSclDv=this.dv.find('.textSclDv');//.mouseenter(this.startScoll);
        this.textPgDv=this.dv.find('.textPgDv');      
    },
    haveMsg:function(){
        var om=msg;
        this.shake(-1,function(){
            om.shakeObj.addClass(om.haveMsgCls);
        });
        this.startScoll(-1);
    },
    scoll:function(){
        var om=msg, dv=om.textSclDv;
        if (dv[0].scrollWidth - dv.scrollLeft() - dv.width() <= 0) {
            om.stopScoll();
            setTimeout(om.startScoll,om.scollDelay);
        }
        else {
            dv.scrollLeft(dv.scrollLeft() + 1);
        }
    },
    startScoll:function(times){
        var om=msg,dv=om.textSclDv;
        om.scollTimes=times||om.scollTimes;
        dv.scrollLeft(0);
        if(om.scollTimes)
        {            
            om.scollTimes--;
            //om.scollTimer= setInterval(om.scoll, om.scollSpeed);
            dv.animate({scrollLeft:dv[0].scrollWidth-dv.width()},dv[0].scrollWidth*om.scollSpeed,'linear',function(){
                dv.animate({scrollLeft:0},dv[0].scrollWidth*om.scollSpeed/2,'easeInOutElastic',function(){setTimeout( om.startScoll,om.scollDelay)})
            });
        }
    },
    stopScoll:function(){
        if(this.scollTimer)
            clearInterval(this.scollTimer);
        this.textDv.stop();
    },
    shake:function(times,callback){
        var obj=this.shakeObj,om=this, oldCls = obj.attr("class") + " ", cls,newCls=this.haveMsgCls;
        if (this.shakeTimer) return;
        this.shakeTimer = setInterval(function () {
            cls = times % 2 ? (oldCls+ newCls) : oldCls;
            obj.attr("class", cls);  
            times--;
            if(!times) {
                om.stopShake();
                callback();
            }      
        }, om.shakeDelay);
    },
    stopShake:function(){
        if (!this.shakeTimer) return;
        clearInterval(this.shakeTimer);
        //this.shakeObj.removeClass(cls);
    },
    paging:function(){
        var om=this, dv = this.textPgDv;
        var sw = dv.next()[0].scrollWidth;
        var width =dv.width();
        var text = dv.next().text(),stext;
    
        var t1p = parseInt(text.length2() * width / sw);
        getText();

        function getText() {
            stext = text.substr2(0, text.length2() > t1p ? t1p : text.length2());
            dv.text(stext);
            dv.effect('slide', { direction: 'down', mode: 'show' }, om.pgShowSpeed, function () {
                setTimeout(function () {
                    dv.effect('slide', { direction: 'up', mode: 'hide' }, om.pgHideSpeed, function () {
                        text = text.substr2(t1p, text.length2());
                        if (text.length > 0)
                            getText();
                        else{
                            text=dv.next().text();//测试
                            getText();//测试
                        }
                    });
                }, om.paDelay);
            })
        }
    }
}

$(function(){
    msg.init();
    msg.haveMsg();
    msg.paging();
})


var msgStore = function (dbname) {
    if (!window.indexedDB) {
        window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
        window.IDBTransaction = window.mozIDBTransaction || webkitIDBTransaction;
        window.IDBKeyRange = window.mozIDBKeyRange || webkitIDBKeyRange;
        window.IDBCursor = window.mozIDBCursor || webkitIDBCursor;
    }
    //创建存储库
    function createObjectStore(db) {
        if (db.objectStoreNames.contains('msg')) {
            db.deleteObjectStore("msg")
        }
        var objectStore = db.createObjectStore("msg", {
            keyPath: "pk",
            autoIncrement: true
        });

        objectStore.createIndex("from", "from", { unique: false });
        objectStore.createIndex("type", "type", { unique: false });
        objectStore.createIndex("date", "date", { unique: false });
    }
    var db = null, dbName = dbname || 'aacMsg',
        request = indexedDB.open(dbName);
    //数据库打开成功
    request.onsuccess = function (e) {
        db = request.result;

        if (db.version != "1.0") {
            var requestVersion = db.setVersion("1.0");
            requestVersion.onerror = function (event) {
                alert(event);
            }
            requestVersion.onsuccess = function (event) {
                createObjectStore(db);
            }
        }
    };
    //数据库打开失败
    request.onerror = function (e) {
        alert("Database error: " + e.target.errorCode);
    };
    //data:{desc,data,type,from,id}
    this.insert = function (data, success, error) {
        var transaction = db.transaction(["msgTs"], IDBTransaction.READ_WRITE);
        var objectStore = transaction.objectStore("msg");

        var requestAdd = objectStore.add(data);
        requestAdd.onerror = error;
        requestAdd.onsuccess = success;
        //requestAdd.onsuccess = function (event) {
        //    showDataByCursor(objectStore);
        //};
    };
    //根据主键删除
    this.delete=function(pk){
        var transaction = db.transaction(["msgTs"], IDBTransaction.READ_WRITE);
	    var objectStore = transaction.objectStore("msg");
	
	    objectStore.get(pk).onsuccess = function(event) {		
		    if (event.target.result) {
			    objectStore.delete(document.getElementById("pk").value);
			    showDataByCursor(objectStore);
		    } 
	    }
    };
    //查询所有记录
    this.select=function(data){
        var transaction = db.transaction(["msgTs"]);
	
	    var objectStore = transaction.objectStore("msg");
	
	    var boundKeyRange = IDBKeyRange.upperBound("Jack", false);

        var data=[];
	   
	    objectStore.index("type").openCursor(boundKeyRange, IDBCursor.PREV_NO_DUPLICATE).onsuccess = function(event) {
		    var cursor = event.target.result;
		
		    if (!cursor) {
                success(data);
			    return;
		    }
		
		    var rowData = cursor.value;
		    
            data.push(rowData);
		    cursor.continue();
	    };
    };
}

//var m = new msg();

String.prototype.length2 = function () {// 返回字符串真实长度，汉字2个字符
    return String(this).replace(/[^\x00-\xff]/g, "ci").length;  // 百度tangram 方法
}

//<!-- 修改substr匹配汉字截取(测试) sina 方法--> 最后一个 this 改成 s
String.prototype.substr2 = function (start, end) { var s = this.replace(/([^\x00-\xff])/g, "\x00$1"); 
return (s.length < end) ? s : s.substring(start, end).replace(/\x00/g, ''); 
}
