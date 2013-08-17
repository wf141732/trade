var aac = aac || {};
aac.cam = (function () {
    //request it
    var o = { status: 1, PLAYING: 0, STOPED: 1, PAUSED: 2 }, s = null, tid = null, stoped = false,
        video = document.createElement('video'), cvs = null, ctx = null;

    navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.BlobBuilder_ = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    function draw(v, canvas, width, height) {
        if (v.paused || v.ended || stoped) return false;
        canvas.drawImage(v, 0, 0, width, height);
        tid = setTimeout(draw, 50, v, canvas, width, height);
    }

    function cLog(m) {

    }

    var img = new Image();

    function getImgFromUrl(url) {
        //从url地址中获取图像
        img.src = url;
        img.width = cvs.width;
        img.height = cvs.height;
        img.onload = function (e) {
            //图像载入后停止摄像头
            o.stopCam();
            ctx.drawImage(e.target, 0, 0, cvs.width, cvs.height);
        }
    }

    o.getImg = function (e) {
        // 将文件加载到canvas
        if (!e) {
            //如果无图像则清空画布
            ctx.clearRect(0, 0, cvs.width, cvs.height); return
        };
        if (typeof (e) == "string") {
            getImgFromUrl(e);
            return;
        }
        var files = e.target.files || e.dataTransfer.files;

        var reader = new FileReader();
        reader.onload = function (e) {
            getImgFromUrl(e.target.result);
        }
        reader.readAsDataURL(files[0]);

        return this;
    }

    o.ini = function (obj) {
        cvs = document.getElementById(obj.canvas);
        ctx = cvs.getContext('2d');
    }
    function gotStream(stream) {
        s = stream;

        var url = window.URL || window.webkitURL;
        $(video).on("play", function () {
            tID = setTimeout(draw, 20, video, ctx, cvs.width, cvs.height)
        });
        try {
            video.src = url ? url.createObjectURL(stream) : stream;
            video.loop = video.muted = true;
            video.load();
            video.play();
        } catch (h) {
            cLog(h)
        }
        video.onerror = function () {
            stream.stop();
            streamError();
        };
    }

    function noStream() {
        cLog("无摄像头支持");
    }
    function streamError() {
        cLog("摄像头异常");
    }

    function uploadComplete(evt) {
        alert(evt.target.responseText);
    }
    /*用于处理上传失败的函数（上传失败时）*/
    function uploadFailed(evt) {
        alert("文件上传时发生了一个错误.");
    }
    /*用户处理上传取消的函数（正在上传时取消即可触发）*/
    function uploadCanceled(evt) {
        alert("文件上传已被取消.");
    }

    /*用于处理上传进度的函数*/
    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total),
                pn = document.getElementById('progressNumber');
            if (pn) {
                pn.innerHTML = percentComplete.toString() + '%';
                pn.value = percentComplete / 100;
            }
        }
        else {
            document.getElementById('progressNumber').innerHTML = '无法计算进度';
        }
    }

    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        bb = new window.BlobBuilder_();
        bb.append(ab);
        return bb.getBlob(mimeString);
    }

    o.upload = function (success) {
        var data = cvs.toDataURL('image/jpeg', 1.0),
            newblob = dataURItoBlob(data),
            formdata = new FormData(),
            xhr = new XMLHttpRequest();
        formdata.append('file', newblob);
        formdata.append('type', 'pic');
        formdata.append('filename', new Date().getTime() + ".jpg");

        /*绑定处理事件*/
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", function (e) { success ? success(e.target.responseText) : uploadComplete(e) }, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/handlers/upload.ashx");
        xhr.send(formdata);

    }
    //启动照相
    o.startCam = function () {
        if (s == null) {
            try {
                navigator.getUserMedia_({ video: true, audio: false }, function (stream) { gotStream(stream) }, noStream)
            } catch (i) {
                try {
                    navigator.getUserMedia_("video", gotStream, noStream)
                } catch (i) {
                    cLog(i)
                }
            }
            stoped = false;
        }
        else {
            if (video.paused) video.play();
        }
        o.status = 0;
    }
    //停止照相
    o.stopCam = function () {
        if (s != null) {
            s.stop();
            s = null;
        }
        if (tid != null) {
            clearTimeout(tid);
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            tid = null;
        }
        stoped = true;
        o.status = 1;
    }
    //暂停照相头
    o.parseCam = function () {
        if (video.paused) {
            video.play();
            c.status = 0;
        }
        else {
            video.pause();
            o.status = 2;
        }
    }

    return o;
} ());

$(function () {
//    aac.cam.ini({ canvas: 'c' });
//    $('#cam').click(function () {
//        if (aac.cam.status == 0) {
//            aac.cam.parseCam();
//        }
//        else {
//            aac.cam.startCam();
//        }
//    });
//    $('#upfile').change(aac.cam.getImg);
//    $('#up').click(function () {
//        aac.cam.upload();
//    });
})


function binaryToBlob(data) {
    var bb = new window.BlobBuilder_();
    window.URL_ = window.URL || window.webkitURL;
    var url_creator = window.URL_.createBlobURL || window.URL_.createObjectURL;

    var arr = new Uint8Array(data);
    
    bb.append(arr.buffer);
    return url_creator(bb.getBlob());
};

