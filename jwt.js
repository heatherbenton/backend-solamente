const jwt = require("jsonwebtoken");
const path = require("path");
const rootDir = require("./path");
const User = require("../models/user");
require("dotenv").config({ path: path.join(rootDir, "secure", ".env") });

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

const verifyUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		req.isAuth = false;
		next();
	} else {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				req.isAuth = false;
				next();
			} else {
				let user = await User.findById(decodedToken.id);

				req.userInfo = user;
				req.isAuth = true;
				next();
			}
		});
	}
};

module.exports = {
	createToken,
	verifyUser,
};
