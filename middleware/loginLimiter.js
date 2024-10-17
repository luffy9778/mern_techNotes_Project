const rateLimit=require("express-rate-limit")
const { options } = require("../routes/authRoutes")
const{logEvenets}=require("./logger")

const loginLimiter=rateLimit({
    windowMs:60*1000,
    max:5,
    message:{ message: 'Too many login attempts from this IP, please try again after a 60 second pause'},
    handler:(req,res,next,options)=>{
        logEvenets(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statuscode).send(options.message)
    },
    standardHeaders:true,
    legacyHeaders: false,
})
module.exports=loginLimiter