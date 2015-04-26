angular.module('MyApp', ['ui.bootstrap','angular-carousel']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainController'
	}).
	when('/browse', {
		templateUrl: 'views/browse.html',
		controller: 'ListController'
	}).
	when('/info/:id', {
		templateUrl: 'views/info.html',
		controller: 'ComicDetailController'
	}).
	when('/login', {
		templateUrl: 'views/login.html',
		controller: 'MainController'
	}).
	when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'MainController'
	}).
	when('/user', {
		templateUrl: 'views/user.html',
		controller: 'MainController'
	})
	
}]);

angular.module('MyApp')
.controller('MainController', ['$scope', function($scope) {
	//this is a placeholder, change it in the next iteration
}])