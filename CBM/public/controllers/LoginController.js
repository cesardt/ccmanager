angular.module('MyApp')
.controller('LoginController', ['$scope', 'Auth',  function($scope,Auth) {
    var response;
    $scope.login = function() {
        response= Auth.login({
          mail: $scope.email,
          password: $scope.password
      });
     console.log(response);
    };
   

}]);