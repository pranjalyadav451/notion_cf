const { pingcf, is_valid } = require("./pingCf");
const cf = require("./config");

function generateProbLink(contestId, probIndex) {
	// Example ->  "https://codeforces.com/problemset/problem/1542/E2"
	if (is_valid(contestId) && is_valid(probIndex)) {
		let probName = cf.cfConfig.baseProbLink + `${contestId}/${probIndex}`;
		return probName;
	}

	return "____";
}
module.exports = { generateProbLink: generateProbLink };
