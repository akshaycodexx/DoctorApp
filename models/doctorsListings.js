const mongoose=require("mongoose");
const Schema=mongoose.Schema;

async function main(){
    await mongoose.connect(`mongodb://127.0.0.1:27017/Appointment`)

}
main().then(()=>{
    console.log("Connected to Database");
}).catch(()=>{
    console.log("failed to connect DB")
});


const doctors =new Schema({
    name:{
        type:String,
        required:true,
        maxlength:30,

    },
    Specialist:{
        type:String,
        required:true,
    },
    img:{
        

    }

})