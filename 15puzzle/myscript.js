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

async function processComments() {
    console.log(comments);
    oddPlayers = new Array;
    oddCount = 0;
    for (const m of comments) {
        if (m.msg-0 <= 16 && m.msg-0 >= 1){
            if (!oddPlayers.includes(m.user)) {
                await new Promise(resolve => setTimeout(resolve, 20));
                oddPlayers[oddCount++ % 2] = m.user
                move(m.msg);
                console.log('user ' + m.user + ' moved at ' + m.msg)
            }
        }
    }
}

getPostData("5eae22cb219413001bf5be58")

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
