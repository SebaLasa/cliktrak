angular.module('clicks').controller('customPagesDeleteController', function ($scope, $http, $location, $routeParams) {
        $http.get('/api/customPages/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.customPage = data;
                });
        
       $scope.delete = function () {
            if ($routeParams.id) {
                return $http.delete('/api/customPages/' + $routeParams.id, $scope.customPage)
                    .success(function (data, status) {
                        $location.path('customPages');
                    });
            }
            $http.post('/api/customPages/', $scope.customPage)
                .success(function (data, status) {
                    $location.path('customPages');
                });
        }
})