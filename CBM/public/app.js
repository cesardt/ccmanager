var app = angular.module('MyApp', [ 'ngRoute','slick']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/home.html',
        controller: MainController
    }).
      otherwise({
        redirectTo: '/'
      });

}]);


function MainController($scope, $http,$route) {
    console.log("hi");


}
