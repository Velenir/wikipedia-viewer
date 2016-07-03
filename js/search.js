const ex = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&generator=search&exsentences=2&exlimit=10&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&pilimit=10&gsrnamespace=0&gsrlimit=10&gsrsearch=";
const min = "https://en.wikipedia.org/w/api.php";


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

function getSearchResults(term, cb) {
	$.ajax({
		url: min,
		method: "GET",
		dataType: "jsonp",
		data: {
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
		}
	})
	.then(cb, function (_, status, error) {
		console.log("Error", error, ", status", status);
	});
}

function logResult() {
	getSearchResults("Time", data => {
		const pages = data.query.pages;
		for (let key of Object.keys(pages)) {
			let {title, pageid, extract, thumbnail} = pages[key];
			console.log(key, "title:", title, ", pageid:", pageid, ", extract:", extract, ", img:", thumbnail ? thumbnail.source : null);
		}
	});
}

const $input = $("#search-input");
// $input.on('keydown', (e) => {console.log("keydown", e.key);});
// $input.on('keyup', (e) => {console.log("keyup", e.key);});
$input.on('input', (e) => {console.log("input", $input.val(), e);});
// $input.on('change', (e) => {console.log("change", $input.val(), e);});
