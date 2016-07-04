const ex = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&generator=search&exsentences=2&exlimit=10&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&pilimit=10&gsrnamespace=0&gsrlimit=10&gsrsearch=";
const wikiAPIurl = "https://en.wikipedia.org/w/api.php";

let resultsPanel = document.querySelector('.search-results');


// $.ajax({
// 	url: mainLink,
// 	type: "GET",
// 	dataType: "jsonp",
// 	success: function (data) {
// 	console.log(data);
// // and other stuff i do with the data i get
// 	},
// 	xhrFields: {
// 				withCredentials: false
// 		}
// }) // end ajax

const resultsCount = 10, thumbnailsize = 100;

function requestPages(term, cb) {
	// $.ajax({
	// 	url: wikiAPIurl,
	// 	method: "GET",
	// 	dataType: "jsonp",
	// 	data: {
	// 		action: "query",
	// 		format: "json",
	// 		generator: "search",
	// 		gsrnamespace: 0,
	// 		gsrlimit: resultsCount,
	// 		gsrsearch: term,
	// 		prop: "extracts|pageimages",
	// 		exsentences: 2,
	// 		exlimit: resultsCount,
	// 		exintro: 1,
	// 		explaintext: 1,
	// 		piprop: "thumbnail",
	// 		pithumbsize: thumbnailsize,
	// 		pilimit: resultsCount
	// 	}
	// })
	// .then(cb, function (_, status, error) {
	// 	console.log("Error", error, ", status", status);
	// });

	JSONP.get(wikiAPIurl, {
		action: "query",
		format: "json",
		generator: "search",
		gsrnamespace: 0,
		gsrlimit: resultsCount,
		gsrsearch: term,
		prop: "extracts|pageimages",
		exsentences: 2,
		exlimit: resultsCount,
		exintro: 1,
		explaintext: 1,
		piprop: "thumbnail",
		pithumbsize: thumbnailsize,
		pilimit: resultsCount
	},
		cb);
}

function logResult() {
	requestPages("Time", data => {
		const pages = data.query.pages;
		for (let key of Object.keys(pages)) {
			let {title, pageid, extract, thumbnail} = pages[key];
			console.log(key, "title:", title, ", pageid:", pageid, ", extract:", extract, ", img:", thumbnail ? thumbnail.source : null);
		}
	});
}

function displaySearchResults(data) {
	// if(resultsPanel.hasChildNodes()) clearResultsPanel();

	fillResultsPanel(data.query.pages);
}



function fillResultsPanel(data) {
	if(!data.query || !data.query.pages) return;
	const pages = data.query.pages;
	const promises = [];
	const fragment = document.createDocumentFragment();

	for (let key of Object.keys(pages)) {
		// let {title, pageid, extract, thumbnail} = pages[key];
		// console.log(key, "title:", title, ", pageid:", pageid, ", extract:", extract, ", img:", thumbnail ? thumbnail.source : null);
		fragment.appendChild(constructItem(pages[key]));
	}

	// add results only after all images have been loaded
	Promise.all(promises).then(() => {
		if(resultsPanel.hasChildNodes()) clearResultsPanel();
		resultsPanel.appendChild(fragment);
	});

	function constructItem({title, pageid, extract, thumbnail}) {
		const h3 = document.createElement("h3");
		h3.textContent = title;
		h3.className = "title";

		let img;

		if(thumbnail) {
			img = new Image();
			img.className = "thumbnail";
			img.alt = title;
			const promise = new Promise(function (resolve) {
				img.onload = () => resolve();
			});
			img.src = thumbnail.source;

			promises.push(promise);
		}

		const p = document.createElement("p");
		p.textContent = extract;
		p.className = "body";

		const itemContents = document.createElement("div");
		itemContents.className = "item-contents";
		itemContents.appendChild(h3);
		if(img) itemContents.appendChild(img);
		itemContents.appendChild(p);

		const item = document.createElement("a");
		item.href = "https://en.wikipedia.org/?curid=" + pageid;
		item.target = "_blank";
		item.className = "item";
		item.appendChild(itemContents);

		return item;
	}
}

function clearResultsPanel() {
	const clone = resultsPanel.cloneNode(false);
	resultsPanel.parentNode.replaceChild(clone, resultsPanel);
	resultsPanel = clone;
}

const $input = $("#search-input");
// $input.on('keydown', (e) => {console.log("keydown", e.key);});
// $input.on('keyup', (e) => {console.log("keyup", e.key);});
// $input.on('input', (e) => {console.log("input", $input.val(), e);});
// $input.on('change', (e) => {console.log("change", $input.val(), e);});
document.getElementById('search-input').oninput = _.throttle(searchWiki, 500, {leading: false, trailing: true});

function searchWiki() {
	console.log("invoked thrtl");
	if(this.value) requestPages(this.value, fillResultsPanel);
	else clearResultsPanel();
}
