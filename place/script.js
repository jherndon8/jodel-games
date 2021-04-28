var pixels = new Array;
var comments = new Array;
var postID="6089db554d822801aa12a243";
var show = false;
init();
function init() {
    var v = 20;
    c = 0;
    var e = document.getElementsByClassName("container")[0];
    for(var i = 0; i < v; i++){
        var row = document.createElement("div");
        row.className = "row";
        for(var x = 1; x <= v; x++){
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.innerText=".";
            pixels[c++] = cell
            row.appendChild(cell);
        }
        e.appendChild(row);
    }
    //document.getElementById("code").innerText = e.innerHTML;
    getPostData(postID);
}


function getPostData(postID, next) {
    if (!postID) {
       return;
    }
    var url = "https://share.jodel.com/post/"
    var url = url + postID + "/replies";
    if (next) {
        url = url + "?next=" + next
    }
    else {
    document.getElementById("postlink").innerHTML='<iframe frameborder="0" height="450px" width="600px" src="https://share.jodel.com/post/preview?postId=' + postID + '" style="border-radius:3px"></iframe>'
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url, true);

    xhr.onload = function() {
        var results = JSON.parse(xhr.responseText);
        parse(results.html)
        if (results.next) {
            getPostData(postID, results.next);
        }
        else {
            processComments();
        }
        //console.log(results);
    }
    xhr.send(null)
}

function parse(resp) {
    var dp = new DOMParser()
    var doc = dp.parseFromString(resp, "text/html")
    var posts = doc.getElementsByClassName("post-block")
    for (var post of posts) {
        var comment = {};
        comment.user = post.getElementsByClassName("oj-text")[0].innerHTML
        comment.msg = post.getElementsByClassName("post-message")[0].innerHTML
        comments.push(comment)
        console.log(comment);
    }
}

const isColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}

function processComments() {
    var last2 = new Array;
    var counter = 0;
    var scores = {};
    var leadDiv = document.getElementById("leaderboard");
    for (var com of comments) {
        var s = com.msg.split(/[ ,]+/);
        var x = s[0];
        var y = s[1];
        var c = s[2];
        if (c) c = c.trim();
        else {
        }
        if (x >=1 && x <=20 && y >= 1 && y <= 20 && isColor(c) && (!last2.includes(com.user) || com.user=="OJ")) {
            last2[counter++ % 2] = com.user;
            pixels[20*(y-1)+(x-1)].style.backgroundColor=c;
            pixels[20*(y-1)+(x-1)].innerText = com.user;
            if (!scores[com.user])
            {
                scores[com.user] = 1;
            } else {
                scores[com.user]++;
            }            
        }
    }
    var leaderboard = []
    for (var user in scores) {
        if (-user)
        leaderboard.push([+scores[user],+user])
    }
    leaderboard.sort(function(a,b){return a[0]-b[0]});
    leaderboard.reverse();
    for (var val of leaderboard) {
        leadDiv.innerHTML += '<p align="center">@'+val[1]+': '+val[0]+'</p>'
    }


    console.log("meh")
    var btn = document.getElementById("showNumbers");
    console.log(btn)
    btn.onclick = function() {
        show = !show;
        var cells = document.getElementsByClassName("cell")
        console.log(show);
        for (var i = 0; i < cells.length; i++) {
            if (!show) {
                cells[i].style.color="transparent"
                cells[i].style.textShadow="none"
            } else {
                cells[i].style.color="white"
                cells[i].style.textShadow="2px 2px #000000"
            }
        }
    }

}
