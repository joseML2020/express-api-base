const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
    const { title, text, author } = req.body;
    try {
        const newPost = new Post({ title, text, author });
        const savedPost = await newPost.save(); 
        return res.status(201).json(savedPost);
    } catch (error) {
        return res.status(400).json({ errors: error.errors });
    }
}
exports.getPosts = async (req, res) => {
    const posts = await Post.find();
    res.status(200).json(posts);
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: "Post not found" + error });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const item = await Post.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Post not found" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};