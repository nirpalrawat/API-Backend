const express = require("express");
const FrontController = require("../controllers/FrontController");
const CourseController = require("../controllers/CourseController");
const route = express.Router();
const checkAuth = require("../middleware/auth");

route.post("/insertStudent", FrontController.studentInsert);
route.post("/login", FrontController.Login);
route.get("/getalluser", FrontController.getalluser);
route.get("/getsingleuser/:id", FrontController.getsingleuser);
route.post("/updateuser/:id", FrontController.updateuser);
route.get("/deleteuser/:id", FrontController.deleteuser);
route.get("/logout", FrontController.logout);
route.post("/changePassword", checkAuth, FrontController.changePassword);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);




route.post("/teacher/insertStudent", CourseController.studentInsert);
route.post("/teacher/courseView", CourseController.courseView);


module.exports = route;
