const jwt = require("../utils/jwt_utils");

const authJWT = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    const verifiedToken = await jwt.verify(token);
    console.log(verifiedToken.result);
    if (verifiedToken.result) {
      req.user_id = verifiedToken.user_id;
      next();
    } else {
      res.status(401).send({
        result: false,
        message: "Access fail...",
      });
    }
  }
};

module.exports = authJWT;
