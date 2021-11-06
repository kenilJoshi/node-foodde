const profileClick = document.getElementById("userProfile");
const fullProfileNavigator = document.querySelector(".fullProfileNavigator");
console.log("kenil joshi");
profileClick.addEventListener("click", () => {
  console.log("kenil");
  fullProfileNavigator.classList.toggle("profileNavigatorAnimator");
});
