import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret, saltRoundes } from "../index.js";
export const getUserLogin = (req, res) => {
  res.render("login.ejs");
};

export const getUserRegister = (req, res) => {
  res.render("register.ejs");
};

//viewing the secrets page
export const getSecrets = (req, res) => {
  res.render("secrets.ejs");
};
//JWT configeration

const maxAge = 60 * 60 * 24 * 3;

const jwtUser = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: maxAge,
  });
};

//This is a async handler for registerign users
export const postUserRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const oldUser = await db.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (oldUser.rows.length > 0) {
      const message = `User Already Exists`;
      res.render("register.ejs", { message: message });
    } else {
      bcrypt.hash(password, saltRoundes, async (err, hash) => {
        if (err) {
          console.log(`Error`, err);
        } else {
          const User = await db.query(
            `INSERT INTO users(email, password) VALUES($1, $2) RETURNING *`,
            [email, hash]
          );
          const token = jwtUser(User.rows[0].id);
          res.cookie("jwt", token, { maxAge: maxAge * 100, httpOnly: true });
          res.redirect("/secrets");
        }
      });
    }
  } catch (err) {
    console.log(`Error`, err);
  }
};
//This is a async handler for logging in users
export const postUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);

    if (User.rows.length > 0) {
      bcrypt.compare(password, User.rows[0].password, (err, same) => {
        if (same) {
          const token = jwtUser(User.rows[0].id);
          res.cookie("jwt", token, { maxAge: maxAge * 100, httpOnly: true });
          res.redirect("/secrets");
        } else {
          res.render("login.ejs", { incorrectPass: "Password is incorrect" });
        }
      });
    } else {
      res.render("login.ejs", { invalidEmali: "Please Register First" });
    }
  } catch (error) {
    console.log(`ERROR`, error);
  }
};

export const getLogOut = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
