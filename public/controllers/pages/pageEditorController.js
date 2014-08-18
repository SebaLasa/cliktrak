angular.module('clicks').controller('pageEditorController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/layouts/').success(function (data, status) {
        $scope.layouts = data;
    });
    $scope.$watch(function () {
        return $($scope.page.html).find('.staticBarcode').length;
    }, function (newValue) {
        $scope.urlConfiguration.barcodeGenerated = !!newValue;
    });
    $scope.$watch(function () {
        return $($scope.page.html).find('.staticQr').length;
    }, function (newValue) {
        $scope.urlConfiguration.qrGenerated = !!newValue;
    });

    if ($routeParams.id) {
        $http.get('/api/pages/' + $routeParams.id)
            .success(function (data, status) {
                $scope.page = data;
            }).error(function (data, status) {
                $location.path('pages');
            });
    } else {
        $scope.page = {};
        $scope.urlConfiguration = {};
    }

    $scope.addBarcode = function () {
        if ($($scope.page.html).find('.staticBarcode').length) {
            return alert('Ya ingreso un barcode estático');
        }
        $scope.page.html += '<img class="staticBarcode" src="/images/bcE.gif"/>';
    };
    $scope.addQrCode = function () {
        if ($($scope.page.html).find('.staticQr').length) {
            return alert('Ya ingreso un QR code estático');
        }
        $scope.page.html += '<img class="staticQr" src="/images/qrE.png"/>';
    };
    $scope.save = function () {
        if ($routeParams.id) {
            return $http.put('/api/pages/' + $routeParams.id, $scope.page)
                .success(function (data, status) {
                    $location.path('pages');
                });
        }
        $http.post('/api/pages/', $scope.page)
            .success(function (data, status) {
                $location.path('pages');
            });
    };
});
