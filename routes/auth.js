/* Path: /api/login */

const { Router } = require("express");
const { check } = require("express-validator");
const login = require("../controllers/auth");
const { fieldValidation } = require("../middlewares/field-validation");

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

module.exports = router;
