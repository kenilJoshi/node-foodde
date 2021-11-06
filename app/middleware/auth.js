const jwt=require('jsonwebtoken')
const {Hotel}=require('../models/Hotel/hotelModel')

const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, "euncnchchsakahs");
        const hotel= await Hotel.findOne({_id:decoded._id,'tokens.token':token})
        if(!hotel){
            throw new Error('error')
        }
        req.hotel=hotel
        next()
    }catch(e){
        res.status(404).send('Please Authenticate',e)
    }
}

module.exports={
    auth
}