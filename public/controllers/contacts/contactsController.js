angular.module('clicks').controller('contactsController', function ($scope, $http) {
    function loadContacts() {
        $http.get('/api/contacts/')
            .success(function (data, status) {
                $scope.contacts = data;
            });
    }

    $scope.deleteContact = function (id) {
        $http.delete('/api/contacts/' + id)
            .success(function (data, status) {
                loadContacts();
            });
    };
    loadContacts();
}).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}]);