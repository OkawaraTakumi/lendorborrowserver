const express = require('express');
const router = express.Router({mergeParams:true});
const {
    createLorB,
    getLorB,
    getAllLorB,
    updateLorBDetail,
    getLorBIhave,
    updateNegotiate,
    deleteLorBtable,
    getLorBCompleted,
    getOnBeingSuggested,
    getLorBKeepLorB,
    approveCreate,
    rejectCreate,
    getOnMaking
} = require("../controllers/lendOrBorrow")

const { protect } = require('../middlewares/auth');

router.use(protect)

//createが呼び出され、すでにLorBが存在していた場合は更新処理
router.post('/createLorB', createLorB, updateLorBDetail)
router.put('/approveCreate', approveCreate)
router.put('/rejectCreate', rejectCreate)
router.get('/getOnMaking', getOnMaking)
router.get('/getOnBeingSuggested', getOnBeingSuggested)
router.get('/getLorB', getLorB)
router.get('/getLorBKeepLorB', getLorBKeepLorB)
router.get('/getAllLorB', getAllLorB)
router.get('/getLorBIhave', getLorBIhave)
router.get('/getLorBCompleted', getLorBCompleted)
router.put('/updateNegotiate', updateNegotiate)
router.put('/deleteLorBtable', deleteLorBtable);




module.exports = router;