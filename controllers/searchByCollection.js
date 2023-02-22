const { response } = require("express");
const { getTable } = require("../helpers/getTable");

const searchByCollection = async (req, res = response) => {
	try {
		const { table, query } = req.params;

		const regex = new RegExp(query, "i");

		const tableDB = getTable(table);

		if (!tableDB)
			return res.status(400).json({
				ok: false,
				msg: "The table doesn't exists",
			});

		const result =
			table !== "users"
				? await tableDB
						.find({ name: regex })
						.populate("createdBy", "name image")
				: await tableDB.find({ name: regex });

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
