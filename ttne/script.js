var pixels = new Array;
var comments = new Array;
var postID="61e70226e37fa89f51ef716d";
var show = false;
var last2 = new Array;
var counter = 0;
var scores = {};
var leadDiv = document.getElementById("leadTable");
var mentions = {};
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
    
    if (!(com.user)) {return;}

    for (var mention of [...new Set(com.msg.match(/@[0-9]+/g))]) {
        mention = +mention.substr(1);
        //console.log(mention, com.msg, user)
        if (mention in scores && mention != com.user) {
            var id = com.user + "," + mention;
            if (id in mentions) {
                mentions[id] += 1;
            }
            else {
                mentions[id] = 1;
            }
        }
    }
    if (com.msg.match(/@[oO][jJ]/) || com.msg.match(/@0/)) {
        id = com.user + "," + "OJ";
        if (id in mentions) {
            mentions[id] += 1;
        }   
        else {
            mentions[id] = 1;
        }   
    }

}

function processScore() {
    var leaderboard = []
    data = {}
    for (var user in scores) {
        data[user] = {score: scores[user], mentions: 0, mentioned: 0}
    }
    for (mention of Object.keys(mentions)) {
        var a = mention.split(",");
        if (a[0] in data  && a[1] in data) {
            data[a[0]].mentions += mentions[mention];
            data[a[1]].mentioned += mentions[mention];
        }
    }
    for (var user in scores) {
        leaderboard.push([+scores[user],user,data[user].mentions,data[user].mentioned])
    }
    leaderboard.sort(function(a,b){return a[0]-b[0]});
    leaderboard.reverse();
    var i = 1;
    for (var val of leaderboard) {
        leadDiv.innerHTML += '<tr><td>'+i+'</td><td>@'+val[1]+'</td><td> '+val[0]+'</td><td>'+val[2]+'</td><td>'+ val[3]+'</td></tr>'
        i += 1;
    }

}

