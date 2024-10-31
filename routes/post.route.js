const express = require('express');
const postController = require('../controllers/post.controller');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
router.use(authController.authenticate);

router.post('', postController.createPost);
router.get('', postController.getPosts);
router.get('/:id', postController.getPostById);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;