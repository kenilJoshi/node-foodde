const mongoose = require("mongoose");

const likeFoodSchema = new mongoose.Schema({
  likeFood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true,
  },
  hotelName:{
    type:String,
    trim:true,
    required:true
  },
  foodName: {
    type: String,
    trim: true,
    required:true
  },
});

const likedFoods = mongoose.model("likedFoods", likeFoodSchema);

module.exports = {
  likedFoods,
};
