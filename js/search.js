const ex = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&generator=search&exsentences=2&exlimit=10&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&pilimit=10&gsrnamespace=0&gsrlimit=10&gsrsearch=";


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

function getSearchResults(term, cb) {
	$.ajax({
		url: ex + term,
		method: 'GET',
		dataType: 'jsonp',
		data: {param1: 'value1'}
	})
	.then(cb, function (_, status, error) {
		console.log("Error", error, ", status", status);
	});
}

function logResult() {
	getSearchResults("Time", data => console.log(data));
}

const $input = $("#search-input");
// $input.on('keydown', (e) => {console.log("keydown", e.key);});
// $input.on('keyup', (e) => {console.log("keyup", e.key);});
$input.on('input', (e) => {console.log("input", $input.val(), e);});
// $input.on('change', (e) => {console.log("change", $input.val(), e);});
