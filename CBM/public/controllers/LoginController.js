angular.module('MyApp')
.controller('LoginController', ['$scope', 'Auth',  function($scope,Auth) {

    $scope.login = function() {
        Auth.login({
          mail: $scope.email,
          password: $scope.password
      });
    };

}]);