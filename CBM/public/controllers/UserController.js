angular.module('MyApp')
.controller('UserController', ['$scope','$cookieStore','ComicsByMail', function($scope, $cookieStore,ComicsByMail) {

	
	ComicsByMail.get($cookieStore.get('mail')).success(function(data){

		$scope.comics=data;
		console.log($scope.comics);

	});

	$scope.selectedTab=1;

}])