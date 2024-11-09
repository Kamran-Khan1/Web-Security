import { Router } from "express";
import {
  getUserLogin,
  getUserRegister,
  getSecrets,
  postUserRegister,
  postUserLogin,
  getLogOut,
} from "../controllers/user.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/login", getUserLogin);
router.post("/login", postUserLogin);
router.get("/register", getUserRegister);
router.post("/register", postUserRegister);
router.get("/secrets", userAuth, getSecrets);
router.get("/logout", getLogOut);
export default router;
