//const { default: axios } = require("axios");
import axios from "axios";

const profileClick = document.getElementById("userProfile");
const fullProfileNavigator = document.querySelector(".fullProfileNavigator");

profileClick.addEventListener("click", () => {
  console.log("kenil");
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});
const deleteBookmark = document.querySelectorAll(".deleteBookmark");

function removeBookmark(bookMarkedHotel) {
  axios.post("/deleteBookmark", bookMarkedHotel).then((res) => {
    window.location.reload();
  });
}

deleteBookmark.forEach((btn) => {
  btn.addEventListener("click", async function () {
    const bookMarkedHotel = JSON.parse(btn.dataset.hotel);
    console.log(bookMarkedHotel);
    await removeBookmark(bookMarkedHotel);
    window.location.reload();
  });
});
