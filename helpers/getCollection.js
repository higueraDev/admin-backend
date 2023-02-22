const getCollection = (table) => {
	const tables = {
		hospitals: require("../models/hospital"),
		physicians: require("../models/physician"),
		users: require("../models/user"),
	};

	return tables[table];
};

module.exports = {
	getCollection,
};
