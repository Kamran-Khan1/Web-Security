import jwt from "jsonwebtoken";
import db from "../db/db.js";
import { jwtSecret } from "../index.js";

export const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        // console.log(decoded);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

export const validation = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.locals.username = null;
        next();
      } else {
        // console.log(decoded.id);
        const User = await db.query("SELECT * FROM users WHERE id=$1", [
          decoded.id,
        ]);
        res.locals.username = User.rows[0].email;
        next();
      }
    });
  } else {
    res.locals.username = null;
    next();
  }
};
