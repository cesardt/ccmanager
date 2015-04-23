angular.module('MyApp')
.controller('ListController', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

        $scope.comics = [];

        $http.get("/comics/"+$routeParams.id).success(function(response){
            $scope.comics = response;
            console.log(response);
        });
        
}])