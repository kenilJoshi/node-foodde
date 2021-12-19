// index.js
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
require("./app/mongoose/mongoose");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const { Server } = require("socket.io");
const io = new Server(server);
const MongoDBStore = require("connect-mongo");
const { FDRouter } = require("./routes/web");
const { hotelRouter } = require("./routes/api");
const passport = require("passport");
const Emitter = require("events");
const path = require("path");
var methodOverride = require("method-override");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "lflnjndfsjndjnf",
    store: MongoDBStore.create({
      mongoUrl:
        "mongodb+srv://Bkj:Bkj%405454721@cluster0.k3tur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

const passportInit = require("./app/config/passport");
//const { authForAdmin } = require("./app/middleware/auth");
//console.log(authForAdmin());
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
const port = process.env.PORT || 3300;

app.use(express.json());
app.use(FDRouter);
app.use(hotelRouter);

io.on("connection", (socket) => {
  socket.on("join", (user) => {
    socket.join(user);
  });
});
eventEmitter.on("userId", (data) => {
  io.to(`${data}`).emit("userId", data);
});
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

server.listen(port, function () {
  console.log("Server is listening at port " + port);
});
