const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    payment: {
      type: String,
      required: true,
      default: "COD",
    },
    orders: [
      {
        items: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
        },
        qty: {
          type: Number,
          trim: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const orderDetails = mongoose.model("orderDetails", orderSchema);

module.exports = {
  orderDetails,
};
