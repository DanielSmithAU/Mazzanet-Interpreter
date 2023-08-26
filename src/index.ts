import axios, {AxiosError} from "axios";
import {JSDOM} from "jsdom";
import {Page} from "./types/components/page";
import * as dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env" });

const endpoint = "https://mazzanet.net.au/cfa/pager-cfa-all.php";

const getRecentPagerMessages = async (): Promise<Page[]> => {
	let html;

	await axios.get(endpoint)
		.then(res => {
			html = res.data;
		})
		.catch((error: AxiosError) => {
			console.error(`There was an error with ${error.config?.url}.`);
			console.error(error.toJSON());
			return [];
		});

	const dom = new JSDOM(html);
	const tableEntries = Array.from(dom.window.document.querySelectorAll("tr"));

	let pages = [];

	for (const entry of tableEntries) {
		const cells = entry.cells;

		console.log(cells[1])

		pages.push(new Page(
			cells[0].textContent as string,
			cells[1].textContent as string,
			cells[2].textContent as string
		));
	}

	return pages;
}

const main = async () => {
	const pages = await getRecentPagerMessages();

	console.log(pages);
}

main().finally();

