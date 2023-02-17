/* 
 Route: /api/users
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { getUsers, createUser } = require("../controllers/users");
const { fieldValidation } = require("../middlewares/field-validation");

const router = Router();

// getUsers
router.get("/", getUsers);

// createUser
router.post(
	"/",
	[
		check("name","The name is required").notEmpty(),
		check("password", "The password is Required").notEmpty(),
		check("email", "The email format is incorrect").isEmail(),
        fieldValidation
	],
	createUser
);

module.exports = router;
