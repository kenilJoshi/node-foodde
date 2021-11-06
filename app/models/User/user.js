const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please check your Email");
        }
      },
    },
    password1: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong Enough");
        }
      },
    },
    role: {
      type: String,
      default: "costomer",
    },
    bookMarkedHotel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ],
    likedFood: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
    ],
    reviewId:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'reviews'
      }
    ]
  },
  { timestamps: true }
);

userSchema.virtual("orderDetails", {
  ref: "orderDetails",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "owner",
});

userSchema.statics.findByCredentials=async(email,password)=>{
    const userEmail=await User.findOne({email})
    if(!userEmail){
        throw new Error('Enable to connect')
    }
    const checkPassword=await bcrypt.compare(password,userEmail.password1)
    if(!checkPassword){
        throw new Error('Please check your Password or Email')
    }
    return userEmail
};
userSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password1')){
        user.password1=await bcrypt.hash(user.password1,10)
    }
    next();
})
const User=mongoose.model('User',userSchema)

module.exports = {
    User
}