const jwt=require("jsonwebtoken")

const verifyJwt=(req,res,next)=>{
    const authHeader=req.headers.authorization||req.headers.Authorization
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"Unatorized"})
    }
    const token=authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err)return res.status(403).json({message:"Forbiden"})
            req.user=decoded.UserInfo.username
            req.roles=decoded.UserInfo.roles
            next()
        }
    )
}
module.exports=verifyJwt