const mongoose=require('mongoose')

const bookMarkSchema=new mongoose.Schema({
    bookMarkedHotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    hotelName:{
        type:String,
        trim:true
    }
})

const bookMarks = mongoose.model("bookmark", bookMarkSchema);

module.exports = {
  bookMarks,
};