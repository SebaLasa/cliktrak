angular.module('clicks').controller('contactDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/contacts/' + $routeParams.id)
        .success(function (data, status) {
            $scope.contact = data;
        });

    $scope.delete = function () {
        $http.delete('/api/contacts/' + $routeParams.id)
            .success(function (data, status) {
                $location.path('contacts');
            });
    };
});