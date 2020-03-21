//主导航js
var adjustarr = new Array();

function NavOn(cid) {
    var onav = document.getElementById("channelid" + cid);
    //if(onav!=null)onav.src=T_P+'images/channelid'+cid+'a.gif';
    if (onav != null) onav.className = "active";
}

function NavOut(cid) {
    if (channelid == cid) return;
    var onav = document.getElementById("channelid" + cid);
    //if(onav!=null)onav.src=T_P+'images/channelid'+cid+'.gif';
    if (onav != null) onav.className = "";
}

function MenuOn(id) {
    var isadjust = 0;
    var o = document.getElementById("menu" + id);
    for (var i = 0; i < adjustarr.length; i++) {
        if (adjustarr[i] == id) isadjust = 1;
        var o2 = document.getElementById("menu" + adjustarr[i]);
        if (o2 != null) o2.style.display = "none";
    }
    if (o == null) return;
    if (isadjust == 0) {
        adjustarr[adjustarr.length] = id;
        /*var p = (screen.width-1002)/2-11;
        var l=o.style.left.substr(0,o.style.left.length-2);
        l=eval(p)+eval(l);
        o.style.left=l+"px";*/
    }
    o.style.display = "";
}

function MenuOut(id) {
    var o = document.getElementById("menu" + id);
    if (o != null) o.style.display = "none";
}

function CheckWebSearch(form) {
    if (form.k.value == "") {
        alert("搜索时,关键词不能为空!");
        form.k.focus();
        return false;
    }
}