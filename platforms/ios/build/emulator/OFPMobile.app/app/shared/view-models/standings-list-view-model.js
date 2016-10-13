var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function StandingsListViewModel(items) {
	var viewModel = new ObservableArray(items);

	viewModel.load = function() {
		var url = config.apiURI + "getStandings.cfm?weekid=398";
		return fetch(url)
		.then(handleErrors)
		.then(function(data) {
			var parsedData = JSON.parse(data._bodyInit);
			var users = parsedData.users;
			users.forEach(function(user) {
				viewModel.push({
					place: user.place,
					username: user.username,
					record: user.record
				});
			});
			viewModel.prepareStandings();

		})
		.catch(function(error) {
			console.log("ERROR: " + error);
		});
	};

	viewModel.prepareStandings = function() {
		var array = viewModel._array;
		array.forEach(function(entry) {
			var index = array.indexOf(entry);
			var joinedRecord = ""
			entry.place = entry.place + ": ";
			entry.record.forEach(function(standing) {
				if (standing.slice(-2) === ".0") {
					standing = standing.slice(0, -2);
				};
				joinedRecord = joinedRecord + standing + " - ";
			});
			joinedRecord = joinedRecord.slice(0, -3);
			array[index].joinedRecord = joinedRecord;
		});
	};

	viewModel.empty = function() {
	    while (viewModel.length) {
	        viewModel.pop();
	    }
	};

	viewModel.checkArray = function() {
		console.dump(viewModel._array);
	};

	return viewModel;

}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = StandingsListViewModel;