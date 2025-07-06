const express = require('express');
const authUser = require('../middlewares/auth');
const { getAllChats } = require('../controllers/chat');
const router = express.Router();


router.get('/:targetId', authUser, getAllChats);


module.exports = router;