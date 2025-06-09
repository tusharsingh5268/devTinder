const express = require("express");

const app = express();
//From this route we are making GET API call
app.get("/user", (req, res) => {
  res.send({ firstName: "Tushar", lastName: "Singh" });
});

//From this route we are making POST API call
app.post("/user", (req, res) => {
  //code of saving data in database
  console.log("save Data to the Database");
  res.send("Data is successfully saved to the database");
});

//From this route we are making DELETE API call
app.delete("/user", (req, res) => {
  //code of deleting data from database
  res.send("Deleted Successfully");
});

//From this route we are making api call for every http method
app.use("/user", (req, res) => {
  res.send("Hello from the server...");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
