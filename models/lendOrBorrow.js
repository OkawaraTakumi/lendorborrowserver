const mongoose = require('mongoose');

const LorBdetailSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    detailClass:{
        type:String,
        require:true
    },
    aboutDetail:{
        type:String,require:true
    },
    LorBState:{
        type:Number,
        enum:[1,2,3,4],
        default:1
    },
    negotiateItem:{
        type:String,
        default:''
    },
    negotiateDetail:{
        type:String,
        default:''
    },
    userForApprove:{
        type:String,
        default:''
    }
})

const detailObj = mongoose.model('detailObj', LorBdetailSchema) 

const LorBSchema =  mongoose.Schema({
    LorBBox:[LorBdetailSchema],
    userTo:{
        type:String,
        require:true
    },
    userFrom:{
        type:String,
        require:true
    },
    createTime:{
        type:Date,
        default:Date.now
    }
})
//複合キーのユニークを設定
LorBSchema.index({userTo:1,userFrom:1}, { unique: true })

module.exports = mongoose.model('LorB', LorBSchema);