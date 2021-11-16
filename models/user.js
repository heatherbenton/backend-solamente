// import bcrypt
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const accountSchema = require("../models/account");

const emailReq = {
	type: String,
	required: [true, "enter a valid email"],
	unique: true,
	validate: [isEmail, "enter a valid email"],
};

const passwordReq = {
	type: String,
	required: [true, "enter a fresh password"],
	minlength: [8, "Please enter at least 8 characters."],
};

const userSchema = new Schema(
	{
		email: emailReq,
		password: passwordReq,
		// accounts: [accountSchema],
		name: {
			type: String,
			required: true,
		},
		totalBalance: {
			type: Number,
			required: true,
			default: 0
		},
	},
	{ timestamps: true }
);

// Pre method - hash password
userSchema.pre("save", async function (next) {
	let user = this;

	if (!user.isModified("password")) {
		return next();
	} else {
		const salt = await bcrypt.genSalt();

		this.password = await bcrypt.hash(this.password, salt);

		return next();
	}
});

// Custom static method on user model for login
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const auth = await bcrypt.compare(password, user.password);

		if (auth) {
			return user;
		}

		return { message: "Incorrect email/password" };
	}

	return { message: "Incorrect email/password" };
};

const User = model("user", userSchema);

module.exports = User;
