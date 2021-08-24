const jwt = require('jsonwebtoken');
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const ObjectId = require('mongodb').ObjectId

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    console.log(req.cookies.token)
    if(req.headers.authorization &&
       req.headers.authorization.startsWith('Bearer')
    ){
        //header情報からトークンを取得
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token
        console.log(token)
    } 

    if(!token) {
        //トークンがない場合エラー
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        //取得したトークンをでデコード
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //デコードしたidでユーザー情報を取得              
        req.user = await User.findById(decoded.id);
        console.log(req.user)
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
});