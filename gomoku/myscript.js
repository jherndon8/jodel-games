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
    oddCount = 0;
    evenCount = 0;
    moves = 0;
    document.getElementById("status").innerHTML = "X starts";
    for (const m of comments) {
        if (isBoardMove(m.msg)){

            if (m.user % 2 === 0 && moves === 1 && !evenPlayers.includes(m.user)) {
                evenPlayers[evenCount++ % 2] = m.user
                boardMove(m.msg)
                moves = 0;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
            else if (m.user % 2 === 1 && moves === 0 && !oddPlayers.includes(m.user)) {
                oddPlayers[oddCount++ % 2] = m.user
                boardMove(m.msg)
                moves = 1;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
        }
    }
}

getPostData("5eadc6994cdb4e001b7725e0")

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
