function checkint(ele) {
    if (ele.value == "") return;
    var myRegExp = "^[0-9]{1,9}$";
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请输入数字!");
        ele.focus();
        return false;
    }
}

function isint(ele) {
    if (ele.value == "") return false;
    var myRegExp = "^[0-9]{1,9}$";
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请输入数字!");
        ele.focus();
        return false;
    }
    return true;
}

function filter(e) {
    var re = /'/g;
    e.value = e.value.replace(re, "");
}

function filterform(form) {
    var re = /'/g;
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        e.value = e.value.replace(re, "");
    }
}

function filterbr(e) {
    var re = /"/g;
    var re2 = /\r\n/g;
    e.value = e.value.replace(re, "");
    e.value = e.value.replace(re2, "");
}


function checkemail(data) {
    if (data == "") return false;
    var datastr = data;
    var lefttrim = datastr.search(/\S/gi);

    if (lefttrim == -1) {
        return -1;
    }
    var myRegExp = /[a-z0-9](([a-z0-9]|[_\-\.][a-z0-9])*)@([a-z0-9]([a-z0-9]|[_\-][a-z0-9])*)((\.[a-z0-9]([a-z0-9]|[_\-][a-z0-9])*)*)/gi;

    var answerind = datastr.search(myRegExp);
    var answerarr = datastr.match(myRegExp);

    if (answerind == 0 && answerarr[0].length == datastr.length) {
        return true;
    }
    return false;
}

function isemail(ele) {
    if (ele.value == "") return;
    var myRegExp = /[a-z0-9](([a-z0-9]|[_\-\.][a-z0-9])*)@([a-z0-9]([a-z0-9]|[_\-][a-z0-9])*)((\.[a-z0-9]([a-z0-9]|[_\-][a-z0-9])*)*)/gi;
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请正确认输入Email或MSN!");
        ele.select();
    }
}

function ismobile(ele) {
    if (ele.value == "") return false;
    var myRegExp = "^[0-9]{11}$";
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请输入正确手机号!");
        ele.select();
        return false;
    }
    return true;
}

function ispostcode(ele) {
    if (ele.value == "") return false;
    var myRegExp = "^[0-9]{6}$";
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请输入正确邮政编码!");
        ele.select();
        return false;
    }
    return true;
}

function istel(ele) {
    if (ele.value == "") return;
    var myRegExp = /^(\d{3,4})\-(\d{7,8})$/;
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请正确认输入电话号码!");
        ele.select();
    }
}

function istm(ele)//电话或手机
{
    if (ele.value == "") return;
    var bln = false;
    var myRegExp = /^(\d{3,4})\-(\d{7,8})$/;
    var res = ele.value.search(myRegExp);
    if (res == -1) bln = false;
    else bln = true;

    if (bln == false) {
        myRegExp = "^[0-9]{11}$";
        res = ele.value.search(myRegExp);
        if (res == -1) bln = false;
        else bln = true;
    }
    if (bln == false) {
        alert("请输入正确电话号码或手机号!");
        ele.select();
        return false;
    }
}

//检查文件夹或文件名称是否为合法
function isf(str) {
    var myRegExp = "^[A-Za-z0-9.]{1,20}$";
    var res = str.search(myRegExp);
    if (res == -1) return false;
    else return true;
}


//检查文件夹或文件名称是否为合法,无后缀.
function isfn(ele) {
    if (ele.value == "") return false;
    var myRegExp = "^[A-Za-z0-9]{1,20}$";
    var res = ele.value.search(myRegExp);
    if (res == -1) {
        alert("请输入正规的文件名");
        ele.focus();
        return false;
    } else return true;
}

//检查用户名是否为合法的6-20位的数字和字母的组合
function isun(str) {
    var myRegExp = "^[A-Za-z0-9]{6,20}$";
    var res = str.search(myRegExp);
    if (res == -1) return false;
    else return true;
}

//检查首字符是否为字母
function checkfn(str) {
    if (str == "") return false;
    var strf = str.substring(0, 1);
    var myRegExp = "^[A-Za-z]{1}$";
    var res = strf.search(myRegExp);
    if (res == -1) return false;
    else return true;
}

//检查密码是否为合法的6-20位的数字和字母的组合
function ispass(str) {
    var myRegExp = "^[A-Za-z0-9]{6,20}$";
    var res = str.search(myRegExp);
    if (res == -1) return false;
    else return true;
}

function checkall(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.name != 'chkall' & e.name != 'chkinvert' & e.name != 'chkcancel') {
            e.checked = form.chkall.checked;
        }
    }//end of for
}

function checkinvert(form) {
    if (form.chkinvert.checked == true) {
        for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            if (e.name != 'chkall' & e.name != 'chkinvert' & e.name != 'chkcancel') {
                if (e.checked == true)
                    e.checked = false;
                else
                    e.checked = true;
            }
        }//end of for
    }
}

function checkcancel(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.name != 'chkall' & e.name != 'chkinvert' & e.name != 'chkcancel') {
            e.checked = false;
        }
    }//end of for
}


function CreateOption(id, name) {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(name));
    oOption.setAttribute("value", id);
    return oOption;
}

function showimg(this0) {
    if (this0.src.indexOf(".gif") != -1 || this0.src.indexOf(".jpg") != -1 || this0.src.indexOf(".png") != -1) window.open(this0.src, "");
}

function openwin(hrefstr, left, top, width, height) {
    window.open(hrefstr, '_blank', 'resizable=yes,status=no,scrollbars=yes,left=' + left + ',top=' + top + ',width=' + width + ',height=' + height + '');
}

function LoadScript(url) {
    document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"><\/scr' + 'ipt>');
}

function addfavorite(url, webname) {
    if (document.all) {
        window.external.addFavorite(url, webname);
    } else if (window.sidebar) {
        window.sidebar.addPanel(webname, url, "#");
    }
} 