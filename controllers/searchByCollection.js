const { response } = require("express");
const { getCollection } = require("../helpers/getCollection");

const searchByCollection = async (req, res = response) => {
	try {
		const { table, query } = req.params;

		const regex = new RegExp(query, "i");

		const collectionDB = getCollection(table);

		if (!collectionDB)
			return res.status(400).json({
				ok: false,
				msg: "The table doesn't exists",
			});

		const result =
			table !== "users"
				? await collectionDB
						.find({ name: regex })
						.populate("createdBy", "name image")
				: await collectionDB.find({ name: regex });

		res.json({
			ok: true,
			result,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Unexpected Error",
		});
	}
};

module.exports = { searchByCollection };
