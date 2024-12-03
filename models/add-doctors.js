const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;

const addDoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30, // Correctly applies to strings
  },
  specialization: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // Changed to String to validate length
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10,12}$/.test(v); // Validates 10 to 12 digit phone numbers
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  img: {
    type: String,
    default: "https://th.bing.com/th/id/OIP.1a2ofVr-orNHCw-lCArGOgHaI1?rs=1&pid=ImgDetMain",
  },
  description: {
    type: String,
    required: true,
  },
  reviews:[
  {
    type:Schema.Types.ObjectId,
    ref:"review"

  }

  ]
});

module.exports = mongoose.model("addDoctor", addDoctorSchema);
