const wikiAPIurl = "https://en.wikipedia.org/w/api.php";

const input = document.getElementById('search-input');
let resultsPanel = document.querySelector('.search-results');


const resultsCount = 10, thumbnailsize = 100;

function requestPages(term, cb) {
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


function requestRandomPage(cb) {
	JSONP.get(wikiAPIurl, {
		action: "query",
		format: "json",
		generator: "random",
		redirects: 1,
		grnnamespace: 0,
		prop: "extracts|pageimages",
		exsentences: 2,
		exintro: 1,
		explaintext: 1,
		piprop: "thumbnail",
		pithumbsize: thumbnailsize
	},
		cb);
}

function fillResultsPanel(data) {
	if(!data.query || !data.query.pages) return;
	const pages = data.query.pages;
	const promises = [];
	const fragment = document.createDocumentFragment();

	for (let key of Object.keys(pages)) {
		fragment.appendChild(constructItem(pages[key]));
	}

	function constructItem({title, pageid, extract, thumbnail}) {
		const itemContents = document.createElement("div");
		itemContents.className = "item-contents";

		const h3 = document.createElement("h3");
		h3.textContent = title;
		h3.className = "title";

		itemContents.appendChild(h3);

		if(thumbnail) {
			const img = new Image();
			img.className = "thumbnail";
			img.alt = title;
			const promise = new Promise(function (resolve) {
				img.onload = () => resolve();
			});
			img.src = thumbnail.source;

			promises.push(promise);

			itemContents.appendChild(img);
		}

		const p = document.createElement("p");
		p.textContent = extract;
		p.className = "body";

		itemContents.appendChild(p);

		const item = document.createElement("a");
		item.href = "https://en.wikipedia.org/?curid=" + pageid;
		item.target = "_blank";
		item.className = "item";
		item.appendChild(itemContents);

		return item;
	}

	function appendFragment() {
		clearResultsPanel();
		resultsPanel.appendChild(fragment);
		resultsPanel.classList.add("opaque");
	}

	// add results only after all images have been loaded
	// add what yyou have on fail anyway
	return Promise.all(promises).then(appendFragment, appendFragment);
}

function clearResultsPanel() {
	const clone = resultsPanel.cloneNode(false);
	resultsPanel.parentNode.replaceChild(clone, resultsPanel);
	resultsPanel = clone;
}


input.oninput = _.debounce(searchWiki, 500, {leading: false, trailing: true});
document.getElementById('random').onclick = getRandomPage;

function searchWiki() {
	console.log("invoked thrtl");
	if(this.value) requestPages(this.value, fillResultsPanel);
	else clearResultsPanel();
}

function getRandomPage() {
	console.log("random");

	requestRandomPage(function (data) {
		fillResultsPanel(data).then(function () {
			const pages = data.query.pages;
			input.value = pages[Object.keys(pages)[0]].title;
		});
	});
}
