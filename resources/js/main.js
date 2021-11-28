// import { Hotel } from '';
// import 'mongoose';
const foodButton = document.querySelector(".secondbtn");
const hotelButton = document.querySelector(".firstbtn");
const popularFoodCompartment = document.querySelector(".secondfullContainer");
const popularHotelCompartment = document.querySelector(".firstfullContainer");
const fullContainer = document.querySelector(".fullContainerEffect");
const profileClick = document.getElementById("userProfile");
const fullProfileNavigator = document.querySelector(".fullProfileNavigator");

hotelButton.addEventListener("click", () => {
  popularFoodCompartment.classList.remove("popularFoodEffect");
  popularHotelCompartment.classList.remove("popularHotelEffect");
  foodButton.classList.remove("buttonEffectOne");
  hotelButton.classList.remove("buttonEffectTwo");
  foodButton.classList.add("buttonEffectTwo");
  hotelButton.classList.add("buttonEffectOne");
  popularFoodCompartment.classList.add("popularFoodEffect2");
  popularHotelCompartment.classList.add("popularHotelEffect2");
});

foodButton.addEventListener("click", () => {
  popularFoodCompartment.classList.remove("popularFoodEffect2");
  popularHotelCompartment.classList.remove("popularHotelEffect2");
  foodButton.classList.remove("buttonEffectTwo");
  hotelButton.classList.remove("buttonEffectOne");
  foodButton.classList.add("buttonEffectOne");
  hotelButton.classList.add("buttonEffectTwo");
  popularFoodCompartment.classList.add("popularFoodEffect");
  popularHotelCompartment.classList.add("popularHotelEffect");
});

profileClick.addEventListener("click", () => {
  console.log("kenil");
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});

// var start = 1;
// function set_time() {
//   setInterval(imageShow(), 2000);
// }
// function imageShow() {
//   var imgData;
//   if (start == 1) {
//     imgData = "/img/hero-pizza.png";
//   } else if (start == 2) {
//     imgData = "/img/dosa.png";
//   } else if (start == 3) {
//     imgData = "/img/burger.png";
//   } else {
//     imgData = "/img/hero-pizza.png";
//     start = 1;
//   }
//   document.getElementById("data").src = "" + imgData;
//   start++;
// }
// set_time();
