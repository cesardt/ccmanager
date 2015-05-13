angular.module('MyApp')
.factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore','$route', function($http, $location, $rootScope, $cookieStore,$route) {
    $rootScope.currentUser = $cookieStore.get('user');
    //$cookieStore.remove('user');

    return {
      login: function(user) {
        console.log(user);
        return $http.post("/login",user).success(function(response){
        console.log(response);
        $cookieStore.put('mail',user.mail);
        $location.path( "/" );


    }). error(function(data, status, headers, config) {
        $route.reload();

    })

          
       

      },
      signup: function(user) {
        console.log(user);
        return $http.post('/add_user', user).success(function(data) {
         $cookieStore.put('mail',user.mail );
         $location.path('/');
       }). error(function(data, status, headers, config) {
        $route.reload();

      })

     },


   };
 }]);


