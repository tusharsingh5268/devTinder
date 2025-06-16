const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

//Middleware for coverting readable stream to Javascript object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Data Saved Successfully");
  } catch (err) {
    res.status(400).send("Failed to save data");
  }
});

connectDB()
  .then(() => {
    console.log("Connection Established successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Connection failed");
  });
