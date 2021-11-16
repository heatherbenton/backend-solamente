const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

const verifyUser = (req, res, next) => {
	const token = req.headers.jwt;
	if (!token) {
		req.isAuth = false;
		res.send('Missng token in headers');
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
