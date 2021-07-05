const axios = require("axios");
const cf = require("./config");

const is_valid = (res) => {
	if (res == undefined || res == "" || res == null) return false;
	else return true;
};
const pingCf = async (toSearch, queryParams = {}) => {
	if (!is_valid(toSearch)) {
		console.log("Call the API Properly you fool!!!");
	}
	let result;
	await axios({
		baseURL: cf.cfConfig.baseURL,
		url: toSearch,
		params: queryParams,
	})
		.then((res) => {
			result = res.data.result;
		})
		.catch((err) => {
			console.log(err);
		});

	if (is_valid(result)) return result;
};
module.exports = { pingCf: pingCf, is_valid: is_valid };
