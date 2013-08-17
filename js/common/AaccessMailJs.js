var Host = window.location.protocol + "//" + window.location.host + (window.location.port == "" ? "" : (":" + window.location.port));

var Aaccess =
{
    ajax: function () {
        var par={
            type: "post",
            dataType: "json"
        };
        jQuery.ajax
        ({ 
            type: "post",//par.type,
            dataType:par.dataType,
            url: Host + "/handlers/Mail.ashx",
            data: { OperationCode: par.code, 
                    OperationData: JSON.stringify({ "To": ["hwmfly@qq.com", "susan@access-ic.com"], "BCC": [], "CC": [], "Sender": { "Address": "sales@access-ic.com", "DisplayName": "sales" }, "ParentID": 0, "ServerID": "17572", "Subject": "test,this is subject", "Body": "<p>\n\ttest,this is body.</p>\n" }) },
            beforeSend: function (XMLHttpRequest) {
            },
            success: function (data, textStatus) {
                if (textStatus == "success") {
                    if (data.ISSuccess === 1) 
                        par.success(data);
                    else
                        if (par.error)
                            par.error(data.ErrorMessage);
                }
                else
                    if (par.error)
                        par.error(data.ErrorMessage);
            },

            //complete: function (XMLHttpRequest, textStatus) {
            //if(XMLHttpRequest.responseText
            //HideLoading();
            //},
            error: function (XMLHttpRequest, status) {
                if (par.error)
                    par.error(XMLHttpRequest.responseText);
                //请求出错处理
            }
        })
    }
};
var aac = Aaccess;
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