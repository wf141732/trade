/// <reference path="../jquery-1.5.min.js" />
/// <reference path="../jquery.aac.js" />
/// <reference path="tangram-pager.js" />
/// <reference path="aacconfig.js" />

var grid_excel = function (grid) {
    var tbl = grid.tbl, target = {}, lastValue = "lastValue", editable = 'editable', s = ':has("input[readonly]")';
    $.fn.selectionRange = function (start, end) {
        end = end || this.val().length;
        start = start || this.val().length;
        this[0].selectionStart = start;
        this[0].selectionEnd = end;
    };
    function cellDown(targ) {
        (targ.parent().next() ? targ.parent().next() : targ.parent().parent().children().first()).children().eq(targ.attr('cellIndex')).children().first()[0].focus();
    }
    function cellUp(targ) {
        (targ.parent().prev()[0] ? targ.parent().prev() : targ.parent().parent().children().last()).children().eq(targ.attr('cellIndex')).children().first()[0].focus();
    }
    function cellLeft(targ) {
        //(targ.prev(s)[0] ? targ.prev(s) : targ.parent().children(s).last()).children().first()[0].focus();
        (targ.prevUntil('', s)[0] ? targ.prevUntil('', s) : targ.parent().children(s).last()).children().first()[0].focus();
    }
    function cellRight(targ) {
        //(targ.next(s)[0] ? targ.next(s) : targ.parent().children(s).first()).children().first()[0].focus();
        (targ.nextUntil('', s)[0] ? targ.nextUntil('', s) : targ.parent().children(s).first()).children().first()[0].focus();
    }
    $.fn.editOn = function () {
        if (!!this.attr(editable) === true) {
            //targ.attr('contenteditable', true);
            //targ.enable();
            this.attr('readonly', false)
            //targ.parent().attr('contenteditable', false);
        };
        //document.execCommand('Unselect');
        this.attr(lastValue, this.val());
        return this;
        //targ[0].focus();
    };
    $.fn.editOff = function () {
        //(!!targ.attr('contenteditable') === true) ? targ.attr('contenteditable', false) : null;
        // (!targ.attr('disabled')) ? targ.disable() : null;
        //(!this.attr('readonly')) ? this.attr('readonly', 'true') : null;
        this.attr('readonly') || this.attr('readonly', 'true');
        return this;
        //targ.parent().attr('contenteditable', true);
    };
    tbl.mousedown(function (evt) {
        //if (focusin) return;
        var target = $(evt.target);
        //由于tbody上面不能进行事件委托，所以不能区分头行
        if ( target[0].tagName != 'INPUT') return;
        if (!(!target.attr('readonly') && target.attr('readonly').toString() === 'false')) {
            $(evt.target)[0].focus();
            //target.selectionRange(-1);
            return false;
        }
    });
    tbl.focusin(function (evt) {
        target = $(evt.target);//.addClass('focus');
        target[0].focus();
        target.selectionRange(-1);
        //target.selectionRange();
    })
    tbl.focusout(function (evt) {
        target = $(evt.target).editOff(); //.children(0);
        //editOff(target);
    });
    tbl.dblclick(function (evt) {
        target = $(evt.target);
        if (target.attr(editable) && target.attr(editable).toString() === 'true')
            target.editOn().selectionRange();
        //editOn(target);
        //target.parent()[0].focus();
        //target[0].focus();
        //target.selectionRange();
        //target.position(target.val().length)
        //$(this).position()

    });
    tbl.keydown(function (evt) {
        //target = $(evt.target).children(0);
        target = $(evt.target);
        var etarg = $(evt.target).parent(), keyValue = '', keyCode = evt.keyCode,
        //isEdit = (target.attr('contenteditable') && target.attr('contenteditable').toString() === 'true');
        isEdit = (!target.attr('readonly') && target.attr('readonly').toString() === 'false');
        if (!target.attr(editable) || target.attr(editable).toString() === 'false') {
            if (!(keyCode <= 40 && keyCode >= 37 || keyCode === 9 || keyCode === 13))
                return;
        }
        switch (keyCode) {
            case 8: //backspace
                isEdit || target.attr("value", '');
                if (!isEdit)
                    return false;
                break;
            case 46: //delete
                if (!isEdit) {
                    target.attr("value", '').editOn();
                    //editOn(target);
                    target[0].focus();
                    return false;
                }
                break;
            case 9: //tab                                                   
                cellRight(etarg);
                return false;
                break;
            case 27: //esc
                //editOff(target);
                target.editOff().val(target.attr(lastValue));
                etarg[0].focus();
                target.selectionRange(-1);
                return false;
                break;
            case 113: //F2
                target.editOn();
                target[0].focus();
                target.selectionRange();
                break;
            case 13: //enter
                cellDown(etarg);
                break;
            case 37: //left
                isEdit || cellLeft(etarg);
                break;
            case 38: //up
                isEdit || cellUp(etarg);
                break;
            case 39: //right
                isEdit || cellRight(etarg);
                break;
            case 40: //down
                isEdit || cellDown(etarg);
                break;
            default:
                //keyValue = keycode.keyCodeValue(evt.keyCode, evt.shiftKey);
                //if (!!keyValue && !isEdit) {
                if (!isEdit) {
                    //editOn(target);
                    target.editOn().val('')//keyValue);
                    target[0].focus();
                    return true;
                    //return false;
                };
                break;
        }
        //return false;
    });
}

keycode = {
    keyCodeValue: function (keyCode, shiftKey) {
        shiftKey = shiftKey || false;
        return shiftKey? this.modifiedByShift[keyCode]: this.keyCodeMap[keyCode];
    },
    _keyCodeMap: {
        8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pausebreak", 20: "capslock", 27: "escape", 32: " ", 33: "pageup",
        34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 43: "+", 44: "printscreen", 45: "insert", 46: "delete",
        48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";",
        61: "=", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l",
        77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9",
        106: "*", 107: "+", 109: "-", 110: ".", 111: "/",
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12",
        144: "numlock", 145: "scrolllock", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
    },
    keyCodeMap: {
        48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";",
        61: "=", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l",
        77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9",
        106: "*", 107: "+", 109: "-", 110: ".", 111: "/",
        144: "", 145: "", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
    },
    modifiedByShift: {
        192: "~", 48: ")", 49: "!", 50: "@", 51: "#", 52: "$", 53: "%", 54: "^", 55: "&", 56: "*", 57: "(", 109: "_", 61: "+",
        65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L",
        77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z",
        219: "{", 221: "}", 220: "|", 59: ":", 222: "\"", 188: "<", 189: ">", 191: "?",
        96: "insert", 97: "end", 98: "down", 99: "pagedown", 100: "left", 102: "right", 103: "home", 104: "up", 105: "pageup"
    }
};




//// hwm 修改 20111030 思路没有修改，只是对代码进行了精简
//var grid_excel = function (grid) {
//    var tbl = grid.tbl, target = null, s = ':has("input[readonly]")';
//    $.fn.selectionRange = function (start, end) {
//        this[0].selectionStart = start || 0;
//        this[0].selectionEnd = end || this.val().length;
//    };

//    $.fn.editOn = function () {
//        if (!!this.attr('editable') === true) this.attr('readonly', false);
//        this.attr('lastValue', this.val());
//        return this;
//    };

//    $.fn.editOff = function () {
//        this.attr('readonly', true);
//        return this;
//    };

//    function cellNav(target, dir) {
//        var o = null;
//        var otr = target.parent();
//        if (dir == 'up') {
//            o = otr.prev().find('td').eq(target.attr('cellIndex'));
//        } else if (dir == 'down') {
//            o = otr.next().find('td').eq(target.attr('cellIndex'));
//            if (o.size() == 0) o = otr.parent().find('tr:eq(0)').find('td').eq(target.attr('cellIndex'));
//        } else if (dir == 'left') {
//            o = target.prevUntil('', s);
//            if (o.size() == 0) o = otr.prev().find('td' + s).eq(0);
//        } else if (dir == 'right') {
//            o = target.nextUntil('', s);
//            if (o.size() == 0) o = otr.next().find('td' + s).eq(0);
//            if (o.size() == 0) o = otr.parent().find('td' + s + ':eq(0)');
//        }
//        o.children().first()[0].focus();
//    }



//    tbl.mousedown(function (evt) {
//        var target = $(evt.target);
//        //由于tbody上面不能进行事件委托，所以不能区分头行
//        if (target[0].tagName != 'INPUT') return;
//        if (!(!target.attr('readonly') && target.attr('readonly').toString() === 'false')) {
//            $(evt.target)[0].focus();
//            return false;
//        }
//    });

//    tbl.focusin(function (evt) {
//        target = $(evt.target).addClass('focus');
//        target[0].focus();
//        target.selectionRange(-1);
//    })
//    tbl.focusout(function (evt) {
//        target = $(evt.target).removeClass('focus').editOff();
//    });

//    tbl.dblclick(function (evt) {
//        target = $(evt.target);
//        if (target.attr('editable') && target.attr('editable').toString() === 'true')
//            target.editOn().selectionRange();
//    });
//    tbl.keydown(function (evt) {
//        target = $(evt.target);
//        var etarg = target.parent(), keyValue = '', keyCode = evt.keyCode,
//        isEdit = (!target.attr('readonly') && target.attr('readonly').toString() === 'false');
//        if (!target.attr('editable') || target.attr('editable').toString() === 'false') {
//            if (!(keyCode <= 40 && keyCode >= 37 || keyCode === 9 || keyCode === 13))
//                return;
//        }
//        switch (keyCode) {
//            case 8: //backspace
//                isEdit || target.attr("value", '');
//                if (!isEdit)
//                    return false;
//                break;
//            case 46: //delete
//                if (!isEdit) {
//                    target.attr("value", '').editOn();
//                    target[0].focus();
//                    return false;
//                }
//                break;
//            case 9: //tab                                                   
//                cellNav(etarg, 'right');
//                return false;
//                break;
//            case 27: //esc
//                target.editOff().val(target.attr('lastValue'));
//                etarg[0].focus();
//                target.selectionRange(-1);
//                return false;
//                break;
//            case 113: //F2
//                target.editOn();
//                target[0].focus();
//                target.selectionRange();
//                break;
//            case 13: //enter
//                cellNav(etarg, 'down');
//                break;
//            case 37: //left
//                isEdit || cellNav(etarg, 'left');
//                break;
//            case 38: //up
//                isEdit || cellNav(etarg, 'up');
//                break;
//            case 39: //right
//                isEdit || cellNav(etarg, 'right');
//                break;
//            case 40: //down
//                isEdit || cellNav(etarg, 'down');
//                break;
//            default:
//                keyValue = keycode.keyCodeValue(evt.keyCode, evt.shiftKey);
//                if (!!keyValue && !isEdit) {
//                    target.editOn().val(keyValue);
//                    target[0].focus();
//                    return false;
//                };
//                break;
//        }
//        return false;
//    });
//}
