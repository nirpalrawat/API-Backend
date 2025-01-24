const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// cloudinary setup
cloudinary.config({
  cloud_name: "diezdjotw",
  api_key: "241161176572584",
  api_secret: "1lablZJiel1I80vG8BR5dvNmLCE",
});

class FrontController {
  // insert student
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

      const isEmail = await UserModel.findOne({ email });
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
      const data = await UserModel.create({
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
  static Login = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatched = await bcrypt.compare(password, user.password);
        // console.log(isMatched)
        if (isMatched) {
          const token = jwt.sign({ ID: user._id }, "gdaugdasg@1213");
          // console.log(token)
          res.status(200).cookie("token", token).json({
            success: true,
            user,
            token,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Email or password is not valid.",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "You are not a registered user.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static getalluser = async (req, res) => {
    try {
      const user = await UserModel.find();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static getsingleuser = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static updateuser = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      return res.status(201).json({
        success: true,
        message: "Update Profile successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static deleteuser = async (req, res) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: "delete successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      return res.status(200).json({
        success: true,
        message: "Logout Successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      //   console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          // req.flash("error", "Current password is incorrect ");
          // res.redirect("/profile");
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect.",
          });
        } else {
          if (np != cp) {
            // req.flash("error", "Password does not match");
            // res.redirect("/profile");
            return res.status(400).json({
              success: false,
              message: "Password does not match.",
            });
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });

            return res.status(400).json({
              success: false,
              message: "Password Updated successfully.",
            });
          }
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "ALL fields are required.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        console.log(user);
        const imageID = user.image.public_id;
        console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        console.log(imageupload);
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);

      return res.status(400).json({
        success: false,
        message: "Update Profile successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
