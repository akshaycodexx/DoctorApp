const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/Appointment`);
}

main()
  .then(() => {
    console.log("Connected TO Database");
  })
  .catch(() => {
    console.log("Connection to Database Failed");
  });

const bookappointmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// Export the model correctly
module.exports = mongoose.model("BookAppointment", bookappointmentSchema);
