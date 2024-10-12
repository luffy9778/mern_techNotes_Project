const {loggEvents}=require("./logger")

const errorHandler=(err,req,res,next)=>{
    loggEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.message)
    const staus=res.statusCode?res.statusCode:500 //server error
    res.statusCode(staus)
    res.json({message:err.message})
}
module.exports=errorHandler