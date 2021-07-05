const { pingcf, is_valid } = require("./pingCf");
const cf = require("./config");

const filterByDiv = async (div = 2) => {
	// let allContests = await pingCf(cf.methods.contestList);

	if (!is_valid(allContests)) {
		console.log("API ERROR !!!");
	} else {
		for (let i = 0; i < 10; i++) {
			let contest = allContests[i];
			if (
				contest.name.includes(`Div. ${div}`) &&
				contest.phase == "FINISHED"
			) {
				console.log(contest);
				await getContestInfo(contest.id);
			}
		}
	}
};
