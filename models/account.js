// import user model
const User = require("../models/user");

// for opening account
const account_post = async (req, res) => {
	const { acctName, balance, id } = req.body;

	try {
		const user = await User.findById(id);
		const newAccount = { acctName, balance };
		user.accounts.push(newAccount);
		user["totalBalance"] = parseInt(user["totalBalance"]) + parseInt(balance);
		user.markModified("accounts");
		user.markModified("totalBalance");

		// async
		const result = await user.save();

		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

// deposit
const account_deposit = async (req, res) => {
	const { amount, accountId, id } = req.body;

	try {
		// find user
		const user = await User.findById(id);

		// get account index from accounts array
		let accountIndex = 0;

		for (let i = 0; i < user["accounts"].length; i++) {
			if (user["accounts"][i]["_id"].equals(accountId)) {
				accountIndex = i;
			}
		}

		// save new balance
		let newAcctBal =
			parseInt(user["accounts"][accountIndex].balance) + parseInt(amount);

		// save total balance
		let newTotalBal = parseInt(user["totalBalance"]) + parseInt(amount);

		// update
		user["accounts"][accountIndex].balance = newAcctBal;

		user["totalBalance"] = newTotalBal;

		// mark modified
		user.markModified("accounts");
		user.markModified("totalBalance");

		const result = await user.save();

		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ message: "error: bad request" });
	}
};

// account withdraw
const account_withdraw = async (req, res) => {
	const { amount, accountId, id } = req.body;

	try {
		// let's see if we can find that user
		const user = await User.findById(id);

		// grab account index from array
		let accountIndex = 0;

		for (let i = 0; i < user["accounts"].length; i++) {
			if (user["accounts"][i]["_id"].equals(accountId)) {
				accountIndex = i;
			}
		}

		// save the new balance... money, not shoes
		let newAcctBal =
			parseInt(user["accounts"][accountIndex].balance) - parseInt(amount);

		// save total balance
		let newTotalBal = parseInt(user["totalBalance"]) - parseInt(amount);

		// update that balance
		user["accounts"][accountIndex].balance = newAcctBal;
		user["totalBalance"] = newTotalBal;

		// mark modified
		user.markModified("accounts");
		user.markModified("totalBalance");

		// save
		const result = await user.save();

		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

// close account, not a fan of the bank
const account_close = async (req, res) => {
	const { accountId, id } = req.body;

	try {
		// locate user
		const user = await User.findById(id);

		// account index from array
		let accountIndex = 0;
		let balance = 0;

		for (let i = 0; i < user["accounts"].length; i++) {
			if (user["accounts"][i]["_id"].equals(accountId)) {
				accountIndex = i;
				balance = user["accounts"][i]["balance"];
			}
		}

		// save total balance
		let newTotalBal = parseInt(user["totalBalance"]) - parseInt(balance);

		// update
		user["accounts"].splice(accountIndex, 1);
		user["totalBalance"] = newTotalBal;

		// mark modified
		user.markModified("accounts");
		user.markModified("totalBalance");

		// save
		const result = await user.save();

		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports = {
	account_post,
	account_deposit,
	account_withdraw,
	account_close,
};
