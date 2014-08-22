angular.module('clicks').controller('layoutsDeleteCtrl', function ($scope, $http, $location, $routeParams) {
        $http.get('/api/layouts/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.layout = data;
                });
        
       $scope.delete = function () {
            if ($routeParams.id) {
                return $http.delete('/api/layouts/' + $routeParams.id, $scope.layout)
                    .success(function (data, status) {
                        $location.path('layouts');
                    });
            }
            $http.post('/api/layouts/', $scope.layout)
                .success(function (data, status) {
                    $location.path('layouts');
                });
        }
})