const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      require: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodCategory",
      },
    ],
    likedFood: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// foodSchema.virtual("owner", {
//   ref: "foodCategory",
//   localField:'_id',
//   foreignField:'owner'
// });

const foods = mongoose.model("food", foodSchema);

module.exports = {
  foods,
};
