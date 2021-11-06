const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/food-delivery-api',{
    useNewUrlParser:true,
})
//const connection=mongoose.Connection
// connection.once('open',()=>{
//     console.log('database connected...');
// }).catch((e)=>{
//     console.log(e);
// })