const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    comment:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    hotelName:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true})

const reviews=mongoose.model('reviews',reviewSchema)

module.exports={
    reviews
}