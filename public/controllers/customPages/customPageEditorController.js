angular.module('clicks').controller('customPageEditorController', function ($scope, $http, $location, $routeParams, $window) {
    $scope.host = $window.location.host;

    if ($routeParams.id) {
        $http.get('/api/customPages/' + $routeParams.id)
            .success(function (data, status) {
                data.dateStart = data.dateStart.substr(0, 10);
                data.dateEnd = data.dateEnd.substr(0, 10);
                $scope.customPage = data;
                $scope.urlConfiguration = data.urlConfiguration;
                $scope.pageTitle = data.name;
            }).error(function (data, status) {
                $location.path('customPages');
            });
    } else {
        $scope.pageTitle = 'Nueva página personalizada';
        $scope.customPage = { };
        if ($routeParams.staticId) {
            $scope.customPage.page = $routeParams.staticId;
        }
    }
    $http.get('/api/pages/active')
        .success(function (data, status) {
            if (!data.length) {
                alert('Debe dar de alta una página para poder crear una página personalizada.');
                return $location.path('pages/new');
            }
            $scope.pages = data;
            if (!$scope.customPage.page) {
                $scope.customPage.page = data[0]._id;
            }
        });

    $scope.pageSelected = function () {
        var page = _.find($scope.pages, { _id: $scope.customPage.page });

        $scope.customPage.barcodes = _.map(_.range(page.quantityDynamicBarcodes), function () {
            return {};
        });
        $scope.customPage.qrCodes = _.map(_.range(page.quantityDynamicQrCodes), function () {
            return {};
        });
    };

    $scope.save = function () {
        var data = { customPage: $scope.customPage, urlConfiguration: $scope.urlConfiguration };
        if ($routeParams.id) {
            return $http.put('/api/customPages/' + $routeParams.id, data)
                .success(function (data, status) {
                    $location.path('customPages');
                });
        }
        $http.post('/api/customPages/', data)
            .success(function (data, status) {
                $location.path('customPages');
            });
    };
});
