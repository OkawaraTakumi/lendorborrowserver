const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const mongoose = require('mongoose');
const User = require('../models/User');


//ユーザー情報をまとめて取得
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
})

//指定したユーザーの情報を取得
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.body.id);

    res.status(200).json({
        success:true,
        data:{
            id:user._id,
            name:user.name
        }
    });
});


//userをフォローして自分のフォローデータを取得
exports.followUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const DBId = await User.findOne({email:email}).select("_id, name")
    
    const user = await User.findOneAndUpdate({
        _id:req.user.id
        },{$addToSet:{follow:DBId}});

    const followData = await User.findOne({_id:req.user.id}).select("follow")

    res.status(200).json({
        success:true,
        data: {
            followData:followData.follow
        }
    });
})

//フォローデータを取得
exports.getFollow = asyncHandler(async (req, res, next) => {
    const followData = await User.findOne({_id:req.user.id}).select("follow")
    console.log(followData)
    const count = followData.follow.length
    res.status(200).json({
        success:true,
        data: {
            followData:followData.follow,
            count
        }
    });
})


//フォロワーのデータを取得
exports.getFollower = asyncHandler(async (req, res, next) => {
    
    const followerData = await User.aggregate([
        {
            $match: {"follow._id":req.user.id}
        },
        {
            $unwind:"$follow"
        },
        {
            $replaceRoot:{
                "newRoot":"$follow"
            }
        }
    ])
    
    if(!followerData) {
        return next (new ErrorResponse('取得に失敗しました', 400))
    }
    const count = followerData.length

    res.status(200).json({
        success:true,
        data:{
            followerData,
            count
        }
            
    })
})


//ユーザーの作成
exports.createUser = asyncHandler(async (req, res, next) => {
    const user =await User.create(req.body);

    res.status(201).json({
        success:true,
        data: user
    });
});

//ユーザー情報の更新
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        data: user
    });
});

//ユーザーの削除処理
exports.deleteUser = asyncHandler(async (req, res ,next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        data:{}
    });
});





