const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

const hotelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    bookMarkedUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

hotelSchema.virtual('category',{
    ref:'foodCategory',
    localField:'_id',
    foreignField:'owner'
})
hotelSchema.virtual("foods", {
  ref: "food",
  localField: "_id",
  foreignField: "owner",
});


hotelSchema.statics.findByCredentials= async(name)=>{
    const hotelName=await Hotel.findOne({name})
    if(!hotelName){
        throw new Error("Enable to connect");
    }
    return hotelName
};
hotelSchema.methods.tokenCreation=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},'euncnchchsakahs');
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
}
// hotelSchema.methods.categoryCreation=async function(category){
//     const user=this;
//     user.categories = user.categories.concat({ category });
//     console.log(user.categories);
//     await user.save();
//     return category
// }

const Hotel=mongoose.model('Hotel',hotelSchema)


module.exports={
    Hotel,
}