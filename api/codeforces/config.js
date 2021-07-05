cfConfig = {
	baseURL: "https://codeforces.com/api/",
	baseProbLink: "https://codeforces.com/problemset/problem/",
};
methods = {
	contestList: "contest.list",
	blogComments: "blogEntry.comments",
	blogView: "blogEntry.view",
	contestHacks: "contest.hacks",
	contestRatingChanges: "contest.ratingChanges",
	contestStandings: "contest.standings",
	contestStatus: "contest.status",
	problemSet: "problemset.problems",
	problemSetRecentStatus: "problemset.recentStatus",
	userStatus: "user.status",
	userInfo: "user.info",
	userRatedList: "user.ratedList",
	userRating: "user.rating",
};
module.exports = { methods, cfConfig };
