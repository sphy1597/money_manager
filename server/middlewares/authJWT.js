const { request } = require("express");
const { verify } = require("../utils/jwt_utils");

const authJWT = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const result = verify(token);
    if (result.ok) {
      req.id = result.id;
      req.role = request.role;
      next();
    } else {
      // 검증실패 or 로그인 만료
      res.Status(401).send({
        ok: false,
        message: result.message,
      });
    }
  }
};

module.exports = authJWT;
