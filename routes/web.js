const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();

route.post("/insertStudent", FrontController.studentInsert);
route.post("/login", FrontController.Login);
route.get("/getalluser", FrontController.getalluser);
route.get("/getsingleuser/:id", FrontController.getsingleuser);
route.post("/updateuser/:id", FrontController.updateuser);
route.get("/deleteuser/:id", FrontController.deleteuser);

module.exports = route;
