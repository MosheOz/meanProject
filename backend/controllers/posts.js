
const Post = require("../models/post");

exports.getAllPosts = (req, res, next) => {
  const postsPerPage = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let postsFetched;

  // if pagination asked by user and dif than undefiend
  if (postsPerPage && currentPage) {
    postQuery.skip(postsPerPage * (currentPage - 1)).limit(postsPerPage);
  }
  postQuery
    .then(documents => {
      postsFetched = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfuly",
        posts: postsFetched,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to fetch data!"
      })
    });
}

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Post not found!");
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Failed to fetch data!"
    })
  })
}

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save()
  .then(result => {
    res.status(201).json({
      message: "The post added successfuly",
      post: {
        ...result,
        id: result._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating post failed!"
    })
  })
}

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post editted successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Updating post failed!"
    })
  })
}

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({ _id: id, creator: req.userData.userId }).then(response => {
    if (response.n > 0) {
      res.status(200).json({ message: "The Item Deleted" });
    } else {
      res.status(401).json({ message: "Unauthrized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Failed to delete!"
    })
  });
}
