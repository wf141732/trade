// Copyright (c) 2009, Baidu Inc. All rights reserved.
// 
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http:// tangram.baidu.com/license.html
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 /**
 * @namespace T Tangram七巧板
 * @name T
 * @version 1.5.2.2
*/

/**
 * 声明baidu包
 * @author: allstar, erik, meizz, berg
 */
var T,
    baidu = T = baidu || {version: "1.5.2.2"}; 

//提出guid，防止在与老版本Tangram混用时
//在下一行错误的修改window[undefined]
baidu.guid = "$BAIDU$";

//Tangram可能被放在闭包中
//一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
baidu.$$ = window[baidu.guid] = window[baidu.guid] || {global:{}};

/**
 * 对XMLHttpRequest请求的封装
 * @namespace baidu.ajax
 */
baidu.ajax = baidu.ajax || {};

/**
 * 对方法的操作，解决内存泄露问题
 * @namespace baidu.fn
 */
baidu.fn = baidu.fn || {};


/**
 * 这是一个空函数，用于需要排除函数作用域链干扰的情况.
 * @author rocy
 * @name baidu.fn.blank
 * @function
 * @grammar baidu.fn.blank()
 * @meta standard
 * @return {Function} 一个空函数
 * @version 1.3.3
 */
baidu.fn.blank = function () {};


/**
 * 发送一个ajax请求
 * @author: allstar, erik, berg
 * @name baidu.ajax.request
 * @function
 * @grammar baidu.ajax.request(url[, options])
 * @param {string} 	url 发送请求的url
 * @param {Object} 	options 发送请求的选项参数
 * @config {String} 	[method] 			请求发送的类型。默认为GET
 * @config {Boolean}  [async] 			是否异步请求。默认为true（异步）
 * @config {String} 	[data] 				需要发送的数据。如果是GET请求的话，不需要这个属性
 * @config {Object} 	[headers] 			要设置的http request header
 * @config {number}   [timeout]       超时时间，单位ms
 * @config {String} 	[username] 			用户名
 * @config {String} 	[password] 			密码
 * @config {Function} [onsuccess] 		请求成功时触发，function(XMLHttpRequest xhr, string responseText)。
 * @config {Function} [onfailure] 		请求失败时触发，function(XMLHttpRequest xhr)。
 * @config {Function} [onbeforerequest]	发送请求之前触发，function(XMLHttpRequest xhr)。
 * @config {Function} [on{STATUS_CODE}] 	当请求为相应状态码时触发的事件，如on302、on404、on500，function(XMLHttpRequest xhr)。3XX的状态码浏览器无法获取，4xx的，可能因为未知问题导致获取失败。
 * @config {Boolean}  [noCache] 			是否需要缓存，默认为false（缓存），1.1.1起支持。
 * 
 * @meta standard
 * @see baidu.ajax.get,baidu.ajax.post,baidu.ajax.form
 *             
 * @returns {XMLHttpRequest} 发送请求的XMLHttpRequest对象
 */
baidu.ajax.request = function (url, opt_options) {
    var options     = opt_options || {},
        data        = options.data || "",
        async       = !(options.async === false),
        username    = options.username || "",
        password    = options.password || "",
        method      = (options.method || "GET").toUpperCase(),
        headers     = options.headers || {},
        // 基本的逻辑来自lili同学提供的patch
        timeout     = options.timeout || 0,
        eventHandlers = {},
        tick, key, xhr;

    /**
     * readyState发生变更时调用
     * 
     * @ignore
     */
    function stateChangeHandler() {
        if (xhr.readyState == 4) {
            try {
                var stat = xhr.status;
            } catch (ex) {
                // 在请求时，如果网络中断，Firefox会无法取得status
                fire('failure');
                return;
            }
            
            fire(stat);
            
            // http://www.never-online.net/blog/article.asp?id=261
            // case 12002: // Server timeout      
            // case 12029: // dropped connections
            // case 12030: // dropped connections
            // case 12031: // dropped connections
            // case 12152: // closed by server
            // case 13030: // status and statusText are unavailable
            
            // IE error sometimes returns 1223 when it 
            // should be 204, so treat it as success
            if ((stat >= 200 && stat < 300)
                || stat == 304
                || stat == 1223) {
                fire('success');
            } else {
                fire('failure');
            }
            
            /*
             * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
             * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
             * function maybe still be called after it is deleted. The theory is that the
             * callback is cached somewhere. Setting it to null or an empty function does
             * seem to work properly, though.
             * 
             * On IE, there are two problems: Setting onreadystatechange to null (as
             * opposed to an empty function) sometimes throws an exception. With
             * particular (rare) versions of jscript.dll, setting onreadystatechange from
             * within onreadystatechange causes a crash. Setting it from within a timeout
             * fixes this bug (see issue 1610).
             * 
             * End result: *always* set onreadystatechange to an empty function (never to
             * null). Never set onreadystatechange from within onreadystatechange (always
             * in a setTimeout()).
             */
            window.setTimeout(
                function() {
                    // 避免内存泄露.
                    // 由new Function改成不含此作用域链的 baidu.fn.blank 函数,
                    // 以避免作用域链带来的隐性循环引用导致的IE下内存泄露. By rocy 2011-01-05 .
                    xhr.onreadystatechange = baidu.fn.blank;
                    if (async) {
                        xhr = null;
                    }
                }, 0);
        }
    }
    
    /**
     * 获取XMLHttpRequest对象
     * 
     * @ignore
     * @return {XMLHttpRequest} XMLHttpRequest对象
     */
    function getXHR() {
        if (window.ActiveXObject) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }
    
    /**
     * 触发事件
     * 
     * @ignore
     * @param {String} type 事件类型
     */
    function fire(type) {
        type = 'on' + type;
        var handler = eventHandlers[type],
            globelHandler = baidu.ajax[type];
        
        // 不对事件类型进行验证
        if (handler) {
            if (tick) {
              clearTimeout(tick);
            }

            if (type != 'onsuccess') {
                handler(xhr);
            } else {
                //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
                try {
                    xhr.responseText;
                } catch(error) {
                    return handler(xhr);
                }
                handler(xhr, xhr.responseText);
            }
        } else if (globelHandler) {
            //onsuccess不支持全局事件
            if (type == 'onsuccess') {
                return;
            }
            globelHandler(xhr);
        }
    }
    
    
    for (key in options) {
        // 将options参数中的事件参数复制到eventHandlers对象中
        // 这里复制所有options的成员，eventHandlers有冗余
        // 但是不会产生任何影响，并且代码紧凑
        eventHandlers[key] = options[key];
    }
    
    headers['X-Requested-With'] = 'XMLHttpRequest';
    
    
    try {
        xhr = getXHR();
        
        if (method == 'GET') {
            if (data) {
                url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
                data = null;
            }
            if(options['noCache'])
                url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + (+ new Date) + '=1';
        }
        
        if (username) {
            xhr.open(method, url, async, username, password);
        } else {
            xhr.open(method, url, async);
        }
        
        if (async) {
            xhr.onreadystatechange = stateChangeHandler;
        }
        
        // 在open之后再进行http请求头设定
        // FIXME 是否需要添加; charset=UTF-8呢
        if (method == 'POST') {
            xhr.setRequestHeader("Content-Type",
                (headers['Content-Type'] || "application/x-www-form-urlencoded"));
        }
        
        for (key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        
        fire('beforerequest');

        if (timeout) {
          tick = setTimeout(function(){
            xhr.onreadystatechange = baidu.fn.blank;
            xhr.abort();
            fire("timeout");
          }, timeout);
        }
        xhr.send(data);
        
        if (!async) {
            stateChangeHandler();
        }
    } catch (ex) {
        fire('failure');
    }
    
    return xhr;
};

/**
 * 操作url的方法
 * @namespace baidu.url
 */
baidu.url = baidu.url || {};


/**
 * 对字符串进行%#&+=以及和\s匹配的所有字符进行url转义
 * @name baidu.url.escapeSymbol
 * @function
 * @grammar baidu.url.escapeSymbol(source)
 * @param {string} source 需要转义的字符串.
 * @return {string} 转义之后的字符串.
 * @remark
 * 用于get请求转义。在服务器只接受gbk，并且页面是gbk编码时，可以经过本转义后直接发get请求。
 *
 * @return {string} 转义后的字符串
 */
baidu.url.escapeSymbol = function(source) {
    
    //TODO: 之前使用\s来匹配任意空白符
    //发现在ie下无法匹配中文全角空格和纵向指标符\v，所以改\s为\f\r\n\t\v以及中文全角空格和英文空格
    //但是由于ie本身不支持纵向指标符\v,故去掉对其的匹配，保证各浏览器下效果一致
    return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function(all) {
        return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
    });
};


/**
 * 将一个表单用ajax方式提交
 * @name baidu.ajax.form
 * @function
 * @grammar baidu.ajax.form(form[, options])
 * @param {HTMLFormElement} form             需要提交的表单元素
 * @param {Object} 	[options] 					发送请求的选项参数
 * @config {Boolean} [async] 			是否异步请求。默认为true（异步）
 * @config {String} 	[username] 			用户名
 * @config {String} 	[password] 			密码
 * @config {Object} 	[headers] 			要设置的http request header
 * @config {Function} [replacer] 			对参数值特殊处理的函数,replacer(string value, string key)
 * @config {Function} [onbeforerequest] 	发送请求之前触发，function(XMLHttpRequest xhr)。
 * @config {Function} [onsuccess] 		请求成功时触发，function(XMLHttpRequest xhr, string responseText)。
 * @config {Function} [onfailure] 		请求失败时触发，function(XMLHttpRequest xhr)。
 * @config {Function} [on{STATUS_CODE}] 	当请求为相应状态码时触发的事件，如on302、on404、on500，function(XMLHttpRequest xhr)。3XX的状态码浏览器无法获取，4xx的，可能因为未知问题导致获取失败。
	
 * @see baidu.ajax.request
 *             
 * @returns {XMLHttpRequest} 发送请求的XMLHttpRequest对象
 */
baidu.ajax.form = function (form, options) {
    options = options || {};
    var elements    = form.elements,
        len         = elements.length,
        method      = form.getAttribute('method'),
        url         = form.getAttribute('action'),
        replacer    = options.replacer || function (value, name) {
            return value;
        },
        sendOptions = {},
        data = [],
        i, item, itemType, itemName, itemValue, 
        opts, oi, oLen, oItem;
        
    /**
     * 向缓冲区添加参数数据
     * @private
     */
    function addData(name, value) {
        data.push(name + '=' + value);
    }
    
    // 复制发送参数选项对象
    for (i in options) {
        if (options.hasOwnProperty(i)) {
            sendOptions[i] = options[i];
        }
    }
    
    for (i = 0; i < len; i++) {
        item = elements[i];
        itemName = item.name;
        
        // 处理：可用并包含表单name的表单项
        if (!item.disabled && itemName) {
            itemType = item.type;
            itemValue = baidu.url.escapeSymbol(item.value);
        
            switch (itemType) {
            // radio和checkbox被选中时，拼装queryString数据
            case 'radio':
            case 'checkbox':
                if (!item.checked) {
                    break;
                }
                
            // 默认类型，拼装queryString数据
            case 'textarea':
            case 'text':
            case 'password':
            case 'hidden':
            case 'select-one':
                addData(itemName, replacer(itemValue, itemName));
                break;
                
            // 多行选中select，拼装所有选中的数据
            case 'select-multiple':
                opts = item.options;
                oLen = opts.length;
                for (oi = 0; oi < oLen; oi++) {
                    oItem = opts[oi];
                    if (oItem.selected) {
                        addData(itemName, replacer(oItem.value, itemName));
                    }
                }
                break;
            }
        }
    }
    
    // 完善发送请求的参数选项
    sendOptions.data = data.join('&');
    sendOptions.method = form.getAttribute('method') || 'GET';
    
    // 发送请求
    return baidu.ajax.request(url, sendOptions);
};

/**
 * 发送一个get请求
 * @name baidu.ajax.get
 * @function
 * @grammar baidu.ajax.get(url[, onsuccess])
 * @param {string} 	url 		发送请求的url地址
 * @param {Function} [onsuccess] 请求成功之后的回调函数，function(XMLHttpRequest xhr, string responseText)
 * @meta standard
 * @see baidu.ajax.post,baidu.ajax.request
 *             
 * @returns {XMLHttpRequest} 	发送请求的XMLHttpRequest对象
 */
baidu.ajax.get = function (url, onsuccess) {
    return baidu.ajax.request(url, {'onsuccess': onsuccess});
};

/**
 * 发送一个post请求
 * @name baidu.ajax.post
 * @function
 * @grammar baidu.ajax.post(url, data[, onsuccess])
 * @param {string} 	url 		发送请求的url地址
 * @param {string} 	data 		发送的数据
 * @param {Function} [onsuccess] 请求成功之后的回调函数，function(XMLHttpRequest xhr, string responseText)
 * @meta standard
 * @see baidu.ajax.get,baidu.ajax.request
 *             
 * @returns {XMLHttpRequest} 	发送请求的XMLHttpRequest对象
 */
baidu.ajax.post = function (url, data, onsuccess) {
    return baidu.ajax.request(
        url, 
        {
            'onsuccess': onsuccess,
            'method': 'POST',
            'data': data
        }
    );
};


/**
 * 操作json对象的方法
 * @namespace baidu.json
 */
baidu.json = baidu.json || {};


/**
 * 将字符串解析成json对象。注：不会自动祛除空格
 * @name baidu.json.parse
 * @function
 * @grammar baidu.json.parse(data)
 * @param {string} source 需要解析的字符串
 * @remark
 * 该方法的实现与ecma-262第五版中规定的JSON.parse不同，暂时只支持传入一个参数。后续会进行功能丰富。
 * @meta standard
 * @see baidu.json.stringify,baidu.json.decode
 *             
 * @returns {JSON} 解析结果json对象
 */
baidu.json.parse = function (data) {
    //2010/12/09：更新至不使用原生parse，不检测用户输入是否正确
    return (new Function("return (" + data + ")"))();
};


/**
 * 将字符串解析成json对象，为过时接口，今后会被baidu.json.parse代替
 * @name baidu.json.decode
 * @function
 * @grammar baidu.json.decode(source)
 * @param {string} source 需要解析的字符串
 * @meta out
 * @see baidu.json.encode,baidu.json.parse
 *             
 * @returns {JSON} 解析结果json对象
 */
baidu.json.decode = baidu.json.parse;

/**
 * 将json对象序列化
 * @name baidu.json.stringify
 * @function
 * @grammar baidu.json.stringify(value)
 * @param {JSON} value 需要序列化的json对象
 * @remark
 * 该方法的实现与ecma-262第五版中规定的JSON.stringify不同，暂时只支持传入一个参数。后续会进行功能丰富。
 * @meta standard
 * @see baidu.json.parse,baidu.json.encode
 *             
 * @returns {string} 序列化后的字符串
 */
baidu.json.stringify = (function () {
    /**
     * 字符串处理时需要转义的字符表
     * @private
     */
    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };
    
    /**
     * 字符串序列化
     * @private
     */
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(
                /["\\\x00-\x1f]/g, 
                function (match) {
                    var c = escapeMap[match];
                    if (c) {
                        return c;
                    }
                    c = match.charCodeAt();
                    return "\\u00" 
                            + Math.floor(c / 16).toString(16) 
                            + (c % 16).toString(16);
                });
        }
        return '"' + source + '"';
    }
    
    /**
     * 数组序列化
     * @private
     */
    function encodeArray(source) {
        var result = ["["], 
            l = source.length,
            preComma, i, item;
            
        for (i = 0; i < l; i++) {
            item = source[i];
            
            switch (typeof item) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if(preComma) {
                    result.push(',');
                }
                result.push(baidu.json.stringify(item));
                preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }
    
    /**
     * 处理日期序列化时的补零
     * @private
     */
    function pad(source) {
        return source < 10 ? '0' + source : source;
    }
    
    /**
     * 日期序列化
     * @private
     */
    function encodeDate(source){
        return '"' + source.getFullYear() + "-" 
                + pad(source.getMonth() + 1) + "-" 
                + pad(source.getDate()) + "T" 
                + pad(source.getHours()) + ":" 
                + pad(source.getMinutes()) + ":" 
                + pad(source.getSeconds()) + '"';
    }
    
    return function (value) {
        switch (typeof value) {
        case 'undefined':
            return 'undefined';
            
        case 'number':
            return isFinite(value) ? String(value) : "null";
            
        case 'string':
            return encodeString(value);
            
        case 'boolean':
            return String(value);
            
        default:
            if (value === null) {
                return 'null';
            } else if (value instanceof Array) {
                return encodeArray(value);
            } else if (value instanceof Date) {
                return encodeDate(value);
            } else {
                var result = ['{'],
                    encode = baidu.json.stringify,
                    preComma,
                    item;
                    
                for (var key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        item = value[key];
                        switch (typeof item) {
                        case 'undefined':
                        case 'unknown':
                        case 'function':
                            break;
                        default:
                            if (preComma) {
                                result.push(',');
                            }
                            preComma = 1;
                            result.push(encode(key) + ':' + encode(item));
                        }
                    }
                }
                result.push('}');
                return result.join('');
            }
        }
    };
})();


/**
 * 将json对象序列化，为过时接口，今后会被baidu.json.stringify代替
 * @name baidu.json.encode
 * @function
 * @grammar baidu.json.encode(value)
 * @param {JSON} value 需要序列化的json对象
 * @meta out
 * @see baidu.json.decode,baidu.json.stringify
 *             
 * @returns {string} 序列化后的字符串
 */
baidu.json.encode = baidu.json.stringify;



/**
 * 提供json,xml,html的基本处理方法
 * @namespace baidu.parser
 */
baidu.parser = baidu.parser || {};

baidu.parser.type = {
    'XML': 'Xml',
    'JSON': 'Json',
    'HTML': 'Html'
};


/**
 * 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 * @namespace baidu.lang
 */
baidu.lang = baidu.lang || {};

/**
 * 返回一个当前页面的唯一标识字符串。
 * @name baidu.lang.guid
 * @function
 * @grammar baidu.lang.guid()
 * @version 1.1.1
 * @meta standard
 *             
 * @returns {String} 当前页面的唯一标识字符串
 */
baidu.lang.guid = function() {
    return "TANGRAM$" + baidu.$$._counter ++;
};

//不直接使用window，可以提高3倍左右性能
baidu.$$._counter = baidu.$$._counter || 1;


// 20111129	meizz	去除 _counter.toString(36) 这步运算，节约计算量

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name 	baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param 	{string}	guid	对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */
baidu.lang.Class = function() {
    this.guid = baidu.lang.guid();

    !this.__decontrolled && (baidu.$$._instances[this.guid] = this);
};

baidu.$$._instances = baidu.$$._instances || {};

/**
 * 释放对象所持有的资源，主要是自定义事件。
 * @name dispose
 * @grammar obj.dispose()
 * TODO: 将_listeners中绑定的事件剔除掉
 */
baidu.lang.Class.prototype.dispose = function(){
    delete baidu.$$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for(var property in this){
        typeof this[property] != "function" && delete this[property];
    }
    this.disposed = true;   // 20100716
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * 20111219 meizz 为支持老版本的className属性，以后统一改成 __type
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this.__type || this._className || "Object") + "]";
};

/**
 * 按唯一标识guid字符串取得实例对象
 *
 * @param   {String}    guid
 * @return  {object}            实例对象
 */
 window["baiduInstance"] = function(guid) {
     return baidu.$$._instances[guid];
 }

//  2011.11.23  meizz   添加 baiduInstance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 baidu.lang._instances 模块，由统一的global机制完成；

/**
 * 判断目标参数是否string类型或String对象
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

// 声明快捷方法
baidu.isString = baidu.lang.isString;


/**
 * 自定义的事件对象。
 * @class
 * @name 	baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param 	{Object} [target]触发事件的对象
 * @meta standard
 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
 * @meta standard
 * @see baidu.lang.Class
 */
baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};
 
/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.dispatchEvent(event, options)
 * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
 * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
myobj.onMyEvent = function(){}<br>
myobj.addEventListener("onMyEvent", function(){});
 */
baidu.lang.Class.prototype.fire =
baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
    baidu.lang.isString(event) && (event = new baidu.lang.Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, n, me = this, t = me.__listeners, p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf("on") && (p = "on" + p);

    typeof me[p] == "function" && me[p].apply(me, arguments);

    if (typeof t[p] == "object") {
        for (i=0, n=t[p].length; i<n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.addEventListener(type, handler[, key])
 * @param   {string}   type         自定义事件的名称
 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
 * @return  {Function}              将用户注入的监听函数返回，以便移除事件监听，特别适用于匿名函数。
 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
baidu.lang.Class.prototype.on =
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners;

    type.indexOf("on") && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) return handler;
    };

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key == "string" && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码

/**
 * 创建一个类，包括创造类的构造器、继承基类Class
 * @name baidu.lang.createClass
 * @function
 * @grammar baidu.lang.createClass(constructor[, options])
 * @param {Function} constructor 类的构造器函数
 * @param {Object} [options] 
                
 * @config {string} [type] 类名
 * @config {Function} [superClass] 父类，默认为baidu.lang.Class
 * @version 1.2
 * @remark
 * 
            使用createClass能方便的创建一个带有继承关系的类。同时会为返回的类对象添加extend方法，使用obj.extend({});可以方便的扩展原型链上的方法和属性
        
 * @see baidu.lang.Class,baidu.lang.inherits
 *             
 * @returns {Object} 一个类对象
 */

baidu.lang.createClass = /**@function*/function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class;

    // 创建新类的真构造器函数
    var fn = function(){
        var me = this;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me.__decontrolled = true);

        // 继承父类的构造器
        superClass.apply(me, arguments);

        // 全局配置
        for (i in fn.options) me[i] = fn.options[i];

        constructor.apply(me, arguments);

        for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    // [TODO delete 2013] 放置全局配置，这个全局配置可以直接写到类里面
    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    // 20111122 原className参数改名为type
    var type = options.className || options.type;
    typeof type == "string" && (fp.__type = type);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上







baidu.parser.Parser = baidu.parser.Parser || (function(){

    /**
     * 提供数据处理的基类方法
     * @class
     * @public
     * @param {Object} options
     * @config {String} method ‘GET’，'POST' 默认为GET
     * @config {Function} onload
     */
    return baidu.lang.createClass(function(options){
   
        var me = this,
            options = options || {};

        me._method = options.method || me._method;
        me.onload = options.onload || baidu.fn.blank;

    },{
        type: 'baidu.parser.Parser'
    }).extend({
        /**
         *  @lends baidu.parser.Parser.prototype
         */

        _dom: null,

        _isLoad: false,

        _method: 'GET',

        /**
         * 将通过xpath query的数据缓存起来
         * @private
        */
        _queryData: {},

        _type: '',
   
        /**
         * 加载数据，支持xml，json，html
         * @public
         * @param {String} dataString
        */
        load: function(dataString){
            var me = this;
           
            if(typeof dataString == 'undefined'){
                return;
            }

            me._isLoad = false;
            if(me._parser(dataString)){
                me._queryData = {};
                me._isLoad = true;
                me.dispatchEvent('onload');
            }
        },
   
        /**
         * 加载数据片段
         * @public
         * @param {String} fileSrc
         * @param {String} method 'GET','POST'
         * @param {String} data
         */
        loadUrl: function(fileSrc, method, data){
            var me = this,
                fileSrc = fileSrc || '',
                method = method || me._method,
                data = data || '',
                onsuccess = function(xhr, responseText){
                    if(me._parser(responseText)){
                        me._isLoad = true;
                        me._queryData = {};
                        me.dispatchEvent('onload');
                    }
                };
            
            me._isLoad = false;
            method == 'GET' ? baidu.ajax.get(fileSrc, onsuccess) : baidu.ajax.post(fileSrc, data, onsuccess);
        },

        /**
         * 通过xpath获取所需要的数据，支持html,json,xml
         * @public
         * @param {String} path
         * @param {Boolean} 是否使用之前的缓存
         * @return {Object}
        */
        query: function(path, cache){
            var me = this,
                path = path || '/',
                cache = !(cache === false),
                result = [];
    
            if(!me._isLoad)
                return result;

            if(cache && me._queryData[path]) return me._queryData[path];

            result = me._query(path);
            me._queryData[path] = result;

            return result;
        },
  
        /**
         * @private
         * @param {String} path
         * @return {Array}
         */
        _query: function(path){
            return [];
        },
        
        /**
         * 转换数据
         * @private
         * @param {String|Object} str
         * @return {Boolean}
         */
        _parser: function(){
            return false;         
        },

        /**
         * 获取数据跟节点
         * @public
         * @return {HTMLElement}
        */
        getRoot: function(){
            return this._dom;        
        }, 

        /**
         * 获取parser的类型
         * @return {baidu.parser.type}
         */
        getType: function(){
            return this._type;         
        }
    });
})();


/**
 * 操作原生对象的方法
 * @namespace baidu.object
 */
baidu.object = baidu.object || {};


/**
 * 将源对象的所有属性拷贝到目标对象中
 * @author erik
 * @name baidu.object.extend
 * @function
 * @grammar baidu.object.extend(target, source)
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @see baidu.array.merge
 * @remark
 * 
1.目标对象中，与源对象key相同的成员将会被覆盖。<br>
2.源对象的prototype成员不会拷贝。
		
 * @shortcut extend
 * @meta standard
 *             
 * @returns {Object} 目标对象
 */
baidu.extend =
baidu.object.extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    
    return target;
};


/*
   JPath 1.0.5 - json equivalent to xpath
   Copyright (C) 2009-2011  Bryan English <bryan at bluelinecity dot com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

   Usage:      
      var jpath = new JPath( myjsonobj );

      var somevalue = jpath.$('book/title').json;  //results in title
         //or
      var somevalue = jpath.query('book/title');   //results in title

   Supported XPath-like Syntax:
      /tagname
      //tagname
      tagname
      * wildcard
      [] predicates
      operators ( >=, ==, <= )
      array selection
      .. 	         
      *
      and, or
      nodename[0]
      nodename[last()]
      nodename[position()]
      nodename[last()-1]
      nodename[somenode > 3]/node
      nodename[count() > 3]/node

   Tested With:
      Firefox 2-3, IE 6-7
   
   Update Log:
      1.0.1 - Bugfix for zero-based element selection
      1.0.2 - Bugfix for IE not handling eval() and returning a function
      1.0.3 - Bugfix added support for underscore and dash in query() function
                  Bugfix improper use of Array.concat which was flattening arrays
                  Added support for single equal sign in query() function
                  Added support for count() xpath function
                  Added support for and, or boolean expression in predicate blocks
                  Added support for global selector $$ and //
                  Added support for wildcard (*) selector support 
	  1.0.4 - Changed to MIT license
	  1.0.5 - Bugfix for greedy regexp
*/

function JPath( json, parent )
{ 
    this.json = json; 
    this._parent = parent; 
}

JPath.prototype = {

   /*
      Property: json
      Copy of current json segment to operate on
   */
   json: null,
   
   /*
      Property: parent
      Parent json object, null if root.
   */
   parent: null,

   /*
      Method: $
      Performs a find query on the current jpath object.

      Parameters:
        str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */
   '$': function ( str )
   {
      var result = null;
      var working = this;
      
      if ( this.json && str !== null )
      {
         switch ( typeof(str) )
         {
            case 'function':
               result = this.f(str).json;
            break;

            case 'number':
               result = this.json[str] || null;
            break;

            case 'string':
               var names = str.split('/');     

               //foreach slash delimited node name//
               for ( var i=0; i<names.length ; i++ )
               {
                  var name = new RegExp('^' + names[i].replace(/\*/g,'.*') + '$');                  
                  var isArray = (working.json instanceof Array);
                  var a = new Array();
                  
                  //foreach working node property//
                  for ( var p in working.json )
                  {
                     if ( typeof( working.json[p] ) != 'function' )
                     {
                        if ( isArray && (arguments.callee.caller != this.$$) )
                        {
                           a = a.concat( this.findAllByRegExp( name, working.json[p] ) );
                        }
                        else if ( name.test(p) )
                        {                        
                           a.push( working.json[p] );
                        }
                     }                  
                  }

                  working = new JPath( ( a.length==0 ? null : ( ( a.length == 1) ? a[0] : a ) ), working );
               }

               return working;
            break;
         }   
      }
      
      return new JPath( result, this );
   },

   /*
      Method: $$
      Performs a global, recursive find query on the current jpath object.

      Parameters:
        str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */   
   '$$': function( str )
   {   
      var r = this.$(str,true).json;
      var arr = new Array();
      
      if ( r instanceof Array ) 
         arr = arr.concat(r); 
      else if ( r !== null )
         arr.push(r);
         
      for ( var p in this.json )
      {
         if ( typeof( this.json[p] ) == 'object' )
         {
            arr = arr.concat( new JPath( this.json[p], this ).$$(str).json );
         }
      }
      
      return new JPath( arr, this );
   },
   
   /*
      Method: findAllByRegExp
      Looks through a list of an object properties using a regular expression

      Parameters:
         re - regular expression, to use to search with
         obj - object, the object to search through

      Returns:
         array - resulting properties
   */
   findAllByRegExp: function( re, obj )
   {
      var a = new Array();
   
      for ( var p in obj )
      {
         if ( obj instanceof Array )
         {
            a = a.concat( this.findAllByRegExp( re, obj[p] ) );
         }
         else if ( typeof( obj[p] ) != 'function' && re.test(p) )
         {
            a.push( obj[p] );
         }
      }

      return a;
   },

   /*
      Method: query (beta)
      Performs a find query on the current jpath object using a single string similar to xpath. This method
      is currently expirimental.

      Parameters:
        str - string, full xpath-like query to perform on the current object.

      Return:
        mixed - Returns the resulting json value after performing find query.

   */
   query: function( str )
   {
      var re = {
         " and ":" && ",
         " or ":" || ",
         "([\\#\\*\\@a-z\\_][\\*a-z0-9_\\-]*)(?=(?:\\s|$|\\[|\\]|\\/))" : "\$('$1').",
         "\\[([0-9])+\\]" : "\$($1).",
         "\\.\\." : "parent().",
         "\/\/" : "$",
         "(^|\\[|\\s)\\/" : "$1root().",
         "\\/" : '',
         "([^\\=\\>\\<\\!])\\=([^\\=])" : '$1==$2',
         "\\[" : "$(function(j){ with(j){return(",
         "\\]" : ");}}).",
         "\\(\\.":'(',
         "(\\.|\\])(?!\\$|\\p)":"$1json",
         "count\\(([^\\)]+)\\)":"count('$1')"
      };

      //save quoted strings//
      var quotes = /(\'|\")([^\1]*?)\1/;
      var saves = new Array();
      while ( quotes.test(str) )
      {
         saves.push( str.match(quotes)[2] ); 
         str = str.replace(quotes,'%'+ (saves.length-1) +'%');
      }

      for ( var e in re )
      {
         str = str.replace( new RegExp(e,'ig'), re[e] );
      }
      //alert('this.' + str.replace(/\%(\d+)\%/g,'saves[$1]') + ";");
      return eval('this.' + str.replace(/\%(\d+)\%/g,'saves[$1]') + ";");
   },

   /*
      Method: f
      Performs the equivilant to an xpath predicate eval on the current nodeset.

      Parameters:
        f - function, an iterator function that is executed for every json node and is expected to return a boolean
        value which determines if that particular node is selected. Alternativly you can submit a string which will be
        inserted into a prepared function.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */
   f: function ( iterator )
   {
      var a = new Array();

      if ( typeof(iterator) == 'string' )
      {
         eval('iterator = function(j){with(j){return('+ iterator +');}}');
      }

      for ( var p in this.json )
      {
         var j = new JPath(this.json[p], this);
         j.index = p;
         if ( iterator( j ) )
         {
            a.push( this.json[p] );
         }
      }

      return new JPath( a, this );
   },

   /*
      Method: parent
      Returns the parent jpath object or itself if its the root node

      Return:
        jpath - Returns the parent jpath object or itself if its the root node

   */
   parent: function()
   {
      return ( (this._parent) ? this._parent : this );
   },

   /*
      Method: position
      Returns the index position of the current node. Only valid within a function or predicate

      Return:
        int - array index position of this json object.
   */
   position: function()
   {
      return this.index;
   },

   /*
      Method: last
      Returns true if this is the last node in the nodeset. Only valid within a function or predicate

      Return:
        booean - Returns true if this is the last node in the nodeset
   */
   last: function()
   {
      return (this.index == (this._parent.json.length-1));
   },

   /*
      Method: count
      Returns the count of child nodes in the current node

      Parameters:
         string - optional node name to count, defaults to all
      
      Return:
        booean - Returns number of child nodes found
   */
   count: function(n)
   {
      var found = this.$( n || '*').json;         
      return ( found ? ( found instanceof Array ? found.length : 1 ) : 0 );
   },

   /*
      Method: root
      Returns the root jpath object.

      Return:
        jpath - The top level, root jpath object.
   */
   root: function ()
   {
      return ( this._parent ? this._parent.root() : this );
   }

};



baidu.parser.Json = baidu.parser.Json || (function(){

    /**
     * JSON操作解析器
     * @public
     * @class
     */
    return function(options){
        
        var parser = new baidu.parser.Parser(options);
        parser._type = baidu.parser.type.JSON;

        baidu.extend(parser, {
       
            _jPath: null,

           /**
            * 转换数据
            * @private
            * @param {String|Object} JSON
            * @return {Boolean}
            */
            _parser: function(JSON){
                var me = this;

                if(baidu.lang.isString(JSON)){

                    try{
                        JSON = baidu.json.parse(JSON);
                    }catch(e){
                        return false;
                    }   
                }

                me._jPath = new JPath(JSON);
                me._dom = me._jPath.root();
                return true;
            },

            /**
             * 使用JPath获取数据并返回
             * @public
             * @param {String} Path
             * @return {Array}
             */
            _query: function(JPath){
                var me = this;
                return me._jPath ? me._jPath.query(JPath) : [];
            }

        });
        return parser;
    };
})();
;T.undope=true;