const { Router } = require("express");

const router = Router();

const {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout_get,
} = require("../models/auth");

// Signup
router.get("/signup", signup_get);

router.post("/signup", signup_post);

// Login
router.get("/login", login_get);

router.post("/login", login_post);

// Logout
router.get("/logout", logout_get);

module.exports = router;
