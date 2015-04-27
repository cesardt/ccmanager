angular.module('MyApp')
.controller('ComicDetailController', ['$scope', '$http', '$routeParams', '$cookieStore', function($scope, $http, $routeParams, $cookieStore) {

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

            if($cookieStore.get('mail') != null){
                $scope.isLogged = true;

                $http.get("/user_has_comic/?mail="+$cookieStore.get('mail')+"&comic="+$scope.comic_id).success(function(response){
                    console.log(response);
                    if(response.length > 0){
                        $scope.hasComic = true;
                    }
                    
                });
            }

            if($scope.isLogged){

            }
        });

        if($scope.isLogged && $scope.hasComic){
            $http.get("/review/?mail="+$cookieStore.get('mail')+"&comic="+$scope.comic_id).success(function(response){
            $scope.review.content = response[0].content; 
            $scope.review.score =  response[0].score;
            });
        }

        /*$http.get("/reviews/10", $scope.comic_id).success(function(response){
            $scope.reviews = response;
        });*/

        $scope.addToCollection = function(){

            var set = {
                comic_id: $scope.comic_id,
                mail: $cookieStore.get('mail')
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
                mail: $cookieStore.get('mail'),
                comic_id: $scope.comic_id
            }

            console.log($scope.review.content);
            console.log($scope.review.score);

            $http.post('/add_review', set).success(function(response){
                console.log("Added comic "+ response);
            });
        }

        $scope.updateReview = function(){
    
        }
}])