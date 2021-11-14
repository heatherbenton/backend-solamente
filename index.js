const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const rootDir = require("./path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// route imports
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
//const userProfileRouter = require("./routes/userProfile");
const accountRouter = require("./routes/account");

// security
require("dotenv").config({ path: path.join(rootDir, "secure", ".env") });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// setup express server
const app = express();

// first, incoming request must be parsed before cookie Parser
app.use(express.json());

app.use(express.static("public"));
app.use(
	cors({
		origin: ["http://localhost:3000", "https://snippetmanager.netlify.app"],
		methods: ["GET", "POST"],
		credentials: false,
	})
);

// convert json
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// connect heroku to mongo string
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		console.log("Third Coast is connected to MongoDB");
		app.listen(PORT, () => console.log("Third Coast server running on", PORT));
	})
	.catch((err) => console.log(err));

// routes
app.use(authRouter);
//app.use(userProfileRouter);
app.use(accountRouter);
app.use(homeRouter);

// 404 error page
app.use((req, res) => res.status(404).json({ message: "Page not found" }));
