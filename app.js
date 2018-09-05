// Init
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var moment = require("moment");
var methodOverride = require("method-override");

// Config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride("_method"));

// DB config, schema setting up
mongoose.connect('mongodb://localhost/blog');
var postSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: Date
});
var Post = mongoose.model("Post", postSchema);

/////////////////////////// App body ////////////////////////////////////

// RESTful routes
app.get("/", function(req, res){
    res.redirect("/posts");
});

// INDEX route
app.get("/posts", function(req, res){
    Post.find({}, function(err, foundPosts){
        if(err){
            console.log("Error" + err);
        } else {
            res.render("index", {foundPosts: foundPosts});
        }
    });
});

// NEW route
app.get("/posts/new", function(req, res){
    res.render("new");
});

// CREATE route
app.post("/posts", function(req, res){
    var title = req.body.post.title;
    var image = req.body.post.image;
    var body = req.body.post.body;
    var date = moment(Date.now());
    Post.create({
        title: title,
        image: image,
        body: body,
        date: date
    }, function(err, createdPost){
        if(err){
            console.log(err);
        } else {
            console.log(createdPost);
            res.redirect("/posts");
        }
    });
});

// SHOW route
app.get("/posts/:id", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("show", {foundPost: foundPost});
        }
    });
});

// EDIT route
app.get("/posts/:id/edit", function(req, res){
    var foundedPost = Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            foundedPost = foundPost;
            console.log(foundedPost);
            res.render("edit", {foundPost: foundPost});
        }
    });
});

// UPDATE route
app.put("/posts/:id", function(req, res){
    var title = req.body.post.title;
    var image = req.body.post.image;
    var body = req.body.post.body;
    var date = moment(Date.now());
    var updatedPost = {
        title: title,
        image: image,
        body: body,
        date: date
    };
    Post.findByIdAndUpdate(req.params.id, updatedPost, function(err, upedPost){
        if(err){
            console.log(err);
        } else {
            console.log(upedPost);
            res.redirect("/posts/"+upedPost._id);
        }
    });
});

// DESTROY route
app.delete("/posts/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, deletedPost){
        if(err){
            console.log(err);
        } else {
            console.log(deletedPost);
            res.redirect("/posts");
        }
    });
});



/////////////////////////////////// Listener ///////////////////////////////////

// Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("BLOG SERVER IS ON!");
});