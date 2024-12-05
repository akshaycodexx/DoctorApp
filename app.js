const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");
const BookAppointment = require("./models/booking.js");
const addDoctor=require("./models/add-doctors.js")
const multer = require('multer');
const review= require("./models/reviews.js")
require("dotenv").config();
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
const userRoute=require("./routes/user.js")

// const upload = multer({ dest: 'uploads/' }); // Upload folder for images

// express session
const sessionOptions = {
    secret: "yourSecretKey", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  };

  //session middleware (needed by connect-flash)
  app.use(session({
    secret:"yourSecretKey",
    resave:false,
    saveUninitialized:true
  }));

  //initialze flash
  app.use(flash())

  //middleware for flash message
  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    next()
  })
  
  //inisilze session before passport
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use("/", userRoute);












const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads')); // Specify the uploads folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get file extension
        const uniqueName = `${Date.now()}${ext}`; // Create a unique filename
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            cb(null, true); // Accept valid image files
        } else {
            cb(new Error('Only .jpg, .jpeg, or .png files are supported'), false); // Reject invalid files
        }
    },
});





app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride(`_method`));
app.engine('ejs',ejsmate);
app.set("views",path.join(__dirname,"views"))
app.set("view engine",'ejs');

async function main(){
    // await mongoose.connect(process.env.MONGO_URL)
    await mongoose.connect(`mongodb://127.0.0.1:27017/Appointment`)
}
main().then(()=>{
    console.log("Connected TO Database");
}).catch(()=>{
    console.log("Connection to Database Faild")
})


app.get("/",(req,res)=>{
  res.render("listings/index.ejs",{msg:req.flash("msg")})
})

app.get("/bookappointment",(req,res)=>{
    res.render("listings/appoinment.ejs")
})



app.post("/book", async(req,res)=>{
    const {name,email,department,time}=req.body;
    console.log(req.body); 
    try{
        const newAppointment= new BookAppointment({
            name,
            email,
            department,
            time,
        });
        await newAppointment.save();
        // res.status(200).send("Appointment booked successfully!"); 
        res.redirect("/")
    }catch(err){
        console.error("Error saving appointment:",err)
        res.status(500).send("Failed to book appointment.");
    }
});
// listing all doctors
app.get("/doctor",async(req,res)=>{
    try{
    const doctors=await addDoctor.find({});
    res.render("listings/doctor.ejs",{doctors})
    }catch(error){
        console.error("Error fetching doctors: ",{error})
        res.status(500).send("field to load doctors.")
    }

})

// add doctor
app.post('/addDoctor', upload.single('img'),async (req, res) => {
    try {
        const { name, specialization, phone, email, description } = req.body;
        const imgPath = req.file ? `/uploads/${req.file.filename}` : 'https://clipground.com/images/the-doctor-is-in-clipart-6.png'; //path to upload the images
        // Create and save doctor
        const newDoctor = new addDoctor({
            name,
            specialization,
            phone,
            email,
            img: imgPath , // Use uploaded image or default
            description,
        });

        await newDoctor.save();
        res.redirect("/doctor")
        console.log("Successfuly added a new doctors");
    } catch (error) {
        console.error("Error saving doctor:", error);
        res.status(500).json({ error: "Failed to add doctor." });
    }
});






app.get("/docprofile",(req,res)=>{
    res.render("listings/doctorprofile.ejs")
})

// service page
app.get("/services",(req,res)=>{
    res.render("listings/service.ejs")
})
// doctorcard
app.get("/doctorcard",(req,res)=>{
    res.render("listings/doctorcard.ejs")
})
// card using id 
app.get("/doctor/:id",async(req,res)=>{
    const {id}=req.params;
    const doctors=await addDoctor.findById(id).populate("reviews");
    res.render("listings/doctorcard.ejs",{docinfo:doctors})
})
app.get("/specficbook",(req,res)=>{
    res.render("listings/specfic_Doc_book.ejs")
})

// Review Route
app.post("/doctor/:id/reviews",async(req,res)=>{
    const doctor=await addDoctor.findById(req.params.id);
    const newReview= new review(req.body.review);
    doctor.reviews.push(newReview);
    await newReview.save();
    await doctor.save();
    console.log("New Review Added!");
    res.redirect(`/doctor/${doctor._id}`);

})
// delete review route
app.delete("/doctor/:id/reviews/:reviewId",async(req,res)=>{
    const{id,reviewId}=req.params;
    await addDoctor.findByIdAndUpdate(id,{ $pull: {reviews:reviewId} });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/doctor/${id}`);


})

// admin
app.use("/admin",(req,res)=>{
    res.render("listings/admin-adddoctor.ejs");

})

<<<<<<< HEAD
// const PORT=8050;

app.listen(8085,()=>{
    console.log("Server Started",8085)
=======
// const PORT=process.env.PORT || 8050;

app.listen(8050,()=>{
    console.log("Server Started at port : ",8050);
>>>>>>> 65b1f18ed08f9e5cdea3ee2cd6c409a171f3bbd8
})





