app.controller('contactsController', function ($scope, $http) {
    $http.get('/api/contacts/')
        .success(function (data, status) {
            $scope.contacts = data;
        });
});