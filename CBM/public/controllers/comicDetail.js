angular.module('MyApp')
.controller('ComicDetailController', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

        $scope.title = "No title found";
        $scope.issue =  -1;
        $scope.cover = "/images/noCover.jpg";
        $scope.description = "The comic was not found or the comic has no description";


        $http.get("/comics/"+$routeParams.id).success(function(response){
            $scope.title = response[0].name;
            $scope.issue =  response[0].issue;
            $scope.cover = response[0].cover;
            $scope.description = response[0].description;
        });
        
}])