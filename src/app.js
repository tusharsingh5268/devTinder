const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User response done");
});

app.get("/admin/getData", (req, res) => {
  console.log("get All the route Handler");
  res.send("Response for get all data");
});

app.get("/admin/deleteData", (req, res) => {
  console.log("Delete Data route Handler");
  res.send("Delete Data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
