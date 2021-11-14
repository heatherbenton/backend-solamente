const { Router } = require("express");
const {
	account_post,
	account_deposit,
	account_withdraw,
	account_close,
} = require("../models/account");

const router = Router();

router.post("/account/open", account_post);

router.post("/account/deposit", account_deposit);

router.post("/account/withdraw", account_withdraw);

router.post("/account/close", account_close);

module.exports = router;
