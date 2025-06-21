const validator = require("validator");
const validation = (req) => {
  const { firstName, lastName, email } = req.body;
  console.log("firstName", firstName);
  if (!firstName || !lastName) {
    throw new Error("Please give full name!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not correct!");
  }
};

module.exports = { validation };
