const express=require("express")
const router=express.Router()
const noteController=require("../controller/noteController")
const verifyJwt = require("../middleware/verifyJwt")

router.use(verifyJwt)
router.route("/")
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote)
module.exports=router