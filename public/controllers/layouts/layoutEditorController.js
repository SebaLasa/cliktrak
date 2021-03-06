angular.module('clicks').controller('layoutEditorController', function ($scope, $http, $location, $routeParams, $upload) {

        $scope.tinymceOptions = {
            plugins: "textcolor link table",
            toolbar: "undo redo | styleselect | alignleft aligncenter alignright alignfull | bold italic underline | forecolor backcolor | link table"
        };

        if ($routeParams.id) {
            $http.get('/api/layouts/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.layout = data;
                    $scope.pageTitle = data.name;
                });
        } else {
            $scope.pageTitle = 'Nuevo diseño';
        }

        $scope.onFileSelect = function (files) {
            $scope.layout.file = files[0];
        };

        $scope.save = function () {
            $scope.upload = $upload.upload({
                url: $routeParams.id ? '/api/layouts/' + $routeParams.id : '/api/layouts',
                method: $routeParams.id ? "PUT" : "POST",
                data: {layout: $scope.layout},
                file: $scope.layout.file // or list of files ($files) for html5 only
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $location.path('layouts');
            });
        };
    }
);