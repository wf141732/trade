///此文件在oe中的顶层中

var onmessage = function (e) {
    var data = e.data;
    if (data.code == 'lg') {
        window.frames[0].frames[0].postMessage({ code: 'lg', data: JSON.stringify(localStorage) }, '*');
    }
};
//监听postMessage消息事件
if (typeof window.addEventListener != 'undefined') {
    window.addEventListener('message', onmessage, false);
} else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent('onmessage', onmessage);
}



