angular.module('MyApp')
.factory('Review', ['$http', function($http) {
  return {
    getReview: function(user_id, comic_id){
      return $http.get('comics/mail='+user_id+'?comic='+comic_id).success(function(response){
          var review = [];
          review.idreviews = response[0].idreviews;
          review.content = response[0].content;
          review.score = response[0].score;
          review.user_id = response[0].user_id;
          review.comics_id = response[0].comics_id;
          return review;
      }).error(function(){
          return null;
      });
    
    }
  }
}]);