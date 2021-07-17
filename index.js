const { getContestInfo } = require("./api/codeforces/getContestInfo");
const { filterByDiv } = require("./api/codeforces/filterByDiv");
const { createPages, updateSolved } = require("./api/notion/updateNotion");
const { filterByTags } = require("./api/codeforces/filterByTags");

// filterByDiv();
filterByTags();
// getContestInfo(1542);
