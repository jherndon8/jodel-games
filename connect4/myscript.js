var comments = [];

function getPostData(postID, next) {
    if (!postID) {
       return; 
    }
    document.getElementById("u").innerHTML = "Reading Comments..."
    var url = "https://share.jodel.com/post/"
    document.getElementById("postlink").innerHTML="<iframe frameborder=\"0\" height=\"200px\" width=\"400px\" src=\"https://share.jodel.com/post/preview?postId=\"" + postID + "\" style=\"border-radius:3px\"></iframe>";
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
    for (const m of comments) {
        if (m.msg-0 <= 7 && m.msg -0 >=1){

            if (m.user % 2 === 0 && moves === 1 && !evenPlayers.includes(m.user)) {
                evenPlayers[evenCount++ % 2] = m.user
                move(m.msg-0)
                moves = 0;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
            else if (m.user % 2 === 1 && moves === 0 && !oddPlayers.includes(m.user)) {
                oddPlayers[oddCount++ % 2] = m.user
                move(m.msg-0)
                moves = 1;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
        }
    }
    document.getElementById("u").innerHTML = ""
}

getPostData("5ea7c1bf6b8328001af30402")

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
