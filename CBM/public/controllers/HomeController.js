angular.module('MyApp')
.controller('HomeController', ['$scope', '$http', function($scope, $http) {

        $scope.comics = [];
        $scope.marvelComics = [];
        $scope.dcComics = [];

        $http.get("/weekly_comics").success(function(response){
            $scope.comics = response;
            $scope.marvelComics = $scope.comics.filter(isMarvel);
            $scope.dcComics = $scope.comics.filter(isDC);

            function isMarvel(value){
                if(value.publisher == "Marvel"){
                    return value;
                }
             }

            function isDC(value){
                if(value.publisher == "DC"){
                    return value;
                }
             }



        });
        
}])