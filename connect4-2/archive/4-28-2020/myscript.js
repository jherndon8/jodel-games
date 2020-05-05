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
    console.log(JSON.stringify(comments));
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

var postID = '5ea7c1bf6b8328001af30402';
console.log(postID)
document.getElementById("postlink").innerHTML="<iframe frameborder=\"0\" height=\"200px\" width=\"400px\" src=\"https://share.jodel.com/post/preview?postId=" + postID + "\" style=\"border-radius:3px\"></iframe>";
comments = '[{"user":"OJ","msg":"Same rules as chess from earlier, the first valid move commented by someone who hasn’t made one of the last three moves from their team shall be made"},{"user":"1","msg":"4"},{"user":"OJ","msg":"It doesn’t refresh very well on my phone (iOS safari) but if I go into private browsing it updates just fine"},{"user":"2","msg":"3"},{"user":"2","msg":"Oh wow cool @OJ... You made this?"},{"user":"2","msg":"Itd be cool to embed the post here too"},{"user":"3","msg":"4"},{"user":"4","msg":"4"},{"user":"OJ","msg":"#jodelgames"},{"user":"5","msg":"4"},{"user":"6","msg":"3"},{"user":"7","msg":"3"},{"user":"8","msg":"2"},{"user":"9","msg":"2"},{"user":"10","msg":"1"},{"user":"1","msg":"5"},{"user":"6","msg":"5"},{"user":"OJ","msg":"@6 you made one of the last three moves for your team already. But this is a little slow so I’m gonna change it to you can go every 3 moves instead."},{"user":"3","msg":"5"},{"user":"8","msg":"Evens win! 5! 5!"},{"user":"2","msg":"5"},{"user":"OJ","msg":"Sweet, I’ll archive this explore together"},{"user":"5","msg":"Doom 64"},{"user":"11","msg":"Do it like Twitch plays X, but Jodel answers my Sherlocks, or does build. "},{"user":"1","msg":"Wtf 3 :("}]'

comments = JSON.parse(comments)
processComments()

function noData()
{
    //document.getElementById("answer").innerHTML = "The post needs to be supplied";
}
