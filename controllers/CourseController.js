// const { model } = require("mongoose");
const TeacherModel = require("../models/teacher");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// cloudinary setup
cloudinary.config({
  cloud_name: "diezdjotw",
  api_key: "241161176572584",
  api_secret: "1lablZJiel1I80vG8BR5dvNmLCE",
});

class CourseController {
  static studentInsert = async (req, res) => {
    try {
      //console.log(req.body)
      //console.log(req.files)
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const isEmail = await TeacherModel.findOne({ email });
      console.log(isEmail);
      if (isEmail) {
        return res.status(400).json({
          success: false,
          message: "Email Already Exists",
        });
      }

      if (password != confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "Password does not match",
        });
      }

      //console.log(req.files);
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload);

      const hasspassword = await bcrypt.hash(password, 10);
      const data = await TeacherModel.create({
        name,
        email,
        password: hasspassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to register",
      });
    }
  };

  static courseView = async (req, res) => {
    try {
      const { id } = req.params;
      const singleCourse = await TeacherModel.findById(id);

      if (!singleCourse) {
        res
          .status(404)
          .json({ status: "failed", message: "Course Not Found!" });
      }

      res.status(200).json({ status: "success", singleCourse });
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = CourseController;
