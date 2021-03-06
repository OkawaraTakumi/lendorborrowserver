const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const LorB = require('../models/lendOrBorrow');
const errorHandler = require('../middlewares/error');

const ObjectId = require('mongodb').ObjectId

//state値を置き換えている
const KEEP_LORB = 1;
const ON_SUGGUESTING = 2;
const COMPLETED = 3;
const ON_MAKING_LORB = 4;
const REJECTED = 5;

//LorBTableの作成
exports.createLorB = asyncHandler(async (req, res, next) => {
    const {
        title,
        detailClass,
        aboutDetail,
        userTo,
        userToName,
        userFrom,
        userFromName,
        userForApprove
    } = req.body

    const LorBdetail = {
        title:title,
        detailClass:detailClass,
        aboutDetail:aboutDetail,
        userForApprove:userForApprove
    }

    const reqUserTo = ObjectId(userTo)
    const reqUserFrom = ObjectId(userFrom)
    
    const LorBWillCreate = {
        LorBBox:LorBdetail,
        userTo: reqUserTo,
        userToName:userToName,
        userFrom: reqUserFrom,
        userFromName:userFromName,
    }

    try {
        const lorb =await LorB.create(LorBWillCreate);

        res.status(201).json({
        success:true
      });
    } catch(error) {
        next()
    }
    
});

//貸し借りテーブルをupdate
exports.updateLorBDetail= asyncHandler(async (req, res, next) => {
    const { 
            userFrom,
            userTo,
            detailClass,
            aboutDetail,
            title,
            userForApprove
          } = req.body
    
    const LorBWillUpdate = {
        title:title,
        detailClass:detailClass,
        aboutDetail:aboutDetail,
        LorBState:ON_MAKING_LORB,
        userForApprove:userForApprove
    }

    // const reqUserTo = ObjectId(userTo)
    // const reqUserFrom = ObjectId(userFrom)
    console.log(LorBWillUpdate)
    const LorBUpdated = await LorB.findOneAndUpdate({
                                                userFrom,
                                                userTo,
                                                }, {$push:{LorBBox:LorBWillUpdate}});                                     
    if(!LorBUpdated) {
        return next (new ErrorResponse('貸し借りが存在していません', 400))
    }

    res.status(201).json({
        success: true,
    })
})

//貸し借りの作成を承認
exports.approveCreate= asyncHandler(async (req, res, next) => {
    const { 
        userFrom,
        userTo,
        id
    } = req.body
    console.log(userFrom)
    console.log(userTo)
    console.log(id)
    const reqApproveId = ObjectId(id)

    const negotiateWillApprove = await LorB.findOneAndUpdate({
                                                userFrom,
                                                userTo,
                                                "LorBBox._id":reqApproveId
                                                }, {$set:{"LorBBox.$.LorBState": KEEP_LORB}});
    if(!negotiateWillApprove) {
        return next (new ErrorResponse('承認できませんでした', 400))
    }

    res.status(200).json({
        success: true
    })
})


//貸し借りの作成を拒否
exports.rejectCreate= asyncHandler(async (req, res, next) => {
    const { 
        userFrom,
        userTo,
        id
    } = req.body
    console.log(userFrom)
    console.log(userTo)
    console.log(id)
    const reqApproveId = ObjectId(id)

    const negotiateWillApprove = await LorB.findOneAndUpdate({
                                                userFrom,
                                                userTo,
                                                "LorBBox._id":reqApproveId
                                                }, {$set:{"LorBBox.$.LorBState": REJECTED}});
    if(!negotiateWillApprove) {
        return next (new ErrorResponse('承認できませんでした', 400))
    }

    res.status(200).json({
        success: true
    })
})

//LorBドキュメントを全て取得
exports.getAllLorB = asyncHandler(async (req, res, next) => {
    const allLorB = await LorB.find({})
    console.log(allLorB)
    res.status(200).json({
        success: true,
        data: allLorB
    })
}) 

//任意の相手との貸し借りを取得
exports.getLorB = asyncHandler(async (req, res, next) => {
    const { 
        userFrom,
        userTo
      } = req.body
console.log("動いてます")

const reqUserTo = ObjectId(userTo)
const reqUserFrom = ObjectId(userFrom)
    
    const targetLorB = await LorB.find({
        userFrom:reqUserFrom,
        userTo:reqUserTo
    });
    
    if(!targetLorB) {
        return next (new ErrorResponse('貸し借りが存在していません', 400))
    }

    res.status(200).json({
        success: true,
        data: targetLorB
    })
} )


//作成依頼中の貸し借りの取得
exports.getOnMaking= asyncHandler(async (req, res, next) => {
    const  userForApprove  = req.user.id
    console.log(userForApprove)
    const onMaking = await LorB.aggregate([
        {
            $match: {"LorBBox.LorBState":ON_MAKING_LORB}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":ON_MAKING_LORB
            }
        },
        {
            $match:{
                "LorBBox.userForApprove":userForApprove
            }
        }
    ])
    
    if(!onMaking) {
        return next (new ErrorResponse('取得に失敗しました', 400))
    }
    const count = onMaking.length

    res.status(200).json({
        success:true,
        onMaking:{
            onMaking:onMaking,
            count:count   
        }
    })
})

//交渉提案中の貸し借りの取得
exports.getOnBeingSuggested = asyncHandler(async (req, res, next) => {
    const user = req.user.id
    console.log(user)
    const onBeingSuggested = await LorB.aggregate([
        {
            $match: {userTo:user}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":ON_SUGGUESTING
            }
        }
    ])
    
    if(!onBeingSuggested) {
        return next (new ErrorResponse('取得に失敗しました', 400))
    }
    const count = onBeingSuggested.length

    res.status(200).json({
        success:true,
        onBeingSuggested:{
            onBeingSuggested,
            count
        }
    })
})



//解消済みの貸し借りを取得
exports.getLorBCompleted = asyncHandler(async (req, res, next) => {
    const user = req.user.id
console.log("完了済みの取得動いてます")
// const reqUserFrom = ObjectId(userFrom)
    
    const LCompleted = await LorB.aggregate([
        {
            $match:  {userFrom:user}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":COMPLETED
            }
        }
    ])

    const BCompleted = await LorB.aggregate([
        {
            $match: {userTo:user}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":COMPLETED
            }
        }
    ])    
    
    // if(!LorBCompleted) {
    //     return next (new ErrorResponse('完了済みの貸し借りはありません', 400))
    // }

    res.status(200).json({
        success: true,
        completed:{
            LCompleted,
            BCompleted
        }
    })
} )


//継続中の貸し借りを取得
exports.getLorBKeepLorB = asyncHandler(async (req, res, next) => {
    const user = req.user.id
    console.log(user)
    const LKeepOn = await LorB.aggregate([
        {
            $match:  {userFrom:user}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":KEEP_LORB
            }
        }
    ])

    const BKeepOn = await LorB.aggregate([
        {
            $match: {userTo:user}
        },
        {
            $unwind:"$LorBBox"
        },
        {
            $match:{
                "LorBBox.LorBState":KEEP_LORB
            }
        }
    ])    
    

    res.status(200).json({
        success: true,
        keepLorB: {
            LKeepOn:LKeepOn,
            LCount:LKeepOn.length,
            BKeepOn:BKeepOn,
            BCount:BKeepOn.length
        }
    })
} )


exports.getLorBIhave = asyncHandler( async (req, res, next) => {
    const userTo = req.user.Id

const reqUserTo = ObjectId(userTo)

      const LorBIhave = await LorB.find({$or:[
        {userFrom:reqUserTo},
        {userTo:reqUserTo}
    ]}
    // , function (err, docs) {
    //     if(err) next(new ErrorResponse('該当する貸し借りがありませんでした',400))
    // }
    )

    console.log(LorBIhave)

    res.status(200).json({
        success:true,
        data:LorBIhave
    })
} )

//貸し借りテーブルの削除

exports.deleteLorBtable = asyncHandler (async (req, res, next) => {
    console.log("実行")
    // const index = req.params.index
    const { 
        userFrom,
        userTo,
        id
      } = req.body

    const reqLorBId = ObjectId(id)

    try {await LorB.findOneAndUpdate({
        userFrom,
        userTo,
        "LorBBox._id":reqLorBId
        }, {$set:{"LorBBox.$.LorBState":COMPLETED}})

        res.status(204).json({
            success: true
        })
    } catch {
        next(new ErrorResponse('貸し借りが存在していません', 400))
    }
});





//negotiatearrayを作成、更新
exports.updateNegotiate= asyncHandler(async (req, res, next) => {
    const { 
            userFrom,
            userTo,
            negotiateItem,
            negotiateDetail,
            id
          } = req.body

    
    
    const negotiateWillUpdate = {
        negotiateItem:negotiateItem,
        negotiateDetail:negotiateDetail
    }
    console.log(id,'idはこれ')
    const reqNegotiateId = ObjectId(id)

    const negotiateUpdated = await LorB.findOneAndUpdate({
                                                userFrom,
                                                userTo,
                                                "LorBBox._id":reqNegotiateId
                                                }, {$set:{"LorBBox.$.negotiateItem":negotiateItem,
                                                          "LorBBox.$.negotiateDetail":negotiateDetail,
                                                          "LorBBox.$.LorBState":ON_SUGGUESTING }});
    console.log(negotiateUpdated)
    if(!negotiateUpdated && negotiateDetail) {
        return next (new ErrorResponse('貸し借りが存在していません', 400))
    }

    res.status(200).json({
        success: true
    })
})


//交渉を拒否
exports.rejectNegotiate= asyncHandler(async (req, res, next) => {
    const { 
        userFrom,
        userTo,
        id
    } = req.body

    const reqApproveId = ObjectId(id)

    const negotiateWillApprove = await LorB.findOneAndUpdate({
                                                userFrom,
                                                userTo,
                                                "LorBBox._id":reqApproveId
                                                }, {$set:{"LorBBox.$.LorBState": KEEP_LORB}});
    if(!negotiateWillApprove) {
        return next (new ErrorResponse('拒否できませんでした', 400))
    }

    res.status(200).json({
        success: true
    })
})

