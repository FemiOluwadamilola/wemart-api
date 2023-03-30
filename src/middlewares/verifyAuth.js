const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const AuthHeader = req.headers.authorization;
  if (AuthHeader) {
    const token = AuthHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          response: {
            message: "token key not valid",
          },
        });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      response: {
        message: "Unauthorized: please signin to continue!",
      },
    });
  }
};

module.exports = verifyToken;
