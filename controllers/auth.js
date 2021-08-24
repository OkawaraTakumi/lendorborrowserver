const crypto = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User  = require('../models/User');

//ユーザー登録
exports.register = asyncHandler( async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    })

//トークンとクッキーを生成
sendTokenResponse(user, 200, res)
});

//ユーザーログイン
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

//パスワードが一致するか
    const isMatch = await user.matchPassWord(password);

//一致しない時
    if(!isMatch) {
        return next (new ErrorResponse('Invalid credentials',401));
    }
//トークンとクッキーを生成
    sendTokenResponse(user, 200, res)
});


//ログインユーザーの情報を取得

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
    console.log(req.user)
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//modelからtokenを取得し、cookieを生成

const sendTokenResponse = (user, statusCode, res) => {
    console.log(user,'作成されたユーザー')
    const token = user.getSignedJwtToken();

    const options = {
        expires:new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    const { name, _id } = user
    console.log(token,'動いてます')
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
          success:true,
          token,
          user:{
              name,
              id:_id
          }
      })
} 


