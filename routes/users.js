/* 
 Route: /api/users
 */
const { Router } = require("express");
const { check } = require("express-validator");
const {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/users");
const { fieldValidation } = require("../middlewares/field-validation");
const { tokenValidation } = require("../middlewares/token-validation");

const router = Router();

// getUsers
router.get("/", tokenValidation, getUsers);

// createUser
router.post(
	"/",
	[
		tokenValidation,
		check("name", "The name is required").notEmpty(),
		check("password", "The password is Required").notEmpty(),
		check("email", "The email format is incorrect").isEmail(),
		fieldValidation,
	],
	createUser
);

// updateUser
router.put(
	"/:id",
	[
		tokenValidation,
		check("name", "The name is required").notEmpty(),
		check("email", "The email format is incorrect").isEmail(),
		fieldValidation,
	],
	updateUser
);

// deleteUser
router.delete("/:id", tokenValidation, deleteUser);

module.exports = router;
