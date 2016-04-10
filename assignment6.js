"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    http = require("http"),
    random = require("random-js"),
    redis = require("redis"),
    redisClient,
    app;

app = express();
var r = random();
app.use(bodyParser.json());
var win_count = 0;
var loss_count = 0;
redisClient = redis.createClient();



app.get("/stats", function(req, res) {
    //res.send("This is GET stats. \n Wins: "+win_count+" Loose: "+loose_count);
    //res.send("win"+win_count+"loose"+loose_count);
    //res.send(JSON.stringify({ "wins": win_count, "losses": loss_count }));
    redisClient.mget("win_count", "loss_count", function(err, result) {
        var res_arr = result.toString().split(',');
        //console.log("This is "+res_arr[0]);
        res.send(JSON.stringify({ "wins": res_arr[0], "losses": res_arr[1] }));
    });

});


app.post("/flip", function(req, res) {
    //res.send("This is POST flip.");
    var choice = req.body.call;
    console.log(choice);
    var arr = ["heads", "tails"];
    var a = r.shuffle(arr)[0];
    var result;
    console.log(a);
    if (choice === a) {
        result = "win";
        console.log("win");
        //win_count++;
        redisClient.incr("win_count");
    }
    else {
        result = "lose";
        console.log("loose");
        //loss_count++;
        redisClient.incr("loss_count");
    }
    res.send(JSON.stringify({ "result": result }));


});

app.delete("/stats", function(req, res) {
    redisClient.set("win_count", "0");
    redisClient.set("loss_count", "0");
    res.send("All set to Zero.");
});

app.get("/goodbye", function(req, res) {
    res.send("Goodbye World!");
});

// Create our Express-powered HTTP server
// and have it listen on port 3000
http.createServer(app).listen(3000);