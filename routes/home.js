const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
	res.status(200).json({ message: "Third Coast Bank" });
});

module.exports = router;
