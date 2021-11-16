// import user model
const User = require("../models/user");
const Account = require("../models/account");

// for opening account
const account_post = async (req, res) => {
	const { acctName, balance } = req.body;

	try {
		/// const user = await User.findById(id);
		const bankAccount = await Account.create({
			acctName,
			balance,
			userId: req.userInfo.id,
		});
		/*const newAccount = { acctName, balance };
		user.accounts.push(newAccount);
		user["totalBalance"] = parseInt(user["totalBalance"]) + parseInt(balance);
		user.markModified("accounts");
		user.markModified("totalBalance");

		// async
		const result = await user.save();*/

		res.status(200).json(bankAccount);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

// deposit or withdraw
const account_deposit_or_withdraw = async (req, res) => {
	const { amount, acctNo } = req.body;

	try {
		const newAccount = await Account.updateOne(
			{ acctNo },
			{ $inc: { balance: amount } },
			{ new: true }
		);

		res.status(200).json(newAccount);
	} catch (err) {
		console.log('err==>>>', err);
		res.status(400).json({ message: "error: bad request" });
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

// close account, not a fan of the bank
const account_get_all = async (req, res) => {
	try {
		const accountsOpened = await Account.find({ userId: req.userInfo.id });
		res.send(accountsOpened);
	} catch (err) {
		console.log("errrrr==>>", err);
		res.status(400).json({ message: err });
	}
};

const account_get_count = async (req, res) => {
	try {
		const accountsOpened = await Account.countDocuments({
			userId: req.userInfo._id,
		});
		res.send({ accountsOpened });
	} catch (err) {
		console.log("errrrr==>>", err);
		res.status(400).json({ message: err });
	}
};

module.exports = {
	account_post,
	account_deposit_or_withdraw,
	account_close,
	account_get_all,
	account_get_count,
};
