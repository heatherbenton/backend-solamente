const { Schema, Types, model } = require("mongoose");
const historySchema = require("../models/history");

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
		acctNo: {
			default: Math.floor(1000000000 + Math.random() * 9000000000),
			type: Number
		},
		history: [historySchema],
		userId: {
			type: Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true }
);

const Account = model("Account", accountSchema);

module.exports = Account;
