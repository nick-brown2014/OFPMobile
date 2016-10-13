var UserViewModel = require("../../shared/view-models/user-view-model");
var SessionsViewModel = require("../../shared/view-models/session-view-model");
var PoolsListViewModel = require("../../shared/view-models/pools-list-view-model");
var Observable = require("data/observable").Observable;
var appSettings = require("application-settings");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var fileSystemModule = require("file-system");
var fileName = 'sessionData.json';
var file = fileSystemModule.knownFolders.documents().getFile(fileName);

var user = new UserViewModel({
    email: "nick.brown2014",
    password: "gobengals"
});

var session = new SessionsViewModel();
var pool = new PoolsListViewModel([]);

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = user;

    session.clearSession();
    
    file.readText()
    .then(function(content) {
        parsedContent = JSON.parse(content);
        if (parsedContent.memberid) {
            user.login()
            .catch(function(error) {
                console.log(error);
                dialogsModule.alert({
                    message: "Unfortunately we could not find your account.",
                    okButtonText: "OK"
                });
                return Promise.reject();
            })
            .then(function() {
                frameModule.topmost().navigate("views/standings/standings");
            });       
        };
    });

};

exports.signIn = function() {
    user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            session.fetchSession();
        })
        .then(function() {
            frameModule.topmost().navigate("views/standings/standings");
        });
};

exports.signUp = function() {
	frameModule.topmost().navigate("views/standings/standings");
};