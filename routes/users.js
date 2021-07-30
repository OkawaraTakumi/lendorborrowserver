const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    followUser,
    getFollow,
    getFollower
} = require('../controllers/users');

const { protect } = require('../middlewares/auth');


router.get('/fetchUsers', getUsers)

router.post('/register', createUser)

router.route('/edit/:id')
      .get(getUser)
      .put(updateUser)
      .delete(deleteUser)

router.post('/followUser', protect, followUser)
router.get('/getFollow', protect, getFollow)
router.get('/getFollower', protect, getFollower)

module.exports = router;
