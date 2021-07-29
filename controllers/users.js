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
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success:true,
        data:user
    });
});

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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        data: user
    });
});


exports.deleteUser = asyncHandler(async (req, res ,next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        data:{}
    });
});





