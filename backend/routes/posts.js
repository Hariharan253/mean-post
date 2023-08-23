const express = require("express");

const Post = require("../models/post")

const router = express.Router();

router.post("", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save()
    .then((createdPost) => {
        return res.status(200).json({
            message: "Post Added Successfully",
            postId: createdPost._id
        });
    });
    console.log(post);
});

router.get("",(req, res, next) => {
    
    Post.find()
    .then((documents) => {
        console.log(documents);
        return res.status(200).json({
            message: "Post Sent successfully",
            posts: documents
        });
    });

});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
    .then((post) => {
        if(post) {
            return res.status(200).json({message: "Post Found", post: post});
        }
        else {
            return res.status(404).json({message: "Post Not Found"});
        }
    })
})

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });

    Post.updateOne({_id: req.params.id}, post)
    .then((result) => {
        console.log("updated Result", result);
        return res.status(200).json({"message": "Update Successful"})
    })
});

router.delete("/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id})
    .then((response) => {
        console.log("deleted", response);
        return res.status(200).json({
            "message": "Post Deleted"
        });
    })
    
});

module.exports = router;
