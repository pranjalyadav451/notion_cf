const { pingCf, is_valid } = require("./pingCf");
const cf = require("./config");
const { getContestInfo } = require("./getContestInfo");
const { createPages, updateSolved } = require("../notion/updateNotion");
const { generateProbLink } = require("./generateProbLink");

let NUM_PROBS = 0;

const currrentDivLevel = (contestName) => {
	if (!is_valid(contestName)) return -1;
	if (contestName.includes("Div. 2")) {
		return 2;
	} else if (contestName.includes("Div. 3")) return 3;
	else return -1;
};
const currentProbLevel = (contestName, index) => {
	if (!is_valid(contestName, index)) {
		return false;
	}
	if (
		(currrentDivLevel(contestName) === 2 && index > "A" && index < "D") ||
		(currrentDivLevel(contestName) === 3 && index > "A" && index < "E")
	)
		return true;
	return false;
};

const currentTags = (tags) => {
	let inc = ["dp"];
	let exc = ["greedy"];
	for (let tag of tags) {
		if (exc.includes(tag)) return false;
	}
	for (let tag of tags) {
		if (inc.includes(tag)) return true;
	}
	return false;
};

const processForNotion = async (probsForNotion, allSolved, addPage = false) => {
	for (let prob of probsForNotion) {
		// console.log(prob);
		if (
			currentProbLevel(prob.contest, prob.index) &&
			addPage === true &&
			NUM_PROBS < 100 &&
			currentTags(prob.tags) &&
			allSolved.has(generateProbLink(prob.contestId, prob.index)) ===
				false
		) {
			console.log(prob);
			NUM_PROBS++;
			await createPages(prob);
		}
	}
};

const filterByTags = async () => {
	let allContests = await pingCf(cf.methods.contestList);

	// Just Search in the last 10 Contests
	const LIM = Math.min(allContests.length, 1000);
	//	contest.name.includes(`Div. ${div}`) - for just searching for the problems of a particular div

	const allSolved = await updateSolved();
	// console.log(allSolved);

	if (!is_valid(allContests)) {
		console.log("API ERROR !!!");
	} else {
		for (let i = 0; i < LIM; i++) {
			let contest = allContests[i];
			if (
				currrentDivLevel(contest.name) > 1 &&
				contest.phase == "FINISHED"
			) {
				if (NUM_PROBS >= 100) return;
				// console.log(contest);
				let probsForNotion = await getContestInfo(contest.id);
				await processForNotion(probsForNotion, allSolved, true);
			}
		}
	}
};

module.exports = { filterByTags: filterByTags };
