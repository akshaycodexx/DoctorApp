const express=require("express");
const flash=require("connect-flash");
const User=require("../models/user.js");
const WrapAsync=require("../utils/ExpressError.js");
const passport=require("passport");
const router=express.Router();


//signup page rote
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")

})

router.post("/signup", WrapAsync( async (req, res) => {
    try {
        console.log(req.body); // Debugging: See incoming form data
        const {username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("msg", "Registered Successfully!");
        res.redirect("/");
    } catch (e) {
        console.error("Error during registration: ", e.message);
        req.flash("msg", e.message);
        res.redirect("/signup");
    }
}));









module.exports=router;