angular.module('MyApp')
.controller('LoginController', ['$scope', '$http','$location','$rootScope','$cookieStore',  function($scope,$http,$location,$rootScope, $cookieStore) {

    $scope.login=function(){

        var set= {
         mail : $scope.mail,
         password:$scope.password

     }

     $http.post("/login",set).success(function(response){
        console.log(response);
        $cookieStore.put('mail',$scope.mail );
        $location.path( "/" );


    }). error(function(data, status, headers, config) {
        alert("Incorrect login")

    })


}


}]);