var socket = io();
import axios from "axios";
import Noty from "noty";
const addToCart = document.querySelectorAll(".btn5");
const bookMarkHotel = document.getElementById("bookMarkbtn1");
// const bookMarkDelete = document.getElementById("bookMarkbtn2");
const likedFood = document.querySelectorAll(".btn4");
const fullProfileNavigator = document.querySelector(".fullProfileNavigator");
const profileClick = document.getElementById("userProfile");
const reviewsCompartment = document.getElementById("reviewsCompartment");
const orderOnline = document.getElementById("orderOnline");
const fullOnlineOrder = document.querySelector(".fullOnlineOrder");
const reviews = document.querySelector(".reviews");

function updateCart(food) {
  axios
    .post("/updateCart", food)
    .then((res) => {
      console.log(res);
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Successfully ordered",
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
      }).show();
    });
}
addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const food = JSON.parse(btn.dataset.food);
    console.log(food);
    updateCart(food);
    e.preventDefault();
  });
});

function updateBookMark(hotel) {
  axios.post("/updateBookmark", hotel).then((res) => {
    if (err) {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Please Login",
      }).show();
    } else {
      console.log("kenil");
    }
  });
}

let hiddenInput = document.querySelector("#hiddenInput");
let user = hiddenInput ? hiddenInput.value : null;
user = JSON.parse(user);
if (user) {
  socket.emit("join", user._id.toString());
}

bookMarkHotel.addEventListener("click", async function (e) {
  const hotel = JSON.parse(bookMarkHotel.dataset.hotel);
  const user = JSON.parse(bookMarkHotel.dataset.user);
  //await updateBookMark(hotel);
  //window.location.reload();
  e.preventDefault();
});
function myFunction() {
  socket.on("userId", () => {
    console.log("kenil");
  });
}
myFunction();
// function removeBookmark(bookMarkedHotel) {
//   axios.post("/deleteBookmark", bookMarkedHotel).then((res) => {
//     window.location.reload();
//   });
// }

// bookMarkDelete.addEventListener("click",async function (e) {
//   const bookMarkedHotel = JSON.parse(bookMarkDelete.dataset.hotel);
//   await removeBookmark(bookMarkedHotel);
//   window.location.reload();
// });

function likeByUser(food) {
  axios.post("/likedFood", food).then((res) => {
    if (res) {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Please Login",
      }).show();
    } else {
      console.log("kenil");
    }
  });
}
likedFood.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const food = JSON.parse(btn.dataset.food);
    console.log(food);
    likeByUser(food);
    e.preventDefault();
  });
});

profileClick.addEventListener("click", () => {
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});

orderOnline.addEventListener("click", (e) => {
  reviews.classList.remove("movingFullReviews");
  fullOnlineOrder.classList.remove("movingFullOnlineOrder");
  reviewsCompartment.classList.remove("isActive");
  orderOnline.classList.add("isActive");
  e.preventDefault();
});

reviewsCompartment.addEventListener("click", (e) => {
  reviews.classList.add("movingFullReviews");
  fullOnlineOrder.classList.add("movingFullOnlineOrder");
  orderOnline.classList.remove("isActive");
  reviewsCompartment.classList.add("isActive");
  e.preventDefault();
});
