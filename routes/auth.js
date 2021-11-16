const { Router } = require("express");
const { verifyUser } = require("../middlewares/jwt");

const router = Router();

const {
	signup_post,
	login_post,
	logout_get,
} = require("../controllers/auth");

router.post("/signup", signup_post);

router.post("/login", login_post);

router.get("/logout", verifyUser, logout_get);

module.exports = router;
