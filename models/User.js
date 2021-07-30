const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const FollowSchema = new mongoose.Schema({
    _id:{
      type:String,
      required:true,
      unique:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    }
})



const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please add a name'],
        unique:true
    },
    email:{
        type:String,
        requied:[true, 'please add a email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please add a valid email'
        ],
        unique:true
    },
    password:{
        type:String,
        required: [true, 'Please add a paaword'],
        minlength: 6,
        select: false,
        required:[true, 'please add a password'],
        unique:true
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    follow:{
        type:[FollowSchema],
        default:[]
    }
})
//パスワードを暗号化
UserSchema.pre('save',async function(next) {
    if(!this.isModified('password')){
        next();
    }
//salt値とは暗号化したいものにくっつけてよりわかりずらくするもの
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//JWTでトークンの生成
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET ,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

UserSchema.methods.matchPassWord = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

// UserSchema.methods.getResetPasswordToken = function () {
//     //トークンを生成
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     //トークンをハッシュ化しセットする
//     this.resetPasswordToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');

//     //期限の設定
//     this.resetPasswordExpire = Data.now() + 10 * 60 * 1000;
    
//     return resetToken
// }

module.exports = mongoose.model('User', UserSchema)