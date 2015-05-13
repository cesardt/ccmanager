angular.module('MyApp')
.controller('UserController', ['$scope','$cookieStore','ComicsByMail','ReviewsByMail', function($scope, $cookieStore,ComicsByMail,ReviewsByMail) {

	
	ComicsByMail.get($cookieStore.get('mail')).success(function(data){

		$scope.comics=data;
		

	});

	$scope.selectedTab=2;

	ReviewsByMail.get($cookieStore.get('mail')).success(function(data){

		$scope.reviews=data;	


	});

}])