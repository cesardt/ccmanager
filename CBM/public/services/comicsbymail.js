angular.module('MyApp')
.factory('ComicsByMail', ['$http','$route', function($http,$route) {
      
    return {
     
      get: function(mail) {
        
        return $http.get('/comics_by_user?mail='+mail).success(function(response) {
          
           return response;
       }). error(function(data, status, headers, config) {
        //$route.reload();

      })

     },


   };
 }]);


