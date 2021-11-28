let mix = require("laravel-mix");

mix.js(
  ["resources/js/about.js", "resources/js/main.js", "resources/js/profile.js"],
  "public/js/app.js"
);
mix.css("resources/css/style.css", "public/css/app.css");
mix.css("resources/css/adminStyle.css", "public/css/app.css");
// mix.js("resources/js/cart.js", "public/js/app.js");
// mix.js("resources/js/main.js", "public/js/app.js");
// mix.js("resources/js/profile.js", "public/js/app.js");
mix.js("resources/js/script1.js", "public/js/main.js");
