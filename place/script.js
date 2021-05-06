var pixels = new Array;
var comments = new Array;
var postID="6089db554d822801aa12a243";
var show = false;
var last2 = new Array;
var counter = 0;
var scores = {};
var leadDiv = document.getElementById("leaderboard");
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
            //cell.innerText=".";
            pixels[c++] = cell
            row.appendChild(cell);
            var owner = document.createElement("div")
            var emoji = document.createElement("div")
            owner.classList.add("owner")
            emoji.classList.add("emoji")
            owner.innerText="."
            cell.appendChild(owner)
            cell.appendChild(emoji)
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
            processScore();
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
        //comments.push(comment)
        processOneComment(comment);
        comments.push(comment)
        console.log(comment);
    }
}

const isColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}

function processOneComment(com) {
    var s = com.msg.split(/[ ,]+/);
    var x = s[0];
    var y = s[1];
    var c = s[2];
    var e = s[3];
    if (c) c = c.trim();
    else {
    }
    if (x >=1 && x <=20 && y >= 1 && y <= 20 && isColor(c) && (!last2.includes(com.user) || com.user=="OJ")) {
        last2[counter++ % 2] = com.user;
        var pixel = pixels[20*(y-1)+(x-1)];
        if (!pixel) {console.log("Stupid @"+com.user+" tryna break my shit");return;}
        pixel.style.backgroundColor = c;
        pixel.title = c
        pixel.getElementsByClassName("owner")[0].innerText = com.user;
        if (/\p{Emoji}/u.test(e)){
            pixel.getElementsByClassName("emoji")[0].innerHTML = " &#x"+((e.charCodeAt(0) - 0xD800) * 0x400 + (e.charCodeAt(1) - 0xDC00) + 0x10000).toString(16)+"; "
        }
        if (!scores[com.user])
        {
            scores[com.user] = 1;
        } else {
            scores[com.user]++;
        }            
    }
}

function processScore() {
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


    var btn = document.getElementById("showNumbers");
    btn.onclick = function() {
        show = !show;
        var owners = document.getElementsByClassName("owner");
        var emojis = document.getElementsByClassName("emoji");
        for (var i = 0; i < owners.length; i++) {
            if (!show) {
                owners[i].style.display = "none"
                emojis[i].style.display = "block"
                //owners[i].style.color="transparent"
                //owners[i].style.textShadow="none"
            } else {
                owners[i].style.display = "block"
                emojis[i].style.display = "none"
                //owners[i].style.color="white"
                //owners[i].style.textShadow="2px 2px #000000"
            }
        }
    }
    btn = document.getElementById("playLoad")
    btn.onclick = function() {
        btn.disabled = true;
        for (var i = 0; i < pixels.length; i++) {
            pixels[i].getElementsByClassName("owner")[0].innerText=".";
            pixels[i].style.backgroundColor="white";
            pixels[i].getElementsByClassName("owner")[0].style.display = "none"
            show = false;
        }
        playOne(0);
    }

}
function playOne(val) {
    if (val >= comments.length) {
        document.getElementById("playLoad").disabled = false;
    }
    processOneComment(comments[val++]);
    setTimeout(playOne,0, val)

}
