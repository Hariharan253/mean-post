const express = require("express");

const Post = require("../models/post")

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId //adding the user Id to the creator field, the userData request parameter was formed in checkAuth Middleware
    });

    post.save()
    .then((createdPost) => {
        return res.status(200).json({
            message: "Post Added Successfully",
            postId: createdPost._id,        
        });        
    });
    console.log(post);
});

router.get("",(req, res, next) => {
    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    let fetchedPosts;

    const postQuery = Post.find();
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery
    .then((documents) => {
        fetchedPosts = documents;
        return Post.count();
    })
    .then((count) => {
        return res.status(200).json({
            message: "Post Sent successfully",
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    ;

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

router.put("/:id", checkAuth, (req, res, next) => { //adding creator to the deleteOne query will update if the user who created is trying to delete
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });

    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then((result) => {
        console.log("updated Result", result);
        if(result.modifiedCount > 0) //modifiedCount will be 1 if the mongoose delete query is executed
            return res.status(200).json({"message": "Update Successful"})
        else
            return res.status(401).json({"message": "User Unauthorizes"});
    })
});

router.delete("/:id", checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}) //adding creator to the deleteOne query will delete if the user who created is trying to delete
    .then((response) => {
        console.log("deleted", response);
        if(response.deletedCount > 0) { //deletedCount will be 1 if the mongoose delete query is executed
            return res.status(200).json({
                "message": "Post Deleted"
            });
        }
        else {
            return res.status(401).json({"message": "User Unauthorized"})
        }
    })
    
});

module.exports = router;
