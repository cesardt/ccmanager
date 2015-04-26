angular.module('MyApp')
.controller('SignUpController', ['$scope', '$http','$location','$rootScope','$cookieStore',  function($scope,$http,$location,$rootScope, $cookieStore) {

    $scope.signup=function(){
        var set= {
         mail : $scope.mail,
         password:$scope.password

     }

     $http.post("/add_user",set).success(function(response){
        $cookieStore.put('mail',$scope.mail );
        
        $location.path( "/" );


    }). error(function(data, status, headers, config) {
        alert("This mail already exists")

    })


}


}]);