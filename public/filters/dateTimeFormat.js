angular.module('clicks').filter('dateTimeFormat', function ($filter) {
    return function (date) {
        return $filter('date')(date, 'dd/MM/yyyy HH:mm');
    }
});