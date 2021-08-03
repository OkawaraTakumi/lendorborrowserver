const express = require('express');
const {
    login,
    register,
    getCurrentUser,
} = require ('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/getCurrentUser', protect, getCurrentUser);

module.exports = router;