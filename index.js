require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// route imports
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const userProfileRouter = require("./routes/userProfile");
const accountRouter = require("./routes/account");

// setup express server
const app = express();

// first, incoming request must be parsed before cookie Parser
app.use(express.json());

app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ["GET", "POST"],
		credentials: false,
	})
);

// connect to mongo string
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		console.log("Third Coast is connected to MongoDB");
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	})
	.catch((err) => console.log(err));

// routes
app.use(authRouter);
app.use(userProfileRouter);
app.use(accountRouter);
app.use(homeRouter);

// 404 error page
app.use((req, res) => res.status(404).json({ message: "Page not found" }));

