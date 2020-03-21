//放入购物车
var lang = "cn";

function BuyChuL(id) {
    if (id == "") return;
    var quantity = 1;
    var cartinfo = getCookie("sanjinCartInfo_" + lang + "_" + channelid);
    if (cartinfo == null || typeof (cartinfo) == "undefined" || cartinfo == "") {
        SetCookie("sanjinCartInfo_" + lang + "_" + channelid, id + ',' + quantity, 30);
    } else {
        var ishave = false;
        var arrcartinfo = cartinfo.split('|');
        for (var i = 0; i < arrcartinfo.length; i++) {
            var pinfo = arrcartinfo[i].split(',');
            if (id == pinfo[0]) {
                ishave = true;
                break;
            }
        }
        if (ishave == false) {
            cartinfo = cartinfo + '|' + id + ',' + quantity;
            SetCookie("sanjinCartInfo_" + lang + "_" + channelid, cartinfo, 30);
        }
    }
}

function PutGwChe(id) {
    BuyChuL(id);
    alert("成功放入购物车，请继续购物");
}