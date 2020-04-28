var comments = [];

function getPostData(postID, next) {
    if (!postID) {
       return; 
    }
    document.getElementById("u").innerHTML = ""
    var url = "https://share.jodel.com/post/" + postID + "/replies";
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

            if (m.user % 2 === 0 && moves === 1 && !(m.user in evenPlayers)) {
                evenPlayers[evenCount++ % 3] = m.user
                move(m.msg-0)
                moves = 0;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
            else if (m.user % 2 === 1 && moves === 0 && !(m.user in oddPlayers)) {
                oddPlayers[oddCount++ % 3] = m.user
                move(m.msg-0)
                moves = 1;
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
        }
    }
}

getPostData("5cec2c0ef6af430019effe77")

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
