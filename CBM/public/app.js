angular.module('MyApp', ['ngCookies',  'mgcrea.ngStrap'	]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'views/home.html',
		controller: 'HomeController'
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
		controller: 'LoginController'
	}).
	when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'SignUpController'
	}).
	when('/user', {
		templateUrl: 'views/user.html',
		controller: 'UserController'
	})
	
}]);

