const { Schema, model } = require("mongoose");

const HospitalSchema = Schema({
	image: {
		type: String,
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
    createdBy: {
        type: Schema.Types.ObjectId,
		required: true,
        ref: 'User',
    }
});

HospitalSchema.method("toJSON", function () {
	const { _id: id, __v,...object } = this.toObject();

	return { id, ...object };
});

module.exports = model("Hospital", HospitalSchema);
