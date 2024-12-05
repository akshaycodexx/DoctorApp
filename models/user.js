const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose") //it is helps to vlaidate the user
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

})
//add passport-local-mongoose plugin to UserSchmea
UserSchema.plugin(passportLocalMongoose); // this is automacally add usename and hash and salting on the user schema

module.exports=mongoose.model("user",UserSchema);
