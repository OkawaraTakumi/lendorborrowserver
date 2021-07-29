const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');


router.get('/fetchUsers', getUsers)

router.post('/register', createUser)

router.route('/edit/:id')
      .get(getUser)
      .put(updateUser)
      .delete(deleteUser)


module.exports = router;
