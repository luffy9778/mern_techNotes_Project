require("dotenv").config()
const express=require("express")
const app= express()
const path=require("path")
const {logger, loggEvents}=require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors=require("cors")
const corsOption = require("./config/corsOption")
const mongoose=require("mongoose")
const connectDB=require("./config/dbConn")

const PORT=process.env.PORT||3500

connectDB()

app.use(logger)
app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())

app.use("/",express.static(path.join(__dirname,"public")))
app.use("/",require("./routes/root"))
app.use("/auth",require("./routes/authRoutes"))
app.use("/users",require("./routes/userRoutes"))
app.use("/notes",require("./routes/noteRoutes"))
app.use("*",(req,res)=>{
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }else if("json"){
        res.json({message:"404 Not Found"})
    }else{
        res.type('text').send("404 page not found")
    }
})
app.use(errorHandler)
mongoose.connection.once("open",()=>{
    console.log("connected to MongoDB")
    app.listen(PORT,()=>{ console.log(`server is running on port ${PORT}`)})
})
mongoose.connection.on("error",err=>{
    console.log(err)
    loggEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})