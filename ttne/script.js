var pixels = new Array;
var comments = new Array;
var postID="61e70226e37fa89f51ef716d";
var show = false;
var last2 = new Array;
var counter = 0;
var scores = {};
var votes = {};
var colors = {};
var leadDiv = document.getElementById("leadTable");
var mentions = {};
var data = {};
var physics = false;
init();
console.log("Hey, you there... snooping around")
console.log("There seems to be fewer comments loading than what it says there are in the app.")
console.log("I'll put you in the credits if you can figure out why and tell me how to make the data match the number of comments that the app actually says")
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
    //console.log(doc);
    var posts = doc.getElementsByClassName("post-block")
    var imgs = doc.getElementsByClassName("image");
    for (var post of posts) {
        counter++;
        var comment = {};
        comment.user = post.getElementsByClassName("oj-text")[0].innerHTML
        comment.msg = post.getElementsByClassName("post-message")[0].innerHTML
        comment.votes = post.getElementsByClassName("votes")[0].innerHTML
        //comments.push(comment)
        processOneComment(comment);
        comments.push(comment)
        //console.log(comment);
    }
    for (var img of imgs) {
        counter++;
        var comment = {msg: ""};
        comment.user = post.getElementsByClassName("oj-text")[0].innerHTML
        comment.votes = post.getElementsByClassName("votes")[0].innerHTML
        processOneComment(comment);
    }
    document.getElementById("loading").innerHTML="Loaded " + counter + " comments...";
}

const isColor = (strColor) => {
  if (strColor == +strColor) return false; 
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}

function processOneComment(com) {
    if (!scores[com.user])
    {
        scores[com.user] = 1;
        votes[com.user] = +com.votes;
    } else {
        scores[com.user]++;
        votes[com.user] += +com.votes;
    }            
    if (isColor(com.msg)) {
        //console.log(com);
        colors[com.user] = com.msg;
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
    for (var user in scores) {
        data[user] = {score: scores[user], mentions: 0, mentioned: 0, votes: votes[user]}
    }
    for (mention of Object.keys(mentions)) {
        var a = mention.split(",");
        if (a[0] in data  && a[1] in data) {
            data[a[0]].mentions += mentions[mention];
            data[a[1]].mentioned += mentions[mention];
        }
    }
    for (var user in scores) {
        leaderboard.push([+scores[user],user, data[user].mentions,
            data[user].mentioned, +votes[user]])
    }
    leaderboard.sort(function(a,b){return a[0]-b[0]});
    leaderboard.reverse();
    var i = 1;
    for (var val of leaderboard) {
        leadDiv.innerHTML += '<tr><td>'+i+'</td><td>@'+val[1]+'</td><td> '+val[0]+'</td><td>'+val[2]+'</td><td>'+ val[3] +'</td><td>'+ val[4]+'</td></tr>'
        i += 1;
    }
    draw();
}

var nodes = null;
var edges = null;
var network = null;

function draw() {
  // create people.
  // value corresponds with their number of comments
  nodes = [];
    //{ id: 2, value: 31, label: "Alston" },
  for (user in data) {
      node = {id: user, value: Math.sqrt(data[user].score), label: "@"+user};
      if (user in colors) {
          console.log(user, colors[user]);
          node.color = colors[user]
      }
      nodes.push(node);
  }

  nodes = new vis.DataSet(nodes);

  // create connections between people
  // value corresponds with the amount of contact between two people
  edges = []
    //{ from: 2, to: 8, value: 3 },
  for (mention of Object.keys(mentions)) {
      a = mention.split(',');
      var edge ={from: a[0], to: a[1], value: mentions[mention], arrows: {enabled: true, type: "arrow"}};
      if (a[0] in colors) {
          edge.color = colors[a[0]]
      }
      edges.push(edge);
  }

  edges = new vis.DataSet(edges);

  // Instantiate our network object.
  var container = document.getElementById("mynetwork");
  var networkData = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "dot",
      scaling: {
        min: 3,
        max: 40,
      },
    },
    physics: {
        adaptiveTimestep: true,
        stabilization: {
            iterations: 350 
        }
    }
  };
  network = new vis.Network(container, networkData, options);
  network.on("stabilizationIterationsDone", function () {
    network.setOptions( { physics: false } );
    var btn = document.getElementById("physicsToggle"); 
    btn.style.display = "block";
    btn.onclick = function() {
        network.setOptions({physics: !physics});
        physics = !physics;
    }

});
}



