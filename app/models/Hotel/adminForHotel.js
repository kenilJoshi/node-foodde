const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminForHotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not strong Enough");
      }
    },
  },
  hotelsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminForHotelSchema.statics.findTheAdmin = async (loginInfo) => {
  const adminEmail = await AdminForHotel.findOne({ email: loginInfo.email });
  if (!adminEmail) {
    throw new Error("The admin is not present");
  }
  const checkPassword = await bcrypt.compare(
    loginInfo.password,
    adminEmail.password
  );
  if (!checkPassword) {
    throw new Error("Please check your Password or Email");
  } else {
    return adminEmail;
  }
};

adminForHotelSchema.methods.tokenCreationForAdmin = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "euncnchchsakahs");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

adminForHotelSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
  next();
});

const AdminForHotel = mongoose.model("AdminForHotel", adminForHotelSchema);

module.exports = {
  AdminForHotel,
};
