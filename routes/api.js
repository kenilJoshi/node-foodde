const express = require("express");
const cookieParser=require('cookie-parser')
const querystring = require("querystring");
const { Hotel } = require('../app/models/Hotel/hotelModel');
const {foodCategory}=require('../app/models/Hotel/category')
const {foods}=require('../app/models/Hotel/food')
const {auth}=require('../app/middleware/auth')
const hotelRouter = new express.Router();
hotelRouter.use(cookieParser())

//hotel details
hotelRouter.post("/hotel", async (req, res) => {
  const hotel = new Hotel({
    name: req.body.name,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    categories: [{ category: req.body.category }],
  });
  const token = await hotel.tokenCreation();
  try {
    const saving = await hotel.save();
    res.status(200).send({ saving, token });
  } catch (error) {
    res.status(404).send("error");
  }
});
hotelRouter.post('/hotel/login',async(req,res)=>{
  try{
    const hotel=await Hotel.findByCredentials(req.body.name)
    const token = await hotel.tokenCreation();
    res.status(200).send({hotel,token})
  }catch(e){
    res.status(404).send(e)
  }
})
hotelRouter.get('/hotels',async (req,res)=>{
  try{
    const nameOfHotel = querystring.parse(req.url);
    if(nameOfHotel.name===undefined){
      const findAllHotel = await Hotel.find({});
      res.status(200).send(findAllHotel);
    }
    else{
      const findAHotel=await Hotel.findOne({name:nameOfHotel.name})
      res.status(200).send(findAHotel)
    }
  }catch(e){
    res.status(404).send(e)
  }
})
hotelRouter.get('/hotel',auth,(req,res)=>{
  res.send(req.hotel)
})

//Categories
hotelRouter.post('/category',auth,async(req,res)=>{
  const categories = new foodCategory({
    ...req.body,
    owner: req.hotel._id
  });
  res.cookie('category_id',categories._id)
  try{
    const saving=await categories.save()
    res.status(200).send(saving)
  }catch(e){
    res.status(404).send(e)
  }
})
hotelRouter.get('/category',auth,async(req,res)=>{
  try{
    const category=await foodCategory.find({owner:req.hotel._id})
    res.status(200).send(category)
  }catch(e){
    res.status(404).send(e)
  }
})

//foods details

hotelRouter.post('/food',auth,async(req,res)=>{
  const food=new foods({
    ...req.body,
    owner:req.hotel._id
  });
  //console.log(req.cookies["category_id"]);
  const category = await foodCategory.findById(req.cookies["category_id"]);
  category.foods.push(food._id)
  food.categories.push(req.cookies["category_id"]);
  try{
    const saving=await food.save()
    const savingCategory=await category.save()
    res.status(200).send({saving,savingCategory})
  }catch(e){
    res.status(404).send(e)
  }
})
hotelRouter.get('/food/:id',async(req,res)=>{
  const _id=req.params.id;
  try{
    const food=await foods.findById(_id)
    res.status(200).send(food)
  }catch(e){
    res.status(404).send(e)
  }
})


module.exports = {
  hotelRouter,
};
