import express from "express";

const userRouter = express.Router();

userRouter.post("/login", (req, res) => {
	res.send("Logged in");
});

userRouter.post("/register", (req, res) => {
	res.send("Registered");
});

export { userRouter };
