angular.module('MyApp')
.controller('LoginController', ['$scope', 'Auth', '$route' ,'$cookieStore','$location', function($scope,Auth,$route,$cookieStore,$location) {
    var response;
    $scope.login = function() {
       Auth.login({
          mail: $scope.email,
          password: $scope.password
      }).success(function(data){
        console.log(data)
        if(data=='true'){
           $cookieStore.put('mail',$scope.email);
           $location.path( "/" );
       }
       else{
        $route.reload();
    }

});

  };


}]);