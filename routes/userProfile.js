const { Router } = require("express");
const { verifyUser } = require("./jwt");
const router = Router();

router.get("/profile", verifyUser, (req, res) => {
	const userInfo = req.userInfo;
	const isAuth = req.isAuth;

	if (userInfo && isAuth) {
		res.status(200).json({ userInfo, isAuth });
	}

	if (!isAuth) {
		res.status(401).json({ isAuth });
	}
});

module.exports = router;
