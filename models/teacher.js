const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
        type: String,
        require: true,
      },
      dob: {
        type: Date,
        require: true,
      },
    role: {
      type: String,
      default: "student",
    },

    token: {
      type: String,
    },
    is_verified: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const TeacherModel = mongoose.model("teacher", TeacherSchema);
module.exports = TeacherModel;
