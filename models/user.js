const { Schema, model } = require("mongoose");

const UserSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	role: {
		type: String,
		default: "USER_ROLE",
	},
	google: {
		type: Boolean,
		default: false,
	},
});

UserSchema.method("toJSON", function () {
	const { _id: uid, __v,password,...object } = this.toObject();

	return { uid, ...object };
});

module.exports = model("User", UserSchema);
