const dotenv = require("dotenv").config();
const axios = require("axios");
const { Client } = require("@notionhq/client");
const cf = require("../codeforces/config");
const { pingCf, is_valid } = require("../codeforces/pingCf");
const { generateProbLink } = require("../codeforces/generateProbLink");

// Init
const notion = new Client({
	auth: process.env.NOTION_DP_TOKEN,
});
const createPages = async (probInfo) => {
	let notionEntry = {
		Contest: probInfo.contest,
		Name: probInfo.name,
		Link: probInfo.link,
		Index: probInfo.index,
		Difficulty: probInfo.rating,
		Tags: (() => {
			let tags_arr = [];
			for (let tag of probInfo.tags) {
				let item = {};
				item["name"] = `${tag}`;
				tags_arr.push(item);
			}
			return tags_arr;
		})(),
	};
	console.log(notionEntry);
	const response = await notion.pages.create({
		parent: {
			database_id: process.env.NOTION_DP_DATABASE_ID,
		},
		properties: {
			Name: {
				title: [
					{
						text: {
							content: notionEntry.Name,
						},
					},
				],
			},
			Link: {
				url: notionEntry.Link,
			},
			Index: {
				select: {
					name: notionEntry.Index,
				},
			},
			Contest: {
				select: {
					name: probInfo.contest,
				},
			},
			Difficulty: {
				number: notionEntry.Difficulty,
			},
			Tags: {
				multi_select: notionEntry.Tags,
			},
		},
	});
	// console.log(response);
};
const updateSolved = async () => {
	let allAttempted = await pingCf(cf.methods.userStatus, {
		handle: "Pranjal9415",
	});
	let solved = new Map();
	for (let attempt of allAttempted) {
		let probInfo = attempt.problem;
		// console.log(attempt);
		let notion_id = generateProbLink(probInfo.contestId, probInfo.index);
		// console.log(notion_id);
		if (attempt.verdict === "OK") {
			solved.set(notion_id, true);
		}
	}
	return solved;
};
module.exports = { createPages: createPages, updateSolved: updateSolved };
