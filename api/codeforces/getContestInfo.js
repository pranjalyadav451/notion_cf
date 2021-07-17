const { pingCf, is_valid } = require("./pingCf");
const cf = require("./config");
const { createPages, updateSolved } = require("../notion/updateNotion");
const { generateProbLink } = require("./generateProbLink");

async function getContestInfo(contestId) {
	// Example -> https://codeforces.com/api/contest.standings?contestId=566&from=1&count=5&showUnofficial=true
	queryParams = {
		contestId: contestId,
		from: 1,
		count: 1,
		showUnofficial: false,
	};
	let contestInfo = await pingCf(cf.methods.contestStandings, queryParams);
	let probsForNotion = [];
	for (prob of contestInfo.problems) {
		// console.log(prob);
		let forNotion = {
			contestId: prob.contestId,
			contest: contestInfo.contest.name,
			name: prob.name,
			rating: prob.rating || 0,
			tags: prob.tags,
			index: prob.index,
			link: generateProbLink(contestId, prob.index),
		};
		// console.log("forNotion", forNotion);
		probsForNotion.push(forNotion);
	}
	return probsForNotion;
}
module.exports = { getContestInfo: getContestInfo };
