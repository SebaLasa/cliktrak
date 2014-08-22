angular.module('clicks').filter('dateTime', function ($filter) {
    return function (date) {
        return $filter('date')(date, 'dd/MM/yyyy HH:mm');
    }
});