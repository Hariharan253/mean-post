const Post = require("../models/post")

exports.createPost = (req, res, next) => {
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
    })
    .catch(error => {
        return res.status(500).json({
            message: "Creating a Post Failed"
        })
    })  
};

exports.updatePost = (req, res, next) => { //adding creator to the deleteOne query will update if the user who created is trying to delete
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });

    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then((result) => {
        console.log("updated Result", result);
        if(result.matchedCount > 0 || result.modifiedCount > 0) //matchedCount will be 1 if the mongoose has found a Data
            return res.status(200).json({"message": "Update Successful"})
        else
            return res.status(401).json({"message": "User Unauthorizes"});
    })
    .catch(error => {
        return res.status(200).json({
            "message": "Updating a Post Failed"
        });
    })
};

exports.getPosts = (req, res, next) => {
    
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
    .catch(error => {
        return res.status(200).json({
            "message": "Getting a Post Failed"
        });
    })

};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
    .then((post) => {
        if(post) {
            return res.status(200).json({message: "Post Found", post: post});
        }
        else {
            return res.status(404).json({message: "Post Not Found"});
        }
    })
    .catch(error => {
        return res.status(200).json({
            "message": "Getting a Post Failed"
        });
    })
};

exports.deletePost = (req, res, next) => {
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
    .catch(error => {
        return res.status(200).json({
            "message": "Deleting a Post Failed"
        });
    })
    
}