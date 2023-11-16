const jwt = require("../utils/jwt_utils");

const authJWT = async (req, res, next) => {
  const { user_id } = req.body;
  const headertoken = req.headers.authorization;

  if (!headertoken) {
    return res.status(401).json({ message: "No token provided " });
  }

  try {
    const decodedToken = await jwt.verify(headertoken);
    console.log("decoded user_id : ", decodedToken.user_id);
    if (user_id !== decodedToken.user_id) {
      return res.status(403).json({ message: "권한이 없습니다. " });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authJWT;
