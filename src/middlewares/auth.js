const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";

  if (!isAuthenticated) {
    res.status(401).send("Not Authorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";

  if (!isAuthenticated) {
    res.status(401).send("Not Authorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
