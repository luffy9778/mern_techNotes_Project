const allowedOrigins=require("./allowedOrgins")

const corsOption={
    origin:(origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!==-1||!origin){
            callback(null,true)
        }
        else{
            callback(new Error("not allowed by CORS"))
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}
module.exports=corsOption