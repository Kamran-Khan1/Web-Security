import express from "express";
import db from "./db/db.js";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { validation } from "./middleware/auth.middleware.js";
import env from "dotenv";
const app = express();
const PORT = 4000;

//env connection
env.config({
  path: ".env",
});

export const jwtSecret = process.env.JWT_SECRET;
export const saltRoundes = process.env.SALT_ROUNDES;
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(router);
//db config

db.connect()
  .then(() => {
    console.log(`Database Connected Successfully`);
  })
  .catch((err) => {
    console.log(`Database Error:`, err);
  });

app.get("*", validation);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

/*
Basic cookie setting
app.get("/set-cookies", (req, res) => {
  res.cookie("name", "Sabbir", {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  }); // It will last for 1 day
  res.cookie("newUser", "Jaber");
  res.send("cookie is created");
});

app.get("/read-cookies", (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  res.json(cookie);
});
*/
app.listen(PORT, () => {
  console.log(`App is running at PORT: ${PORT}`);
});
