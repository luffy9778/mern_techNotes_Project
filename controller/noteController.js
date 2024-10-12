const User=require("../models/User")
const Note=require("../models/Note")
const asyncHandler=require("express-async-handler")


 const getAllNotes=asyncHandler(async(req,res)=>{
    const note=await Note.find().lean()
    if(!note.length){
        return  res.status(400).json({message:"No notes found"})
    }
    const notesWithUser = await Promise.all(note.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))
    res.json(notesWithUser)
 })


 const createNewNote=asyncHandler(async(req,res)=>{
    const{user,title,text}=req.body
    if(!user||!title||!text){
        return  res.status(400).json({message:"all fields are required"})
    }
    const duplicate=await Note.findOne({title}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Note already exists"})
    }
    const note=await Note.create({user,title,text})
    if(note){
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
 })


 const updateNote=asyncHandler(async(req,res)=>{
    const{id,user,title,text,completed}=req.body
    if(!id||!user||!title||!text|| typeof completed!=="boolean"){
        return  res.status(400).json({message:"all fields are required"})
    }
    const note=await Note.findById(id).exec()
    if(!note){
        return res.status(404).json({ message: 'Note not found' })
    }
    const duplicate=await  Note.findOne({title}).lean().exec()
    if(duplicate && duplicate._id.toString()!==id.toString()){
        return res.status(409).json({message:"Note name already exists"})
    }
    note.user=user
    note.text=text
    note.title=title
    note.completed=completed
    const updatedNote=await note.save()
    res.json(`'${updatedNote.title}' updated`)
 })


 const deleteNote=asyncHandler(async(req,res)=>{
    const{id}=req.body
    if(!id){
        return  res.status(400).json({message:"id is required"})
    }
    const note=await Note.findById(id).exec()
    if(!note){
        return res.status(400).json({ message: 'Note not found' })
    }
    const result=await note.deleteOne()
    const reply = `Note '${note.title}' with ID ${note._id} deleted`
    res.json(reply)
 })

 
 module.exports={
    getAllNotes,updateNote,createNewNote,deleteNote
 }