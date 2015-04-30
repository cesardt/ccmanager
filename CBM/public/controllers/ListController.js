angular.module('MyApp')
.controller('ListController', ['$scope', '$http', function($scope, $http) {

        $scope.comics = [];
        $scope.series = [];
        $scope.publishers = [];
        $scope.searched = [];
        $scope.currentPage = 1;
        $scope.pages = [];
        $scope.filteredComics = [];
        $scope.filteredSeries = [];
        $scope.comicsInPage = [];
        $scope.publishersFilter = "";
        $scope.seriesFilter = "";


        $http.get("/comics").success(function(response){
            $scope.comics = response;
            $scope.filteredComics = response;
            $scope.filter();
        });

        $http.get("/series").success(function(response){
            $scope.series = response;
            $scope.filteredSeries = response;
        });

        $http.get("/publishers").success(function(response){
            $scope.publishers = response;
        });

        $scope.filter = function(){
            $scope.comicsInPage = [];
            $scope.filteredComics = $scope.comics;
            $scope.filteredSeries = $scope.series;
            if($scope.publishersFilter != "" && $scope.publishersFilter != null){
                $scope.filteredSeries = $scope.filteredSeries.filter(seriesIsFromPublisher);
                $scope.filteredComics = $scope.filteredComics.filter(comicIsFromPublisher);
                function seriesIsFromPublisher(value){
                    if(value.publisher == $scope.publishersFilter.publisher){
                        return value;
                    }
                }

                function comicIsFromPublisher(value){
                    if(value.publisher == $scope.publishersFilter.publisher){
                        return value;
                    }
                }

            }
            else{
                $scope.filteredSeries = $scope.series;
            }

            if($scope.seriesFilter != "" && $scope.seriesFilter != null){
                $scope.filteredComics = $scope.filteredComics.filter(isFromSeries);
                function isFromSeries(value){
                    console.log(value);
                    if(value.series_id == $scope.seriesFilter.idseries){
                        return value;
                    }
                }
            }


            for(var i = 0; i < 12; i++){
                if(i >= $scope.filteredComics.length || ($scope.filteredComics[(12*($scope.currentPage-1))+i]) == undefined){
                    break;
                }
                    
               $scope.comicsInPage[i] = $scope.filteredComics[(12*($scope.currentPage-1))+i];
            }

            $scope.pages = [];
            for(var i = 0; i < Math.ceil($scope.filteredComics.length/12); i++){
                $scope.pages[i] = i+1;
            }
        }

        $scope.goToPage = function(page){
            $scope.currentPage = page;
            $scope.filter();
        }
        
}])