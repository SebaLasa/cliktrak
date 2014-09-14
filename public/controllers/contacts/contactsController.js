angular.module('clicks').controller('contactsController', function ($scope, $http) {
    $http.get('/api/contacts/')
        .success(function (data, status) {
            $scope.contacts = data;
        });

    $scope.deleteContact = function (id) {
        $http.delete('/api/contacts/' + id)
            .success(function (data, status) {
                loadContacts();
            });
    };
});