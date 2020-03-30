//写cookies函数
//参数，一个是cookie的名子，一个是值,一个是天数
function SetCookie(name, value, days) {
    var exp = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}


//取cookies函数
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;

}

//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = null;//getCookie(name);
    //if(cval!=null) 
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}