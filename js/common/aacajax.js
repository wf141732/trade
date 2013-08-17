var Host = window.location.protocol + "//" + window.location.host + (window.location.port == "" ? "" : (":" + window.location.port));

var aac =
{
    ajax: function (par) {
        $.extend(par, {
            type: 'post',
            dataType: 'json',
            error: function (m) { console.log(m); }
        });
        jQuery.ajax
        ({
            type: par.type,
            dataType: par.dataType,
            url: Host + '/handlers/' + par.url,
            data: { OperationCode: par.code, OperationData: JSON.stringify(par.data) },
            beforeSend: function (XMLHttpRequest) {
            },
            success: function (data, textStatus) {
                if (textStatus == "success") {
                    //if (data.ISSuccess === 1)
                    if (data.error_response) {
                        par.error(data.error_response.sub_msg)
                    }
                    else {
                        par.success(data);
                    }
                    //else
                    //   if (par.error)
                    //       par.error(data.ErrorMessage);
                }
                else
                    if (par.error)
                        par.error(data.ErrorMessage);
            },

//            complete: function (XMLHttpRequest, textStatus) {
//                console.log(XMLHttpRequest.responseText);
//                if (XMLHttpRequest.responseText)
//                { }
//            },
            error: function (XMLHttpRequest, status) {
                if (par.error)
                    par.error(XMLHttpRequest.responseText);
                //请求出错处理
            }
        })
    }
};
/*
* v1.0 fan.w 2011 07 24
* 找到数组中相同元素的位置
*/
//Array.property.indexOf = function (v) {
//    var r = -1;
//    for (var i = 0; i < this.length; i++) {
//        if (this[i] == v) {
//            r = i;
//            break;
//        }
//    }
//    return r;
//}
//Array.property.lastOf = function (v) {
//    var r = -1;
//    for (var i = this.length-1; i >=0; i--) {
//        if (this[i] == v) {
//            r = i;
//            break;
//        }
//    }
//    return r;
//}