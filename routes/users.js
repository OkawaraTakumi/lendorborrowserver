const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getUser,
    updateUser,
    deleteUser,
    followUser,
    getFollow,
    getFollower
} = require('../controllers/users');

const { protect } = require('../middlewares/auth');

router.use(protect)


// router.get('/fetchUsers', getUsers)  今のところ必要ない
// router.post('/register', createUser) この機能はauthに移植

router.route('/edit')
      .get(getUser)
      .put(updateUser)
      .delete(deleteUser)

router.post('/followUser', followUser)
router.get('/getFollow', getFollow)
router.get('/getFollower', getFollower)

module.exports = router;
