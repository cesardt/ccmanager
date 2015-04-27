angular.module('MyApp')
.controller('ComicDetailController', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

        $scope.title = "No title found";
        $scope.issue =  -1;
        $scope.cover = "/images/noCover.jpg";
        $scope.description = "The comic was not found or the comic has no description";
        $scope.comic_id = $routeParams.id;
        $scope.reviews = [];
        $scope.hasComic = false;
        $scope.isLogged = false;


        $http.get("/comics/"+$scope.comic_id).success(function(response){
            $scope.title = response[0].name;
            $scope.issue =  response[0].issue;
            $scope.cover = response[0].cover;
            $scope.description = response[0].description;
        });

        /*if(isLogged){
            $http.get("/review", {user: $scope.user_id, comic: $scope.comic_id}).success(funnction(response){
            $scope.review.content = response[0].content; 
            $scope.review.score =  response[0].score;
            });
        }*/

        /*$http.get("/reviews/10", $scope.comic_id).success(function(response){
            $scope.reviews = response;
        });*/

        $scope.addToCollection = function(){

            var set = {
                comic_id : $scope.comic_id,
                mail : $scope.user_mail
            }

            $http.post('/add_comic',set);
        }
        
        $scope.removeFromCollection = function(){
            var set = {
                comic_id : $scope.comic_id,
                mail : $scope.user_mail
            }

            $http.delete('/delete_user_comic', set);
        }

        $scope.addReview = function(){
            var set = {
                content: $scope.review.content,
                score: $scope.review.score,
                user_id: $rootScope.user.mail,
                comics_id: $scope.comic_id
            }

            console.log($scope.review.content);
            console.log($scope.review.score);

            $http.post('add_review', set);
        }

        $scope.updateReview = function(){
    
        }
}])