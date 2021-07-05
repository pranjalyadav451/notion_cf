const { getContestInfo } = require("./api/codeforces/getContestInfo");
const { filterByDiv } = require("./api/codeforces/filterByDiv");
const { createPages, updateSolved } = require("./api/notion/updateNotion");
updateSolved();
