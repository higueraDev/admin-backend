const jwt = require("jsonwebtoken");

const tokenValidation = (req, res, next) => {
	const token = req.header("auth-token");

	try {
		if (!token) throw "Empty Token";
		const { uid } = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid
	} catch (error) {
		console.error(error);
		return res.status(401).json({
			ok: false,
			msg: "Not Authorized",
		});
	}
	next();
};

module.exports = {
	tokenValidation,
};
