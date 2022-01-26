var pixels = new Array;
var comments = new Array;
var postID="61e70226e37fa89f51ef716d";
var show = false;
var last2 = new Array;
var counter = 0;
var scores = {};
var leadDiv = document.getElementById("leaderboard");
init();
function init() {
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
    var imgs = doc.getElementsByClassName("image");
    for (var post of posts) {
        counter++;
        var comment = {};
        comment.user = post.getElementsByClassName("oj-text")[0].innerHTML
        comment.msg = post.getElementsByClassName("post-message")[0].innerHTML
        //comments.push(comment)
        processOneComment(comment);
        comments.push(comment)
        //console.log(comment);
    }
    for (var img of imgs) {
        counter++;
        var comment = {msg: ""};
        comment.user = post.getElementsByClassName("oj-text")[0].innerHTML
        processOneComment(comment);
    }
    document.getElementById("loading").innerHTML="Loaded " + counter + " comments...";
}

const isColor = (strColor) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}

function processOneComment(com) {
    if (!scores[com.user])
    {
        scores[com.user] = 1;
    } else {
        scores[com.user]++;
    }            
}

function processScore() {
    var leaderboard = []
    for (var user in scores) {
        leaderboard.push([+scores[user],user])
    }
    leaderboard.sort(function(a,b){return a[0]-b[0]});
    leaderboard.reverse();
    for (var val of leaderboard) {
        leadDiv.innerHTML += '<p align="center">@'+val[1]+': '+val[0]+'</p>'
    }

}

