angular.module('MyApp')
.controller('NavBarController', ['$scope', '$cookieStore','$rootScope',  function($scope,$cookieStore,$rootScope) {

            $scope.exists = function(){

                    if($cookieStore.get('mail')!=null){
                       $rootScope.user= $cookieStore.get('mail');
                       return true;
                    }
                    else{
                       return false;
                    }



            }
            $scope.logout = function(){

                    $cookieStore.remove('mail')

            }
           

}]);