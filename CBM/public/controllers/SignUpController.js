angular.module('MyApp')
.controller('SignUpController', ['$scope','Auth',  function($scope,Auth) {
  $scope.signup = function() {
    Auth.signup({
      mail: $scope.email,
      password: $scope.password
    });
  };

}]);