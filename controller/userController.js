const User=require("../models/User")
const Note=require("../models/Note")
const asyncHandler=require("express-async-handler")
const bcrypt=require("bcrypt")

 const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find().select("-password").lean()
    if(!users.length){
      return res.status(400).json({message:"no user found"})
    }
    res.json(users)
 })

 const createNewUser=asyncHandler(async(req,res)=>{
   const {username,password,roles}=req.body
   if(!username||!password||!roles.length||!Array.isArray(roles)){
      return  res.status(400).json({message:"all fields are required"})
   }
   const duplicate=await User.findOne({username}).lean().exec()
   if(duplicate){
      return  res.status(409).json({message:"username already exists"})
   }
   const hashedPwd=await bcrypt.hash(password,10)
   const newUser={username,"password":hashedPwd,roles}
   const user=await User.create(newUser)
   if(user){
      res.status(201).json({message:`new user ${username} has created`})
   }else{
      res.status(400).json({message:"invalid user data received"})
   }
 })

 const updateUser=asyncHandler(async(req,res)=>{
   const{id,username,password,roles,active}=req.body
   if(!id||!username||!roles.length||!Array.isArray(roles)|| typeof active!=="boolean"){
      return   res.status(400).json({message:"all fields are required"})
   }
   const user=await User.findById(id).exec()
   if(!user){
      return res.status(400).json({message:"user not found"})
   }
   const duplicate=await User.findOne({username}).lean().exec()
   if(duplicate&&duplicate?._id.toString()!==id){
      return  res.status(409).json({message:"username already exists"})
   }
   user.username=username
   user.roles=roles
   user.active=active
   if(password){
      user.password=await bcrypt.hash(password,10)
   }
   const newUser=await user.save()
   res.json({message:`${username} has updated`})
 })

 const deleteUser=asyncHandler(async(req,res)=>{
   const{id}=req.body
   if(!id){
      return res.status(400).json({message:"user Id is required"})
   }
   const note=await Note.findOne({user:id}).lean().exec()
   if(note){
      return  res.status(400).json({message:"user has notes, cannot delete"})
   }
   const user=await User.findById(id).exec()
   if(!user){
      return res.status(400).json({message:"user not found"})
   }
   const result=await user.deleteOne()
   const reply=`username ${user.username} with ID ${user._id} deleted`
   res.json(reply)
 })
 
 module.exports={
   getAllUsers,createNewUser,updateUser,deleteUser
 }