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
