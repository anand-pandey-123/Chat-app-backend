const express = require('express');
const { getAllUsers, createUser, loginUser } = require('../controllers/user');
const authUser = require('../middlewares/auth');
const upload = require('../utils/multer');
const router = express.Router();

router.get('/', authUser, getAllUsers)
router.post('/signup', upload.single('profileImage'), createUser)
router.post('/login', loginUser)



module.exports = router;