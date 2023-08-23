var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

// var Post = require("./models/post");

const postsRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb+srv://hariharan210325:cqY2UDiIaDZ7C7oe@my-post.yt6dowc.mongodb.net/node-angular?retryWrites=true")
    .then(() => {
        console.log("MongoDb Connection Successfull");
    }).catch((err) => {
        console.log("MongoDB Connection Failed", err);
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);


module.exports = app;