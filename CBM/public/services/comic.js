angular.module('MyApp')
  .factory('Comic', ['$resource', function($resource) {
    return $resource('/comics/:id');
  }]);