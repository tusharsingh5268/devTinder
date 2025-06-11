const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User response done");
});

app.get("/admin/getData", (req, res) => {
  try {
    console.log("get All the route Handler");
    throw Error("sdfsfsd");
    res.send("Response for get all data");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/admin/deleteData", (req, res) => {
  console.log("Delete Data route Handler");
  res.send("Delete Data");
});
// we can also use Middleware for error handling and always write it at last
app.use("/", (err, req, res, next) => {
  console.log("err", err);
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
