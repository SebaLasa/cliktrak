angular.module('clicks').controller('customPageEditorController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/pages/').success(function (data, status) {
        $scope.pages = data;
    });
    if ($routeParams.id) {
        $http.get('/api/customPages/' + $routeParams.id)
            .success(function (data, status) {
                $scope.customPage = data;
            }).error(function (data, status) {
                $location.path('customPages');
            });
    }

    $scope.save = function () {
        if ($routeParams.id) {
            return $http.put('/api/customPages/' + $routeParams.id, $scope.customPage)
                .success(function (data, status) {
                    $location.path('customPages');
                });
        }
        $http.post('/api/customPages/', $scope.customPage)
            .success(function (data, status) {
                $location.path('customPages');
            });
    }
});
