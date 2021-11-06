// index.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./app/mongoose/mongoose");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const MongoDBStore = require("connect-mongo");
const { FDRouter } = require("./routes/web");
const { hotelRouter } = require("./routes/api");
const passport = require("passport");
const path = require("path");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "lflnjndfsjndjnf",
    store: MongoDBStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/food-delivery-api",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
const port = process.env.PORT || 3300;

app.use(express.json());
app.use(FDRouter);
app.use(hotelRouter);

// const { foodCategory } = require("./app/models/category");
//const { Hotel } = require("./app/models/hotelModel");
//const { User } = require('./app/models/user');
//const main = async function () {
//   // const category = await foodCategory
//   //   .findById("61484e3e47b742ec13ef8dab")
//   //   .populate({ path: "owner" })
//   //   .populate({ path: "foods" })
//   //   .exec();
//   //console.log(category);
// const hotel = await Hotel.findById("615363c3cdfc8addf32318dd")
//   .populate({
//     path: "bookMarkedUser",
//   })
//   .exec();
//  console.log(hotel.bookMarkedUser);
// const user = await User.findById("615c9dcfa239dab32dc57d10").populate({
//   path:'bookMarks'
// }).exec();
// console.log(user.bookMarks);
//};
//main();
// const querystring = require("querystring");
// const url = "http://example.com/index.html?&key=12&id=false";
// const qs = "code=string&key=12&id=false";

// //console.log(querystring.parse(qs));
// // > { code: 'string', key: '12', id: 'false' }

// console.log(querystring.parse(url));

app.listen(port, function () {
  console.log("Server is listening at port " + port);
});
