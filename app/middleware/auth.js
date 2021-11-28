const jwt = require("jsonwebtoken");
const { AdminForHotel } = require("../models/Hotel/adminForHotel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "euncnchchsakahs");
    const admin = await AdminForHotel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!admin) {
      throw new Error("error");
    }
    req.admin = admin;
    next();
  } catch (e) {
    res.status(404).send("Please Authenticate", e);
  }
};

const authForAdmin = async (req, res, next) => {
  try {
    const token = req.cookies["adminLogin"];
    const decoded = jwt.verify(token, "euncnchchsakahs");
    const admin = await AdminForHotel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!admin) {
      throw new Error("error");
    }
    res.locals.admin = admin;
    req.admin = admin;
    next();
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = {
  auth,
  authForAdmin,
};
