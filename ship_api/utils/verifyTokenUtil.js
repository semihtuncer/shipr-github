const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACC_KEY, (err, user) => {
      if (err) return res.status(404).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(404).json("You are not authorized!");
  }
};
const verifyRegisteryToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_REG_KEY, (err, user) => {
      if (err) return res.status(404).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(404).json("You are not authorized!");
  }
};

const verifyAuthorizationAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized!");
    }
  });
};

const verifyAuthorizationUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json("You are not authorized!");
    }
  });
};
const verifyAuthorizationRegisteryUser = (req, res, next) => {
  verifyRegisteryToken(req, res, () => {
    if (req.user.phoneNum === req.body.phoneNum) {
      next();
    } else {
      res.status(403).json("You are not authorized!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyAuthorizationAdmin,
  verifyAuthorizationUser,
  verifyAuthorizationRegisteryUser,
};
