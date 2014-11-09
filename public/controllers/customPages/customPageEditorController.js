angular.module('clicks').controller('customPageEditorController', function ($scope, $http, $location, $routeParams, $window) {
    $scope.host = $window.location.host;
    function loadPages() {
        $http.get('/api/pages/active')
            .success(function (data, status) {
                if (!data.length) {
                    alert('Debe dar de alta una página para poder crear una página personalizada.');
                    return $location.path('pages/new');
                }
                $scope.pages = data;
                if ($scope.customPage.page) {
                    var page = _.find($scope.pages, { _id: $scope.customPage.page });
                    $scope.customPage.barcodes = $scope.customPage.barcodes.slice(0, page.quantityDynamicBarcodes);
                    _.forEach(_.range(page.quantityDynamicBarcodes - $scope.customPage.barcodes), function () {
                        $scope.customPage.barcodes.push({});
                    });

                    $scope.customPage.qrCodes = $scope.customPage.qrCodes.slice(0, page.quantityDynamicQrCodes);
                    _.forEach(_.range(page.quantityDynamicQrCodes - $scope.customPage.qrCodes), function () {
                        $scope.customPage.qrCodes.push({});
                    });
                } else {
                    $scope.customPage.page = data[0]._id;
                }

                if ($routeParams.staticId) {
                    $scope.customPage.page = $routeParams.staticId;
                    $scope.pageSelected();
                }
            });
    }

    if ($routeParams.id) {
        $http.get('/api/customPages/' + $routeParams.id)
            .success(function (data, status) {
                data.dateStart = data.dateStart.substr(0, 10);
                data.dateEnd = data.dateEnd.substr(0, 10);
                $scope.customPage = data;
                $scope.urlConfiguration = data.urlConfiguration;
                $scope.pageTitle = data.name;
                loadPages();
            }).error(function (data, status) {
                $location.path('customPages');
            });
    } else {
        $scope.pageTitle = 'Nueva página personalizada';
        $scope.customPage = { };
        loadPages();
    }

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
