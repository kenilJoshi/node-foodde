const mongoose = require("mongoose");

const DB_URL =
  "mongodb+srv://Bkj:Bkj%405454721@cluster0.k3tur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//const connection=mongoose.Connection
// connection.once('open',()=>{
//     console.log('database connected...');
// }).catch((e)=>{
//     console.log(e);
// })
