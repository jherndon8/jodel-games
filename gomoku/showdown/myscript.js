var comments = [];

function getPostData(postID, next) {
    if (!postID) {
       return; 
    }
    var url = "https://share.jodel.com/post/"
    document.getElementById("postlink").innerHTML="<iframe frameborder=\"0\" height=\"200px\" width=\"400px\" src=\"https://share.jodel.com/post/preview?postId=" + postID + "\" style=\"border-radius:3px\"></iframe>";
    document.getElementById("postlink").innerHTML='<iframe frameborder="0" height="300px" width="600px" src="https://share.jodel.com/post/preview?postId=' + postID + '" style="border-radius:3px"></iframe>'
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
    }
}

function processComments() {
    console.log(comments);
    oddPlayers = new Array;
    evenPlayers = new Array;
    moves = 0;
    document.getElementById("status").innerHTML = "X starts";
    for (const m of comments) {
        console.log(m.msg);
        console.log(m.msg.charCodeAt(0));
        if (isBoardMove(m.msg)){
            console.log(m.msg);

            if (m.user === '2' && moves === 1 && !evenPlayers.includes(m.user)) {
                boardMove(m.msg)
                moves = 0;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
            else if (m.user === '1' && moves === 0 && !oddPlayers.includes(m.user)) {
                boardMove(m.msg)
                moves = 1;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
        }
    }
}

getPostData("5eadd6b9868c500017ed4495")

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
