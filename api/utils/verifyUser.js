import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import { secret } from "../app.js";

export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(
    token,
    process.env.NODE_ENV == "production"
      ? secret?.JWT_SECRET
      : process.env.JWT_SECRET,
    (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized"));
      }
      req.user = user;
      next();
    }
  );
};
