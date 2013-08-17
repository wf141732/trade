/// <reference path="../jquery-1.3.2-vsdoc2.js" />
/// <reference path="../jquery.aac.js" />
var mcomment = {
    relateid: '', // 关联ID 如客户的 coid 厂牌的 mfgid
    type: '1', // 1客户 2厂牌 3封装
    id: '', // co.comment ID
    pid: '', // parent id
    root_ref_id: '', // 跟引用ID
    dv: null,
    dv_reply: null,
    bttnUpdate: null,
    ullst: null, //评论列表
    cmbPrivate: null,
    isini: false, // 指示是否已经初始化
    ini: function () {
        var om = this;
        this.dv = $('#dv_comment');
        this.dv_reply = $('#dv_reply');
        this.dv.find('.bttnsave').click(function () { om.update(); });
        this.ullst = this.dv.find('.lst');
        this.cmbPrivate = this.dv.find('select.private');
        this.dv_reply.find('.close').click(function () { om.dv_reply.hide(); });
        $('#txtcontent').ckeditor(
    {
        toolbar:
    [
    ['Source', 'Preview'],
    ['Bold', 'Italic', 'Underline', 'Strike'],
    ['NumberedList', 'BulletedList'],
    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'Link'],
    ['HorizontalRule', 'FontSize'],
    ['TextColor', 'BGColor', 'Maximize']
], width: 630
    });
        this.dv_reply.find('.bttnsave').click(function () { // 回复评论
            var a = [];
            a[0] = om.type;
            a[1] = '';
            a[2] = $("#txtReply").val(); // 评论
            a[3] = om.relateid; //mfgid
            a[4] = om.pid; // $("#cmtRplBlock").data('pid'); //引用
            a[5] = om.root_ref_id; // $("#cmtRplBlock").data('root_ref_id'); //根引用
            if (a[5] == '-1') a[5] = a[4];
            a[6] = om.cmbPrivate.val();
            a[7] = ur.user().id; //作者
            gf.callProc('up_comment_update', a, function () {
                om.dv_reply.fadeOut('slow').appendTo('body');
                om.search();
            });
        });
        this.search();
        this.isini = true;
    },
    search: function () {
        var om = this;
        gf.noPagination('up_comment_get', [this.type, this.relateid, ur.user().id, ur.company().id], function (a) {
            if (a.length > 0) {
                var aid = [], b = [], c = [];
                var o;
                var cnt = 0;
                for (var i = 0; i < a.length; i++) {
                    o = new comment(a[i]);
                    b[o.id] = o;
                }

                for (var itm in b) {
                    if (b[itm].r_id == '-1') c[cnt++] = f.li(fOne(b[itm].data, '') + getOne(b[itm], b));
                }
                om.ullst.html(c.join(''));
            }
        });
        function getOne(o, b) {
            var a = [];
            var i = 0;
            var ref = '';
            for (var itm in b) {
                if (b[itm].r_root_id == o.id) {
                    if (b[itm].r_id == o.id) {
                        ref = '';
                    } else {
                        var c = b[b[itm].r_id].data;
                        ref = '<blockquote><span><em>引用内容</em>' + c[4] + ' ' + c[5] + '</span>' + c[3] + '..</blockquote>';
                    }
                    a[i++] = f.li(fOne(b[itm].data, ref));
                }
            }
            return '<ul class="lst ccommentlist">' + a.join('') + '</ul>';
        }

        function fOne(a, ref_data) {
            //id,引用ID,根引用ID,body,作者,日期,照片,回复数
            if (!a[6]) a[6] = 'default.jpg';
            a[6] = '../upload/userphoto/60x60/' + a[6];
            return ['<span class="u"><a href="javascript://" target="_blank"><img src="' + a[6] + '" /></a></span><span class="t">' + a[4] + ' ' + a[5] + '</span>',
        ref_data,
    '<p>' + a[3] + '</p>',
    '<p class="detail"><a href="javascript://" _id="' + a[0] + '" _root_ref_id="' + a[2] + '" onclick="mcomment.show_reply(this);" >回复(' + a[7] + ')</a>|<a href="javascript://"  _id="' + a[0] + '" uid="' + a[8] + '"  onclick="mcomment.del(this);" title="只有评论作者可以删除">删除</a></p>']
    .join('');
        }
    },
    update: function (obj) {
        var om = this;
        var a = [];
        a[0] = this.type;
        a[1] = this.id;
        a[2] = $("#txtcontent").val(); // 评论
        if (!a[2]) {
            alert('评论内容不能为空');
            return;
        }
        a[3] = om.relateid; // co.company id
        a[4] = '-1'; //引用
        a[5] = '-1'; //根引用
        a[6] = this.cmbPrivate.val();
        a[7] = ur.user().id; //作者
        $(obj).disable();
        gf.callProc('up_comment_update', a, function () {
            om.search();
            $(obj).enable();
        });
    },
    del: function (obj) {
        if (gf.isAuthorOrSysAdmin($(obj).attr('uid'))) {
            gf.callProc('up_comment_del', [this.type, $(obj).attr('_id')], function () { $(obj).parent().parent().remove(); });
        } else {
            alert('您不是该评论的作者，无权删除该评论');
        }
    },
    show_reply: function (obj) {
        this.pid = $(obj).attr('_id');
        this.root_ref_id = $(obj).attr('_root_ref_id');
        $(obj).parent().after(this.dv_reply.show());
    }
}

function comment(a) {
    this.id = a[0];
    this.r_id = a[1]; //引用ID
    this.r_root_id = a[2]; // 根引用ID
    this.data = a;
}

