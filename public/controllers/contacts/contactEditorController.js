angular.module('clicks').controller('contactEditorController', function ($scope, $http, $location, $routeParams) {
    if ($routeParams.id) {
        $http.get('/api/contacts/' + $routeParams.id)
            .success(function (data, status) {
                $scope.contact = data;
                if ($scope.contact.birthDate) {
                    $scope.contact.birthDate = $scope.contact.birthDate.substr(0, 10);
                }

                $scope.pageTitle = data.name + ' ' + data.surname;
            }).error(function (data, status) {
                $location.path('contacts');
            });
    } else {
        $scope.pageTitle = 'Nuevo contacto';
    }

    $scope.save = function () {
        if ($routeParams.id) {
            return $http.put('/api/contacts/' + $routeParams.id, $scope.contact)
                .success(function (data, status) {
                    $location.path('contacts');
                });
        }
        $http.post('/api/contacts/', $scope.contact)
            .success(function (data, status) {
                $location.path('contacts');
            });
    }
});