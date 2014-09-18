angular.module('clicks').controller('layoutEditorController', function ($scope, $http, $location, $routeParams,$upload) {
        if ($routeParams.id) {
            $http.get('/api/layouts/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.layout = data;
                });
        }

        $scope.onFileSelect = function($files) {
            $scope.layout.file = $files[0];
        }

        $scope.save = function () {
            /*if ($routeParams.id) {
                return $http.put('/api/layouts/' + $routeParams.id, $scope.layout)
                    .success(function (data, status) {
                        $location.path('layouts');
                    });
            }*/

            $scope.upload = $upload.upload({
                url: $routeParams.id ? '/api/layouts/' + $routeParams.id :'/api/layouts/' ,
                method: $routeParams.id ? "PUT" : "POST",
                data: {layout: $scope.layout},
                file: $scope.layout.file // or list of files ($files) for html5 only
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                $location.path('layouts');
            });
            /*$http.post('/api/layouts/', $scope.layout)
                .success(function (data, status) {
                    $location.path('layouts');
                });*/


        };
    }
);