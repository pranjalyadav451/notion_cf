const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { Client } = require("@notionhq/client");
const cf = require("./api/cf_base.js");

// Init
const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

const listDatabases = async () => {
	const res = await notion.databases.list();
	console.log(res);
};

// listDatabases();

// All codeForces data can be accessed without the use of api key.
// Accessing CodeForces api

function is_valid(res) {
	if (res == undefined || res == "" || res == null) return false;
	else return true;
}

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

async function getContestInfo(contestId) {
	// Example -> https://codeforces.com/api/contest.standings?contestId=566&from=1&count=5&showUnofficial=true
	queryParams = {
		contestId: contestId,
		from: 1,
		count: 1,
		showUnofficial: false,
	};
	let contestInfo = await pingCf(cf.methods.contestStandings, queryParams);
	// console.log("Contest Info :", contestInfo);
	for (prob of contestInfo.problems) {
		// generateProbLink(contestId, prob.index);
		// console.log(prob);
		let forNotion = {
			contest: contestInfo.contest.name,
			name: prob.name,
			rating: prob.rating || 0,
			tags: prob.tags,
			index: prob.index,
			link: generateProbLink(contestId, prob.index),
		};
		console.log("forNotion", forNotion);
		await createPages(forNotion);
	}
}

// NOT async
function generateProbLink(contestId, probIndex) {
	// Example ->  "https://codeforces.com/problemset/problem/1542/E2"
	if (is_valid(contestId) && is_valid(probIndex)) {
		let probName = cf.cfConfig.baseProbLink + `${contestId}/${probIndex}`;
		// console.log(probName);
		return probName;
	}

	return "____";
}

// Is Async
const filterByDiv = async (div = 2) => {
	let allContests = await pingCf(cf.methods.contestList);
	// console.log(allContests);

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
// filterByDiv();

getContestInfo(1542);

const createPages = async (probInfo) => {
	notionEntry = {
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
			database_id: process.env.NOTION_DATABASE_ID,
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
	console.log(response);
};
