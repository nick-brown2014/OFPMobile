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
var sessionsViewModel = new SessionsViewModel();
// Retrieves data from session.cfm indluding current poolId, poolName, and memberId
// Also checks local storage to retreive the poolName string, which includes current pool id and name combined and formatted

var pageData = new Observable({
	standingsList: standingsList
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;
	button = page.getViewById("poolsButton");
	button.bindingContext = sessionsViewModel;

	sessionsViewModel.getCurrentPool();

	standingsList.empty();
	standingsList.load();

};

exports.goToPoolsList = function() {
	frameModule.topmost().navigate("views/pools/pools");
}