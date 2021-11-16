const { Schema } = require("mongoose");
const historySchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
		},
		transactionType: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = historySchema;
