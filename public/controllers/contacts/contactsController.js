angular.module('clicks').controller('contactsController', function ($scope, $http) {
    $http.get('/api/contacts/')
        .success(function (data, status) {
            $scope.contacts = data;
        });

    $scope.filterContacts = function (contact) {
        if (!$scope.searchValue || !$scope.searchValue.trim()) {
            return true;
        }

        var values = $scope.searchValue.split(' ');
        return _.every(values, function (value) {
            value = value.trim().toLowerCase();
            return contact.name.toLowerCase().indexOf(value) > -1 || contact.surname.toLowerCase().indexOf(value) > -1;
        });
    };
});