angular.module('clicks').controller('contactUploadController', function ($scope, $http, $location, $routeParams, $upload) {
    $scope.onFileSelect = function (files) {
        $scope.file = files[0];
    };

    $scope.save = function () {
        $upload.upload({
            url: '/api/contacts/upload',
            method: "POST",
            data: {options: $scope.options},
            file: $scope.file // or list of files ($files) for html5 only
        }).progress(function (evt) {
            console.log('percent:', parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (data, status, headers, config) {
            // file is uploaded successfully
            $location.path('contacts');
        });
    };
});