const express = require("express");
const queryString = require("querystring");
const Noty = require("noty");
const { User } = require("../app/models/User/user");
const { Hotel } = require("../app/models/Hotel/hotelModel");
const { foodCategory } = require("../app/models/Hotel/category");
const { foods } = require("../app/models/Hotel/food");
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("../app/middleware/authForUser");
const { likedFoods } = require("../app/models/User/likedFood");
const { bookMarks } = require("../app/models/User/bookMark");
const { reviews } = require("../app/models/User/review");
const axios = require("axios");
const moment = require("moment");
const { orderDetails } = require("../app/models/User/orderDetails");
const passport = require("passport");
const FDRouter = new express.Router();

FDRouter.get("/", async (req, res) => {
  try {
    const url = queryString.parse(req.url);
    const hotel = await Hotel.find({});
    res.render("../views/template/home", { hotels: hotel });
  } catch (e) {
    res.status(404).send(e);
  }
});
FDRouter.get("/food", (req, res) => {
  res.render("../views/template/food", { layout: "food" });
});
FDRouter.get("/about", (req, res) => {
  res.render("../views/template/about", { layout: "layout" });
  console.log(req.url);
});
FDRouter.get("/offer", (req, res) => {
  res.render("../views/template/offer");
});
FDRouter.get("/cart", async (req, res) => {
  const orderedFood = [];
  if (req.session.cart) {
    const sessionCart = req.session.cart.items;
    const inArray = Object.values(sessionCart);
    //console.log(inArray);
    for (var i = 0; i < inArray.length; i++) {
      const specificFood = await foods
        .findById(inArray[i].items._id)
        .populate({
          path: "owner",
        })
        .exec();
      orderedFood.push({
        ...specificFood,
        qty: inArray[i].qty,
      });
    }
    // console.log(orderedFood);
    // console.log(orderedFood.length);
    res.render("../views/cart/cart", { foodOrdered: orderedFood });
  } else {
    res.render("../views/cart/noOrder");
  }
});
FDRouter.get("/register", forwardAuthenticated, (req, res) => {
  res.render("../views/template/register");
});
FDRouter.post("/register", async (req, res) => {
  const errors = [];
  var password =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const { email, password1, password2 } = req.body;
  if (!email || !password1 || !password2) {
    errors.push({ msg: "Please fill all the details" });
  }
  if (password1 != password2) {
    errors.push({ msg: "Password do not match" });
  }
  if (password1.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (!password1.match(password)) {
    errors.push({
      msg: "Password should contain atleast one uppercase,one number and one special character",
    });
  }
  if (!email.match(emailformat)) {
    errors.push({ msg: "Please enter valid email address" });
  }
  if (errors.length != 0) {
    res.render("register", { errors });
  } else {
    const user = new User({ email, password1 });
    try {
      await user.save();
      res.status(200).render("../views/template/login");
    } catch (e) {
      res.status(404).send(e);
    }
  }
});
FDRouter.get("/login", forwardAuthenticated, (req, res) => {
  res.render("../views/template/login");
});
FDRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
  console.log("kenil");
});
FDRouter.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  return res.redirect("/login");
});
FDRouter.post("/delete", async (req, res) => {
  await User.deleteOne({ email: req.user.email });
  return res.redirect("/login");
});
FDRouter.post("/updateCart", async (req, res) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
      deliveryPrice: 0,
    };
  }
  let cart = req.session.cart;
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      items: req.body,
      qty: 1,
    };
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
    cart.deliveryPrice = 0;
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
    cart.deliveryPrice = 0;
  }
  res.json({ totalQty: req.session.cart.totalQty });
});
FDRouter.post("/addOrderDetails", ensureAuthenticated, async (req, res) => {
  // const existingOrder = await orderDetails.findOne({ owner: req.user._id });
  const sessionCart = req.session.cart.items;
  const inArray = Object.values(sessionCart);
  const id = req.user.email;
  //if (!existingOrder) {
  const order = new orderDetails({
    ...req.body,
    owner: req.user._id,
  });
  for (var i = 0; i < inArray.length; i++) {
    order.orders.push({ items: inArray[i].items._id, qty: inArray[i].qty });
  }
  await order.save();
  res.redirect(`/${id}/orders`);
});
FDRouter.post("/updateBookmark", ensureAuthenticated, async (req, res) => {
  const hotelId = req.body._id;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    user.bookMarkedHotel.push(hotelId);
    const hotel = await Hotel.findById(hotelId);
    hotel.bookMarkedUser.push(userId);
    const bookMark = new bookMarks({
      bookMarkedHotel: hotelId,
      owner: userId,
      hotelName: req.body.name,
    });
    await bookMark.save();
    await hotel.save();
    await user.save();
  } catch (e) {
    console.log("Error");
  }
});
FDRouter.post("/likedFood", ensureAuthenticated, async (req, res) => {
  const foodId = req.body._id;
  const userId = req.user._id;
  const hotelForFood = await foods
    .findById(foodId)
    .populate({
      path: "owner",
    })
    .exec();
  try {
    const user = await User.findById(userId);
    user.likedFood.push(foodId);
    const food = await foods.findById(foodId);
    food.likedFood.push(userId);
    const likeFood = new likedFoods({
      likeFood: foodId,
      owner: userId,
      hotelName: hotelForFood.owner.name,
      foodName: req.body.name,
    });
    await likeFood.save();
    console.log(user);
    await user.save();
    await food.save();
  } catch (e) {
    console.log("error");
  }
});
FDRouter.get("/:id/orders", ensureAuthenticated, async (req, res) => {
  const order = await orderDetails
    .find({ owner: req.user._id })
    .populate({
      path: "orders.items",
    })
    .exec();
  const allOrderItems = [];
  for (var i = 0; i < order.length; i++) {
    const orderItem = [];
    const orderInArray = Object.values(order[i].orders);
    for (var j = 0; j < orderInArray.length; j++) {
      orderItem.push(`${orderInArray[j].items.name}-${orderInArray[j].qty}`);
    }
    allOrderItems.push(orderItem);
  }
  const map1 = new Map();
  for (var i = 0; i < order.length; i++) {
    map1.set(order[i]._id, allOrderItems[i]);
  }
  const map2 = new Map();
  for (var i = 0; i < order.length; i++) {
    map2.set(
      order[i]._id,
      moment(order[i].createdAt).format("MMMM Do YYYY, h:mm:ss a")
    );
  }
  res.status(200).render("../views/userProfile/profile", {
    orders: order,
    orderSection: map1,
    timeAndDate: map2,
  });
});
FDRouter.get("/:id/bookMarks", ensureAuthenticated, async (req, res) => {
  const bookMark = await bookMarks.find({ owner: req.user._id });
  console.log(bookMark);
  res.status(200).render("../views/userProfile/bookmarks", {
    bookMarkedHotel: bookMark,
  });
});
FDRouter.post("/deleteBookmark", async (req, res) => {
  const hotel = await Hotel.findById(req.body.bookMarkedHotel);
  for (var i = 0; i < hotel.bookMarkedUser.length; i++) {
    if ((hotel.bookMarkedUser[i] = req.user._id)) {
      hotel.bookMarkedUser.splice(i, 1);
    }
  }
  await hotel.save();
  const user = await User.findById(req.user._id);
  for (var i = 0; i < user.bookMarkedHotel.length; i++) {
    if ((user.bookMarkedHotel[i] = req.body._id)) {
      user.bookMarkedHotel.splice(i, 1);
    }
  }
  await user.save();
  console.log(hotel);
  await bookMarks.deleteOne({
    owner: req.user._id,
    hotelName: req.body.hotelName,
  });
});
FDRouter.get("/bookMark/:id", async (req, res) => {
  const id = req.params.id;
  const hotel = await Hotel.findOne({ name: id });
  console.log(hotel.bookMarkedUser);
  for (var i = 0; i < hotel.bookMarkedUser.length; i++) {
    if ((hotel.bookMarkedUser[i] = req.user._id)) {
      hotel.bookMarkedUser.splice(i, 1);
    }
  }
  await hotel.save();
  const user = await User.findById(req.user._id);
  for (var i = 0; i < user.bookMarkedHotel.length; i++) {
    if ((user.bookMarkedHotel[i] = req.body._id)) {
      user.bookMarkedHotel.splice(i, 1);
    }
  }
  const filter = user.bookMarkedHotel.filter(function (el) {
    return el != null;
  });
  user.bookMarkedHotel = filter;
  await user.save();
  await bookMarks.deleteOne({ owner: req.user._id, hotelName: id });
  res.redirect("..");
});
FDRouter.get("/:id/likedFood", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ email: req.params.id })
    .populate({
      path: "likedFood",
    })
    .exec();
  res
    .status(200)
    .render("../views/userProfile/liked", { likedFood: user.likedFood });
});
FDRouter.post("/:id/addComment", async (req, res) => {
  const id = req.params.id;
  const hotel = await Hotel.findOne({ name: id });
  console.log(hotel);
  const comment = new reviews({
    comment: req.body.comment,
    owner: req.user._id,
    hotelName: id,
  });
  await comment.save();
  const user = await User.findById(req.user._id);
  user.reviewId.push(comment._id);
  await user.save();
  res.status(200).redirect(`/${id}`);
});
FDRouter.get("/:id", async (req, res) => {
  const food = [];
  const id = req.params.id;
  try {
    const hotel = await Hotel.findOne({ name: id })
      .populate({
        path: "category",
      })
      .populate({
        path: "foods",
      })
      .exec();
    var bookMark;
    if (req.user) {
      bookMark = await bookMarks.find({
        bookMarkedHotel: hotel._id,
        owner: req.user._id,
      });
    } else if (!req.user) {
      bookMark = [];
    }
    for (var i = 0; i < hotel.category.length; i++) {
      const specificCategory = await foodCategory
        .findById(hotel.category[i]._id)
        .populate({
          path: "foods",
        })
        .exec();
      food.push(specificCategory);
    }
    const hotelCategory = hotel.category;
    var likeFood;
    if (req.user) {
      likeFood = await likedFoods.find({ owner: req.user._id, hotelName: id });
    } else if (!req.user) {
      likeFood = [];
    }
    const allReview = await reviews
      .find({ hotelName: id })
      .populate({
        path: "owner",
      })
      .exec();
    res.status(200).render("../views/template/food", {
      hotel: hotel,
      hotelCategory: hotelCategory,
      hotelFood: food,
      bookMarkedHotel: bookMark,
      likeFood: likeFood,
      allReview: allReview,
      layout: "../views/template/food",
    });
    //res.send(hotel)
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = {
  FDRouter,
  axios,
};
