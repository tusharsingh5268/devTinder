const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:ibKe4TGK0R3NAf6i@namastenode.ocvqory.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
