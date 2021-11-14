// Import Mongoose
const { Schema, model } = require("mongoose");

// use validator package
const { isEmail } = require("validator");

// use bcrypt
const bcrypt = require("bcrypt");

const emailReq = {
	type: String,
	required: [true, "enter your email"],
	unique: true,
	validate: [isEmail, "enter your email"],
};

const passwordReq = {
	type: String,
	required: [true, "enter a fresh password"],
	minlength: [6, "please enter at least 6 characters"],
};

const historySchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const accountSchema = new Schema(
	{
		acctName: {
			type: String,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
		},
		history: [historySchema],
	},
	{ timestamps: true }
);

const userSchema = new Schema(
	{
		email: emailReq,
		password: passwordReq,
		accounts: [accountSchema],
		username: {
			type: String,
			required: true,
		},
		totalBalance: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

// hash password
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

		return { message: "invalid credentials" };
	}

	return { message: "invalid credentials" };
};

const User = model("user", userSchema);

module.exports = User;
