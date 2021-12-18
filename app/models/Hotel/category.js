const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
    ],
  },
  { timestamps: true }
);

const foodCategory = mongoose.model("foodCategory", categorySchema);

module.exports = {
  foodCategory,
};
