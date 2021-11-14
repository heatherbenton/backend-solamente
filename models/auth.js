// Import the User model
const User = require("./user");
const handleErrors = require("./error");
const { createToken } = require("./jwt");

// we've got a fresh new account signup!
const signup_get = (req, res) => {
	res.status(200).json({ message: "Sign up!" });
};

const signup_post = async (req, res) => {
	const { email, password, username } = req.body;
	const totalBalance = 0;

	try {
		// create new user account
		const user = await User.create({ email, password, username, totalBalance });
		console.log("...", user);

		// new user secret token
		const token = await createToken(user._id);

		// Save the token to the cookies
		res.cookie("jwt", token, {
			httpOnly: true,
		});

		// final response to front end
		res.status(200).json(user);
	} catch (err) {
		const errors = handleErrors(err);
		console.log("backend", errors);
		res
			.status(400)
			.json({ message: "You may have already signed up with us!" });
	}
};

// user login
const login_get = (req, res) => {
	res.status(200).json({ messaage: "login here" });
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

		// save  JWT as cookie
		res.cookie("jwt", token, {
			httpOnly: true,
		});

		// final response to front end
		res.status(200).json(user);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

// logout
const logout_get = (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.status(200).json({ message: "you are now logged out" });
};

module.exports = {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout_get,
};
