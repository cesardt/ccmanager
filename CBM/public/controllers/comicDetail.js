angular.module('MyApp')
.controller('ComicDetailController', ['$scope', '$routeParams', '$http', '$cookieStore', '$window', 'Comic', 'Review', function($scope, $routeParams, $http, $cookieStore, $window, Comic, Review) {

        $scope.reviews = [];
        $scope.hasComic = false;
        $scope.isLogged = false;
        $scope.hasReviewed = false;

        if($cookieStore.get('mail') != null){
            $scope.isLogged = true;
            Comic.getComic($routeParams.id).success(function(data){
                $scope.comic = data[0];
                $http.get("/user_has_comic/?mail="+$cookieStore.get('mail')+"&comic="+$scope.comic.idcomics).success(function(response){
                    if(response.length > 0){
                        $scope.hasComic = true;
                    }

                    if($scope.isLogged && $scope.hasComic){
                        $http.get("/review/?mail="+$cookieStore.get('mail')+"&comic="+$scope.comic.idcomics).success(function(response){
                            if(response.length > 0){
                                $scope.hasReviewed = true;
                                Review.getReview($cookieStore.get('mail'),$scope.comic.idcomics).success(function(data){
                                    $scope.review = data[0];
                                });
                            }

                        });
                    }
                        
                });
                Review.getRelatedReviews($scope.comic.idcomics).success(function(data){
                    $scope.reviews = data;
                }); 
            });
            
        }

        $scope.addToCollection = function(){

            var set = {
                comic_id: $scope.comic.idcomics,
                mail: $cookieStore.get('mail')
            }

            $http.post('/add_comic',set).success(function(response){
                $window.location.reload();
            });
        }
        
        $scope.removeFromCollection = function(){
            var set = {
                comic_id : $scope.comic.idcomics,
                mail : $cookieStore.get('mail')
            }

            console.log($cookieStore.get('mail'));


            $http.put('/delete_user_comic', set).success(function(response){
                $window.location.reload();
            });
        }

        $scope.addReview = function(){
            var set = {
                content: $scope.review.content,
                score: $scope.review.score,
                mail: $cookieStore.get('mail'),
                comic_id: $scope.comic.idcomics
            }

            $http.post('/add_review', set).success(function(response){
                $window.location.reload();
            });
        }

        $scope.updateReview = function(){
            var set = {
                content: $scope.review.content,
                score: $scope.review.score,
                mail: $cookieStore.get('mail'),
                comic_id: $scope.comic.idcomics
            }

            $http.put('/update_review', set).success(function(response){
                $window.location.reload();
            });
        }
}]);