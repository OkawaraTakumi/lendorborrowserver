const express = require('express');
const {
    login,
    register,
    updateLorBTable,
    getCurrentUser,
} = require ('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register',register);
router.post('/login',login);
// router.put('/updateLorBTable', protect , updateLorBTable);
router.get('/getCurrentUser', protect, getCurrentUser);
// router.delete('/deleteLorBtable/:index', protect, deleteLorBtable);

module.exports = router;