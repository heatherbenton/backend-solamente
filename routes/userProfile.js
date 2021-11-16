const { Router } = require("express");
const { verifyUser } = require("../middlewares/jwt");
const User = require('../models/user');

const router = Router();

router.get("/profile", verifyUser, async (req, res) => {
	try {
		const user = await User.findById(req.userInfo.id);//.populate('account');
		res.status(200).json(user);
	} catch(err) {
		console.log('errr==>>', err)
		res.status(500).send(err);
	}
});

module.exports = router;
