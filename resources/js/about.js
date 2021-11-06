const profileClick = document.getElementById("userProfile");
const fullProfileNavigator = document.querySelector(".fullProfileNavigator");

profileClick.addEventListener("click", () => {
  console.log("kenil");
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});