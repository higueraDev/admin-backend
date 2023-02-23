/* Path: /api/login */

const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignin, updateToken } = require("../controllers/auth");
const { fieldValidation } = require("../middlewares/field-validation");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

router.post(
	"/",
	[
		check("email", "The email format is not correct").isEmail(),
		check("password", "The password is required").notEmpty(),
		fieldValidation,
	],
	login
);

router.post(
	"/google",
	[check("token", "The google token is invalid").notEmpty(), fieldValidation],
	googleSignin
);

router.get("/update-token",tokenValidation,updateToken)

module.exports = router;
