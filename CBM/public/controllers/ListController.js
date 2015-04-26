angular.module('MyApp')
.controller('ListController', ['$scope', '$http', function($scope, $http) {

        $scope.comics = [];
        $scope.series = [];
        $scope.publishers = [];
        $scope.searched = [];

        $http.get("/comics").success(function(response){
            $scope.comics = response;
        });

        $http.get("/series").success(function(response){
            $scope.series = response;
        });

        $http.get("/publishers").success(function(response){
            $scope.publishers = response;
        });

        console.log($scope);

        $scope.filterSeries = function(){

            function belongsTo(value){
                if(value.series_id == $scope.title.idseries){
                    return value;
                }
            }

            var filtered = $scope.comics.filter(belongsTo);
            $scope.comics = filtered;
        }

        $scope.filterByPublishers = function(){
            function belongsToP(value){
                console.log(value);
                if(value.publishers == $scope.element.publisher){
                    return value;
                }
            }

            var filtered = $scope.comics.filter(belongsToP);
            $scope.comics = filtered;
        }
        
}])