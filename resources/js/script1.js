var socket = io();
import axios from "axios";
import Noty from "noty";
const addToCart = document.querySelectorAll(".btn5");
const bookMarkHotel = document.getElementById("bookMarkbtn1");
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

function updateBookMark(hotel, user, bookMarkHotel) {
  const data = {
    hotelId: hotel._id,
    userId: user._id,
    hotelName: hotel.name,
  };
  let status = {};
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/updateBookmark", {
    method: "Post",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      status = {
        ...data,
      };
      if (status.status === "deleted") {
        bookMarkHotel.classList.replace("bookMark2", "bookMark1");
        new Noty({
          type: "success",
          timeout: 1000,
          text: `${hotel.name} BookMark is removed`,
        }).show();
      } else {
        bookMarkHotel.classList.replace("bookMark1", "bookMark2");
        new Noty({
          type: "success",
          timeout: 1000,
          text: `${hotel.name} is BookMarked`,
        }).show();
      }
    });
}

bookMarkHotel.addEventListener("click", () => {
  const hotel = JSON.parse(bookMarkHotel.dataset.hotel);
  console.log(bookMarkHotel.className);
  let user = bookMarkHotel.dataset.user;
  if (user === "Please Login") {
    new Noty({
      type: "error",
      timeout: 1000,
      text: "Please Login",
    }).show();
  } else {
    const fullUser = JSON.parse(user);
    updateBookMark(hotel, fullUser, bookMarkHotel);
  }
});

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

orderOnline.addEventListener("click", (e) => {
  reviews.classList.remove("displayReviews");
  fullOnlineOrder.classList.remove("displayFullOnlineOrder");
  reviewsCompartment.classList.remove("isActive");
  orderOnline.classList.add("isActive");
  e.preventDefault();
});

reviewsCompartment.addEventListener("click", (e) => {
  reviews.classList.add("displayReviews");
  fullOnlineOrder.classList.add("displayFullOnlineOrder");
  orderOnline.classList.remove("isActive");
  reviewsCompartment.classList.add("isActive");
  e.preventDefault();
});

profileClick.addEventListener("click", () => {
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});
