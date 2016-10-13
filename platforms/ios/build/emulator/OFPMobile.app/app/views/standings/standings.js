var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var StandingsListViewModel = require("../../shared/view-models/standings-list-view-model");
var SessionsViewModel = require("../../shared/view-models/session-view-model");
var fileSystemModule = require("file-system");
var fileName = 'sessionData.json';
var file = fileSystemModule.knownFolders.documents().getFile(fileName);

var standingsList = new StandingsListViewModel([]);
var sessionsViewModel = new SessionsViewModel();

var pageData = new Observable({
	standingsList: standingsList,
	sessionsViewModel: sessionsViewModel
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;

	standingsList.empty();
	standingsList.load();

	sessionsViewModel.getCurrentPool();
};

exports.goToPoolsList = function() {
	frameModule.topmost().navigate("views/pools/pools");
}