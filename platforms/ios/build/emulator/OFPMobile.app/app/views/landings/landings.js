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

var pageData = new Observable ({
    user: user,
    session: session,
    pool: pool
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    // session.clearSession();
    
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
            session.fetchSession()
            .then(function() {
                file.readText()
                .then(function(content) {
                    var parsedContent = JSON.parse(content);
                });
                pool.load()
                .then(function() {
                    var pools = pool._array;
                    pools.forEach(function(i) {
                        if (parseInt(i.id) === parsedContent.id) {
                            parsedContent.name = i.name;
                        };
                    });
                });
            });
        })
        .then(function() {
            frameModule.topmost().navigate("views/standings/standings");
        });
};

exports.signUp = function() {
	frameModule.topmost().navigate("views/standings/standings");
};