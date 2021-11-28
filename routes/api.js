const express = require("express");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");
const { AdminForHotel } = require("../app/models/Hotel/adminForHotel");
const { Hotel } = require("../app/models/Hotel/hotelModel");
const { foodCategory } = require("../app/models/Hotel/category");
const { orderDetails } = require("../app/models/User/orderDetails");
const { foods } = require("../app/models/Hotel/food");
const moment = require("moment");
const { auth, authForAdmin } = require("../app/middleware/auth");
const hotelRouter = new express.Router();
hotelRouter.use(cookieParser());

//from website api manuplation
hotelRouter.get("/loginForAdmin/login", (req, res) => {
  res.render("../views/admin/adminLogin", {
    layout: "../views/admin/adminLogin",
  });
});
hotelRouter.post("/adminlogin", async (req, res) => {
  const loginInfo = { email: req.body.email, password: req.body.password };
  try {
    const adminId = await AdminForHotel.findTheAdmin(loginInfo);
    const token = await adminId.tokenCreationForAdmin();
    res.cookie("adminLogin", token);
    const id = adminId._id.toString();
    res.redirect(`/${id}/adminOrders`);
  } catch (error) {
    res.status(404).send(error);
  }
});
hotelRouter.get("/:id/adminOrders", authForAdmin, async (req, res) => {
  const allOrders = await orderDetails.find({});
  const order = await orderDetails
    .find({})
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
  res.render("../views/admin/adminOrderPage", {
    orders: order,
    orderDetails: map1,
    date: map2,
    layout: "../views/admin/adminOrderPage",
  });
});
hotelRouter.get("/:id/adminHotels", authForAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.find({});
    res.render("../views/admin/adminHotelsPage", {
      hotels: hotel,
      layout: "../views/admin/adminHotelsPage",
    });
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.post("/registerHotel/admin", authForAdmin, async (req, res) => {
  const hotel = new Hotel({
    name: req.body.name,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    categories: [{ category: req.body.category }],
  });
  try {
    await hotel.save();
    res.status(200).redirect("/:id/adminHotels");
  } catch (e) {
    res.status(404).send(e);
  }
  //res.send(req.body);
});
hotelRouter.get("/:id/:id/hoteDashBoard", authForAdmin, async (req, res) => {
  res.cookie("hotel_id", req.params.id);
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate({
        path: "category",
      })
      .exec();
    res.status(200).render("../views/admin/adminHotelDashboard", {
      hotel: hotel,
      hotelCategory: hotel.category,
      layout: "../views/admin/adminHotelDashboard",
    });
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.patch("/:id/ubdateHotel?", authForAdmin, async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  try {
    if (req.body.name != "") {
      await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("It is empty");
    }
    if (req.body.address != "") {
      await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          address: req.body.address,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("It is empty");
    }
    if (req.body.phoneNumber != "") {
      await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          phoneNumber: req.body.phoneNumber,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("It is empty");
    }
    if (req.body.email != "") {
      await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          email: req.body.email,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("It is empty");
    }
    res.status(200).redirect(`/${req.admin.name}/${hotel._id}/hoteDashBoard`);
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.get("/:id/:id/categoryAndFood", authForAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.cookies["hotel_id"])
      .populate({
        path: "category",
      })
      .exec();
    const category = await foodCategory
      .findById(req.params.id)
      .populate({
        path: "foods",
      })
      .exec();
    res.cookie("category_id", category._id);
    res.status(200).render("../views/admin/adminCaegoryAndFood", {
      hotel: hotel,
      hotelCategory: hotel.category,
      category: category,
      hotelFoods: category.foods,
      layout: "../views/admin/adminCaegoryAndFood",
    });
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.patch("/:id/ubdateFood?", authForAdmin, async (req, res) => {
  const category = await foodCategory.findById(req.cookies["category_id"]);
  try {
    if (req.body.name != "") {
      await foods.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("the field is empty");
    }
    if (req.body.price != "") {
      await foods.findByIdAndUpdate(
        req.params.id,
        {
          price: req.body.price,
        },
        {
          new: true,
        }
      );
    } else {
      console.log("It is empty");
    }
    res
      .status(200)
      .redirect(`/${req.admin._id}/${category._id}/categoryAndFood`);
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.delete("/:id/deleteFood?", authForAdmin, async (req, res) => {
  try {
    const category = await foodCategory.findById(req.cookies["category_id"]);
    await foods.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .redirect(`/${req.admin._id}/${category._id}/categoryAndFood`);
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.post("/registerFood/admin", authForAdmin, async (req, res) => {
  const hotel = await Hotel.findById(req.cookies["hotel_id"]);
  const food = new foods({
    name: req.body.name,
    price: req.body.price,
    owner: hotel._id,
  });
  food.categories.push(req.cookies["category_id"]);
  const category = await foodCategory.findById(req.cookies["category_id"]);
  category.foods.push(food._id);
  try {
    await food.save();
    await category.save();
    res
      .status(200)
      .redirect(`/${req.admin._id}/${category._id}/categoryAndFood`);
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.patch(
  "/:id/hotelCategory/ubdateCategory?",
  authForAdmin,
  async (req, res) => {
    const category = await foodCategory.findById(req.cookies["category_id"]);
    try {
      if (req.body.category != "") {
        await foodCategory.findByIdAndUpdate(
          req.cookies["category_id"],
          {
            category: req.body.category,
          },
          {
            new: true,
          }
        );
      } else {
        console.log("it is empty");
      }
      res
        .status(200)
        .redirect(`/${req.admin._id}/${category._id}/categoryAndFood`);
    } catch (e) {
      res.status(404).send(e);
    }
  }
);
hotelRouter.delete(
  "/:id/hotelCategory/deleteCategory?",
  authForAdmin,
  async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.cookies["hotel_id"]);
      await foodCategory.findByIdAndDelete(req.params.id);
      res.status(200).redirect(`/${req.admin.name}/${hotel._id}/hoteDashBoard`);
    } catch (e) {
      res.status(404).send(e);
    }
  }
);
hotelRouter.post("/registerCategory/admin", authForAdmin, async (req, res) => {
  const hotel = await Hotel.findById(req.cookies["hotel_id"]);
  const newCategory = new foodCategory({
    category: req.body.category,
    owner: hotel._id,
  });
  res.cookie("category_id", newCategory._id);
  try {
    await newCategory.save();
    res
      .status(200)
      .redirect(`/${req.admin._id} /${newCategory._id}/categoryAndFood`);
  } catch (e) {
    res.status(404).send(e);
  }
});
//adminCreation
hotelRouter.post("/adminCreationOfHotel", async (req, res) => {
  const lengthOfAdmin = await AdminForHotel.find({});
  if (lengthOfAdmin.length < 1) {
    const adminHotel = new AdminForHotel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = await adminHotel.tokenCreationForAdmin();
    try {
      const saving = await adminHotel.save();
      res.status(200).send({ saving, token });
    } catch (error) {
      res.status(404).send(error);
    }
  } else {
    res.send("You cant create another admin");
  }
});
hotelRouter.post("/admin/login/pm", async (req, res) => {
  const loginInfo = { email: req.body.email, password: req.body.password };
  try {
    const adminId = await AdminForHotel.findTheAdmin(loginInfo);
    const token = await adminId.tokenCreationForAdmin();
    res.status(200).send({ adminId, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

//hotel details
hotelRouter.post("/admin/createHotel", auth, async (req, res) => {
  const hotel = new Hotel({
    name: req.body.name,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    categories: [{ category: req.body.category }],
  });
  res.cookie("hotel_id", hotel._id);
  const searchAdmin = await AdminForHotel.findById(req.admin._id);
  searchAdmin.hotelsId.push(hotel._id);
  try {
    const savingHotel = await hotel.save();
    const savingAdmin = await searchAdmin.save();
    res.status(200).send({ saveHotel: savingHotel, admin: savingAdmin });
  } catch (error) {
    res.status(404).send("error");
  }
});
hotelRouter.get("/hotels/allHotel", auth, async (req, res) => {
  try {
    const nameOfHotel = querystring.parse(req.url);
    console.log(nameOfHotel);
    if (nameOfHotel.name === undefined) {
      const findAllHotel = await Hotel.find({});
      res.status(200).send(findAllHotel);
    } else {
      const findAHotel = await Hotel.findOne({ name: nameOfHotel.name });
      res.status(200).send(findAHotel);
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

//Categories
hotelRouter.post("/admin/hotel/category", auth, async (req, res) => {
  const findHotel = await Hotel.findById(req.cookies["hotel_id"]);
  const categories = new foodCategory({
    ...req.body,
    owner: findHotel._id,
  });
  res.cookie("category_id", categories._id);
  try {
    const saving = await categories.save();
    res.status(200).send(saving);
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.get("/category/all", auth, async (req, res) => {
  try {
    const category = await foodCategory.find({ owner: req.hotel._id });
    res.status(200).send(category);
  } catch (e) {
    res.status(404).send(e);
  }
});

//foods details
hotelRouter.post("/food", auth, async (req, res) => {
  const findHotel = await Hotel.findById(req.cookies["hotel_id"]);
  const food = new foods({
    ...req.body,
    owner: findHotel._id,
  });
  //console.log(req.cookies["category_id"]);
  const category = await foodCategory.findById(req.cookies["category_id"]);
  category.foods.push(food._id);
  food.categories.push(req.cookies["category_id"]);
  try {
    const saving = await food.save();
    const savingCategory = await category.save();
    res.status(200).send({ saving, savingCategory });
  } catch (e) {
    res.status(404).send(e);
  }
});
hotelRouter.get("/food/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const food = await foods.findById(_id);
    res.status(200).send(food);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = {
  hotelRouter,
};
