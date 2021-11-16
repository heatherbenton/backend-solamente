// Import the User model
const User = require("../models/user");
//const handleErrors = require("../to-be-deleted");
const { createToken } = require("../middlewares/jwt");

const signup_post = async (req, res) => {
	const { email, password, name } = req.body;
	const totalBalance = 0;

	try {
		// create new user account
		const user = await User.create({ email, password, name, totalBalance });

		// new user secret token
		const token = await createToken(user._id);

		// final response to front end
		res.status(201).json(token);
	} catch (err) {
		console.log("backend", err);
		res.status(500).send(err);
	}
};

const login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		// uses the static function login() to locate user in database and return it
		const user = await User.login(email, password);

		if (user.message === "invalid credentials") {
			res.status(400).json(user);
		}

		// create a token with jwt
		const token = await createToken(user["_id"]);

		// final response to front end
		res.status(200).json(token);
	} catch (err) {
		// const errors = handleErrors(err);
		res.status(400).json({ errors: err });
	}
};

// logout
const logout_get = (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.status(200).json({ message: "you are now logged out" });
};

module.exports = {
	signup_post,
	login_post,
	logout_get,
};
