var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var StandingsListViewModel = require("../../shared/view-models/standings-list-view-model");
var SessionsViewModel = require("../../shared/view-models/session-view-model");
var fileSystemModule = require("file-system");
var fileName = 'sessionData.json';
var file = fileSystemModule.knownFolders.documents().getFile(fileName);
var page;
var button;

var standingsList = new StandingsListViewModel([]);
var poolNameString = {poolName: ""};
// Retrieves data from session.cfm indluding current poolId, poolName, and memberId
// Also checks local storage to retreive the poolName string, which includes current pool id and name combined and formatted

var pageData = new Observable({
	standingsList: standingsList
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;
	button = page.getViewById("poolsButton");
	button.bindingContext = poolNameString;

	if (page.navigationContext){
		var gotData = page.navigationContext;		
		poolNameString.poolName = gotData.param1 + " (" + gotData.param2 + ")";
	} else {
		file.readText()
		.then(function(content) {
			console.dump(content);
			var parsedContent = JSON.parse(content);
			poolNameString.poolName = parsedContent.poolname.toUpperCase() + " (" + parsedContent.poolid + ")";
			console.log(poolNameString.poolName);
		});
	}

	standingsList.empty();
	standingsList.load();

};

exports.goToPoolsList = function() {
	frameModule.topmost().navigate("views/pools/pools");
}