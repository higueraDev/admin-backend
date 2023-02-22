const { Schema, model } = require("mongoose");

const PhysicianSchema = new Schema({
	image: {
		type: String,
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
	,
	hospital: {
		type: Schema.Types.ObjectId,
		ref: 'Hospital',
		required: true
	}
});

PhysicianSchema.method("toJSON", function () {
	const { _id: id, __v, ...object } = this.toObject();

	return { id, ...object };
});

module.exports = model("Physician", PhysicianSchema);
