angular.module('MyApp')
.factory('Comic', ['$http', function($http) {
  return {
    getComic: function(id){
      return $http.get('comics/'+id).success(function(response){
          var comic = [];
          comic.idcomics = response[0].idcomics;
          comic.title = response[0].name;
          comic.issue = response[0].issue;
          comic.cover = response[0].cover;
          comic.description = response[0].description;
          return comic;
      }).error(function(){
          return null;
      });
    
    }
  }
}]);